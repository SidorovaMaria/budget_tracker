import { auth } from "@/auth";
import { Session } from "next-auth";
import { ZodError, ZodSchema, z } from "zod";
import connectDB from "../mongoose";

type ValidationParams<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

export async function validateAction<T>({
  params,
  schema,
  authorize = false,
}: ValidationParams<T>): Promise<
  ({ params: T; session: Session | null } & SuccessResponse) | ErrorResponse
> {
  //Schema Validation
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorTree = z.treeifyError(error);
        return {
          success: false,
          status: 400,
          error: {
            message: "Validation error",
            details: errorTree as Record<string, string[]>,
          },
        };
      }
      return { success: false, status: 400, error: { message: "Unknown validation error" } };
    }
  }
  //Aiuthorization
  let session: Session | null = null;
  if (authorize) {
    session = await auth();
    if (!session) {
      return { success: false, status: 401, error: { message: "Unauthorized" } };
    }
  }
  //Database Connection
  await connectDB();
  return { success: true, params: params as T, session };
}
