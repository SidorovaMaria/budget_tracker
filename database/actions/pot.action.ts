"use server";
import { validateAction } from "@/lib/handler/validate";
import { AddWithdrawFromPotSchema, DeletePotSchema, PotSchema } from "@/lib/validation/validation";
import Pot from "../models/pot.model";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";
import { auth } from "@/auth";
import z from "zod";
import User from "../models/user.model";
import mongoose from "mongoose";

/* =========================
   CREATE
========================= */
export async function createPot(name: string, target: number, themeId: string) {
  const validated = await validateAction({
    params: { name, target, themeId },
    schema: PotSchema,
    authorize: true,
  });
  if (!validated.success) return validated;

  const { params, session } = validated;

  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  //Create Pot

  try {
    const [existingPot, existingTheme] = await Promise.all([
      Pot.exists({ ownerId: session.user.id, name: params.name }),
      Pot.exists({ ownerId: session.user.id, themeId: params.themeId }),
    ]);
    if (existingPot) {
      return {
        success: false,
        status: 400,
        error: { message: "You already have a pot with this name" },
      };
    }
    if (existingTheme) {
      return {
        success: false,
        status: 400,
        error: { message: "You already use this color tag for another pot" },
      };
    }
    const newPot = await Pot.create({
      ownerId: session.user.id,
      name: params.name,
      target: params.target,
      themeId: params.themeId,
    });
    revalidatePath(ROUTES.POTS);
    return { success: true, status: 201, data: JSON.parse(JSON.stringify(newPot)) };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: { message: String(error) },
    };
  }
}
/* =========================
   READ
========================= */
export async function getPots(): Promise<ActionResponse<PotJSON[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, status: 401, error: { message: "Unauthorized" } };
    }
    //Fetch Pots
    const pots = await Pot.find({ ownerId: session.user.id }).populate("themeId");
    if (!pots) {
      return { success: false, status: 404, error: { message: "We could not find any pots" } };
    }
    return { success: true, status: 200, data: JSON.parse(JSON.stringify(pots)) };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: { message: String(error) },
    };
  }
}
// =========================
// UPDATE
// =========================

export async function updatePot(potId: string, name: string, target: number, themeId: string) {
  const validated = await validateAction({
    params: { potId, name, target, themeId },
    schema: PotSchema.extend({ potId: z.string().min(1, { error: "Missing pot ID" }) }),
    authorize: true,
  });
  if (!validated.success) return validated;

  const { params, session } = validated;

  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }

  try {
    const pot = await Pot.findOne({ _id: params.potId, ownerId: session.user.id });
    if (!pot) {
      return {
        success: false,
        status: 404,
        error: { message: "We could not find the specified pot" },
      };
    }
    pot.name = params.name;
    pot.target = params.target;
    pot.themeId = params.themeId;
    await pot.save();
    revalidatePath(ROUTES.POTS);
    return { success: true, status: 200, data: JSON.parse(JSON.stringify(pot)) };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: { message: String(error) },
    };
  }
}

// =========================
// DELETE
// =========================
export async function deletePot(potId: string) {
  const validated = await validateAction({
    params: { potId },
    schema: z.object({ potId: z.string().min(1, { error: "Missing pot ID" }) }),
    authorize: true,
  });
  if (!validated.success) return validated;

  const { params, session: auth } = validated;

  if (!auth?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const potDoc = await Pot.findOne(
      { _id: params.potId, ownerId: auth.user.id },
      { total: 1 } // projection
    ).session(session);
    if (!potDoc) {
      throw new Error("Could not find that pot");
    }
    const refund = Number(potDoc.total?.toString?.() ?? 0);
    //No need to proceed if pot is empty
    if (refund > 0) {
      const user = await User.updateOne(
        { _id: auth.user.id },
        { $inc: { "balance.current": refund } },
        { session }
      );
      if (!user) {
        throw new Error("Could not refund user");
      }
    }
    await Pot.deleteOne({ _id: params.potId, ownerId: auth.user.id }).session(session);

    await session.commitTransaction();
    revalidatePath(ROUTES.POTS);
    return { success: true, status: 200, data: null };
  } catch (error) {
    await session.abortTransaction();
    return {
      success: false,
      status: 500,
      error: { message: String(error) },
    };
  } finally {
    await session.endSession();
  }
}
// =========================
// ADD / WITHDRAW FROM POT
// =========================

export async function addToPot(potId: string, amount: number) {
  const validated = await validateAction({
    params: { potId, amount },
    schema: AddWithdrawFromPotSchema.extend({
      potId: z.string().min(1, { error: "Missing pot ID" }),
    }),
    authorize: true,
  });
  if (!validated.success) return validated;

  const { params, session: auth } = validated;

  if (!auth?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userDoc = await User.findById(auth.user.id).session(session);
    if (!userDoc) {
      throw new Error("User not found");
    }
    const currentBalance = Number(userDoc.balance.current.toString());
    if (currentBalance < params.amount) {
      throw new Error("Insufficient funds on your account");
    }
    //Update User balance
    await User.updateOne(
      { _id: auth.user.id },
      { $inc: { "balance.current": -params.amount } },
      { session }
    );
    //Update Pot total
    const updatedPot = await Pot.findOneAndUpdate(
      { _id: params.potId, ownerId: auth.user.id },
      { $inc: { total: params.amount } },
      { new: true, session }
    );
    if (!updatedPot) {
      throw new Error("We couldn't find that pot");
    }
    await session.commitTransaction();
    revalidatePath(ROUTES.POTS);
    return { success: true, status: 200, data: null };
  } catch (error) {
    await session.abortTransaction();
    return {
      success: false,
      status: 500,
      error: { message: String(error) },
    };
  } finally {
    await session.endSession();
  }
}

export async function withdrawFromPot(potId: string, amount: number) {
  const validated = await validateAction({
    params: { potId, amount },
    schema: AddWithdrawFromPotSchema.extend({
      potId: z.string().min(1, { error: "Missing pot ID" }),
    }),
    authorize: true,
  });
  if (!validated.success) return validated;

  const { params, session: auth } = validated;

  if (!auth?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }

  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    const userDoc = await User.findById(auth.user.id).session(session);
    if (!userDoc) {
      throw new Error("User not found");
    }
    const potDoc = await Pot.findOne({ _id: params.potId, ownerId: auth.user.id }).session(session);
    if (!potDoc) {
      throw new Error("Could not find that pot");
    }
    const potTotal = Number(potDoc.total.toString());
    if (potTotal < params.amount) {
      throw new Error("Insufficient funds in your pot");
    }
    await Pot.updateOne(
      { _id: params.potId, ownerId: auth.user.id },
      { $inc: { total: -params.amount } },
      { session }
    );
    await User.updateOne(
      { _id: auth.user.id },
      { $inc: { "balance.current": params.amount } },
      { session }
    );
    await session.commitTransaction();
    revalidatePath(ROUTES.POTS);
    return { success: true, status: 200, data: null };
  } catch (error) {
    await session.abortTransaction();
    return {
      success: false,
      status: 500,
      error: { message: String(error) },
    };
  } finally {
    await session.endSession();
  }
}
