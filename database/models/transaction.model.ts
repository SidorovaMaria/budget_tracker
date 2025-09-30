import { decimalToNumber } from "@/lib/utils";
import { Document, model, models, Schema, Types } from "mongoose";

interface ITransaction {
  ownerId: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: string;
  amount: Types.Decimal128;
  type: "income" | "expense";
  date?: Date;
  recurring?: boolean;
  avatar?: string;
}
export interface ITransactionDoc extends ITransaction, Document {}
const TransactionSchema = new Schema<ITransaction>(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    categoryId: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
    name: { type: String, required: true },
    amount: { type: Schema.Types.Decimal128, required: true },
    type: { type: String, required: true, enum: ["income", "expense"] },
    date: { type: Date, default: Date.now },
    recurring: { type: Boolean, default: false },
    avatar: { type: String },
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

        ret.amount = conv(ret.amount);
        return ret;
      },
    },
  }
);

const Transaction = models?.Transaction || model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;
