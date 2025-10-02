import BalanceCard from "@/components/cards/BalanceCard";
import PotsOverview from "@/components/overview/PotsOverview";

import { loadDashboard } from "@/lib/loadDashBoard";

export default async function Home() {
  const { user, pots, totalSaved } = await loadDashboard();
  return (
    <>
      {/* Title */}
      <h1 id="overview" className="">
        Overview
      </h1>
      <section className="flex flex-col w-full gap-3  items-start justify-start md:flex-row md:gap-6">
        {(Object.keys(user.balance) as Array<keyof typeof user.balance>).map((key) => (
          <BalanceCard
            key={key}
            label={key === "current" ? "Current Balance" : key}
            value={user.balance[key]}
            card={key === "current" ? "current" : "default"}
          />
        ))}
      </section>
      <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-row-6 ">
        <div className="xl:[grid-area:1/1/3/2]">
          <PotsOverview pots={pots} total={totalSaved} />
        </div>
      </div>
    </>
  );
}
