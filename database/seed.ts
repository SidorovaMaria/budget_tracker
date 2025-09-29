import Theme, { ITheme } from "./models/theme.model";

const defaultThemes: ITheme[] = [
  { name: "Green", key: "#green", value: "#277C78" },
  { name: "Yellow", key: "#yellow", value: "#F2CDAC" },
  { name: "Cyan", key: "#cyan", value: "#82C9D7" },
  { name: "Navy", key: "#navy", value: "#626070" },
  { name: "Red", key: "#red", value: "#C94736" },
  { name: "Purple", key: "#purple", value: "#826CB0" },
  { name: "Turquoise", key: "#turquoise", value: "#597C7C" },
  { name: "Brown", key: "#brown", value: "#93674F" },
  { name: "Magenta", key: "#magenta", value: "#934F6F" },
  { name: "Blue", key: "#blue", value: "#3F82B2" },
  { name: "Grey", key: "#grey", value: "#97A0AC" },
  { name: "Army", key: "#army", value: "#7F9161" },
  { name: "Pink", key: "#pink", value: "#AF81BA" },
  { name: "Gold", key: "#gold", value: "#CAB361" },
  { name: "Orange", key: "#orange", value: "#BE6C49" },
];

export async function seedDefaultThemes() {
  const themeCount = await Theme.countDocuments();
  if (themeCount === 0) {
    await Theme.insertMany(defaultThemes);
    console.log("Default themes seeded successfully.");
  }
}
