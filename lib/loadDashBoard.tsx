import { getUser } from "@/database/actions/user.action";
import { unwrap } from "./utils";
import { getPots } from "@/database/actions/pot.action";

export async function loadDashboard() {
  // Kick both requests at once
  const [userRes, potsRes] = await Promise.all([getUser(), getPots()]);

  // Validate each independently (clear messages if one fails)
  const user = unwrap(userRes, "user data");
  const pots = unwrap(potsRes, "pots data");

  const totalSaved = pots.reduce((acc, pot) => acc + Number(pot.total), 0);

  return { user, pots: pots.slice(0, 4), totalSaved };
}
