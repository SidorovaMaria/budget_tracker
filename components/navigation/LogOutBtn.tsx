import { signOut } from "next-auth/react";
import React from "react";

const LogOutBtn = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit" className="btn btn-primary">
        Logout
      </button>
    </form>
  );
};

export default LogOutBtn;
