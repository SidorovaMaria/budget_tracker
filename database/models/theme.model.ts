import { Document, model, models, Schema } from "mongoose";

export interface ITheme {
  name: string;
  key: string;
  value: string;
}

export interface IThemeDoc extends ITheme, Document {}

const ThemeSchema = new Schema<ITheme>({
  name: { type: String, required: true, unique: true },
  key: { type: String, required: true, unique: true }, //#navy, #green, #yellow etc
  value: { type: String, required: true }, //HEX value
});

const Theme = models?.Theme || model<ITheme>("Theme", ThemeSchema);
export default Theme;
