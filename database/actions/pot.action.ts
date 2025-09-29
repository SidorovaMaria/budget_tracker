"use server";
import { validateAction } from "@/lib/handler/validate";
import { PotSchema } from "@/lib/validation/validation";
import Pot from "../models/pot.model";

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
    const newPot = await Pot.create({
      ownerId: session.user.id,
      name: params.name,
      target: params.target,
      themeId: params.themeId,
    });
    return { success: true, status: 201, data: JSON.parse(JSON.stringify(newPot)) };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: { message: "Failed to create pot" + error },
    };
  }
}
