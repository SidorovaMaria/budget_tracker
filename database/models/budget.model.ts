import { decimalToNumber } from "@/lib/utils";
import { Document, model, models, Schema, Types } from "mongoose";

export interface IBudget {
  ownerId: Types.ObjectId;
  categoryId: Types.ObjectId;
  maximum: Types.Decimal128 | number;
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
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        // Convert Decimal128 to number for JSON responses
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const conv = (v: any) =>
          v && typeof v === "object" && v._bsontype === "Decimal128" ? Number(v.toString()) : v;

        ret.maximum = conv(ret.maximum);
        return ret;
      },
    },
  }
);
const Budget = models?.Budget || model<IBudget>("Budget", BudgetSchema);
export default Budget;
