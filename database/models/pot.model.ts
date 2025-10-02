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
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        // Convert Decimal128 to number for JSON responses
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const conv = (v: any) =>
          v && typeof v === "object" && v._bsontype === "Decimal128" ? Number(v.toString()) : v;

        ret.target = conv(ret.target);
        ret.total = conv(ret.total);
        return ret;
      },
    },
  }
);

const Pot = models?.Pot || model<IPot>("Pot", PotSchema);
export default Pot;
