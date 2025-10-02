import { Document, model, models, Schema } from "mongoose";

export interface ICategory {
  name: string; //e.g. Food & Dining
  key: string; //slug version of name e.g. food-dining
}
export interface ICategoryDoc extends ICategory, Document {}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  key: { type: String, required: true, unique: true }, //slug version of name
});

const Category = models?.Category || model<ICategory>("Category", CategorySchema);
export default Category;
