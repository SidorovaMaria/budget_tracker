import Theme, { IThemeDoc } from "../models/theme.model";

export const getThemes = async (): Promise<ActionResponse<IThemeDoc[]>> => {
  try {
    const themes = await Theme.find();
    if (!themes) {
      return { success: false, status: 404, error: { message: "No themes found" } };
    }
    return { success: true, status: 200, data: themes };
  } catch (error) {
    console.log("Error fetching themes:", error);
    return { success: false, status: 500, error: { message: "Internal server error" } };
  }
};
