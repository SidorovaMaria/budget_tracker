import { Document, model, models, Schema } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  image?: string;
  balance: {
    current: number;
    income: number;
    expenses: number;
  };
}

export interface IUserDoc extends IUser, Document {}
const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, default: "https://avatar.iran.liara.run/public" },
    balance: {
      current: { type: Number, default: 0 },
      income: { type: Number, default: 0 },
      expenses: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", UserSchema);
export default User;
