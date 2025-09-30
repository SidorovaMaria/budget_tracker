import { Decimal128, Document, model, models, Schema } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  image?: string;
  balance: {
    current: Decimal128;
    income: Decimal128;
    expenses: Decimal128;
  };
}

export interface IUserDoc extends IUser, Document {}
const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, default: "https://avatar.iran.liara.run/public" },
    balance: {
      current: { type: Schema.Types.Decimal128, default: 0 },
      income: { type: Schema.Types.Decimal128, default: 0 },
      expenses: { type: Schema.Types.Decimal128, default: 0 },
    },
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

        ret.balance.current = conv(ret.balance.current);
        ret.balance.income = conv(ret.balance.income);
        ret.balance.expenses = conv(ret.balance.expenses);
        return ret;
      },
    },
  }
);

const User = models?.User || model<IUser>("User", UserSchema);
export default User;
