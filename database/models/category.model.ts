import { model, models, Schema, Types } from "mongoose";

interface ICategory {
  ownerId: Types.ObjectId;
  name: string;
  transactions?: Types.ObjectId[];
}
export interface ICategoryDoc extends ICategory, Document {}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  ownerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
});

CategorySchema.index({ name: 1 }, { unique: true });
const Category = models?.Category || model<ICategory>("Category", CategorySchema);
export default Category;
