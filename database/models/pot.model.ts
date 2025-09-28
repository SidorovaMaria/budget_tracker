import { Document, model, models, Schema, Types } from "mongoose";

interface IPot {
  ownerId: Types.ObjectId;
  name: string;
  target: Types.Decimal128;
  total: Types.Decimal128;
  themeId: Types.ObjectId;
}
export interface IPotDoc extends IPot, Document {}
const PotSchema = new Schema<IPot>(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    target: { type: Schema.Types.Decimal128, required: true, min: 0 },
    total: { type: Schema.Types.Decimal128, required: true, default: 0, min: 0 },
    themeId: { type: Schema.Types.ObjectId, required: true, ref: "Theme" },
  },
  { timestamps: true }
);

const Pot = models?.Pot || model<IPot>("Pot", PotSchema);
export default Pot;
