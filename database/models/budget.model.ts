import { decimalToNumber } from "@/lib/utils";
import { Document, model, models, Schema, Types } from "mongoose";

export interface IBudget {
  ownerId: Types.ObjectId;
  categoryId: Types.ObjectId;
  maximum: Types.Decimal128;
  themeId: Types.ObjectId;
}
export interface IBudgetDoc extends IBudget, Document {}

const BudgetSchema = new Schema<IBudget>(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    categoryId: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
    maximum: { type: Number, required: true, min: 0 },
    themeId: { type: Schema.Types.ObjectId, required: true, ref: "Theme" },
  },
  { timestamps: true }
);
const Budget = models?.Budget || model<IBudget>("Budget", BudgetSchema);
export default Budget;
