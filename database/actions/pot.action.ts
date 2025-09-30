"use server";
import { validateAction } from "@/lib/handler/validate";
import { DeletePotSchema, PotSchema } from "@/lib/validation/validation";
import Pot from "../models/pot.model";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";
import { auth } from "@/auth";

export async function createPot(name: string, target: number, themeId: string) {
  const validated = await validateAction({
    params: { name, target, themeId },
    schema: PotSchema,
    authorize: true,
  });
  if (validated.success === false) return validated;
  const { params, session } = validated;
  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  //Create Pot

  try {
    const existingPot = await Pot.exists({
      ownerId: session.user.id,
      name: params.name,
    });
    // Will Let the UI handle this, just a checker
    if (existingPot) {
      return {
        success: false,
        status: 400,
        error: { message: "Pot with this name already exists" },
      };
    }
    const existingTheme = await Pot.exists({
      ownerId: session.user.id,
      themeId: params.themeId,
    });
    // Will Let the UI handle this, just a checker
    if (existingTheme) {
      return {
        success: false,
        status: 400,
        error: { message: "Pot with this theme already exists" },
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
      error: { message: "Failed to create pot" + error },
    };
  }
}

export async function getPots() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, status: 401, error: { message: "Unauthorized" } };
    }
    //Fetch Pots
    const pots = await Pot.find({ ownerId: session.user.id }).populate("themeId");
    return { success: true, status: 200, data: JSON.parse(JSON.stringify(pots)) };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: { message: "Failed to retrieve pots" + error },
    };
  }
}

export async function updatePot(potId: string, name: string, target: number, themeId: string) {
  const validated = await validateAction({
    params: { potId, name, target, themeId },
    schema: PotSchema.extend({ potId: PotSchema.shape.themeId }),
    authorize: true,
  });
  if (validated.success === false) return validated;
  const { params, session } = validated;
  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  try {
    const pot = await Pot.findOne({ _id: params.potId, ownerId: session.user.id });
    if (!pot) {
      return { success: false, status: 404, error: { message: "Pot not found" } };
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
      error: { message: "Failed to update pot" + error },
    };
  }
}

export async function deletePot(potId: string) {
  const validated = await validateAction({
    params: { potId },
    schema: DeletePotSchema,
    authorize: true,
  });
  if (validated.success === false) return validated;
  const { params, session } = validated;
  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  try {
    const pot = await Pot.findOneAndDelete({ _id: params.potId, ownerId: session.user.id });
    if (!pot) {
      return { success: false, status: 404, error: { message: "Pot not found" } };
    }
    revalidatePath(ROUTES.POTS);
    return { success: true, status: 200, data: null };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: { message: "Failed to delete pot" + error },
    };
  }
}
