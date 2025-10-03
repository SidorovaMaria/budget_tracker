import { AVATAR_PX } from "@/constants";
import { ITransactionDoc } from "@/database/models/transaction.model";
import { prefixFromNumber, toLocaleStringWithCommas } from "@/lib/utils";
import Image from "next/image";
import React, { JSX } from "react";
import IconBillPaid from "../icons/IconBillPaid";
import IconBillDue from "../icons/IconBillDue";
import IconCloseModal from "../icons/IconCloseModal";
type Props = {
  transaction: ITransactionDoc & { dayOfMonth: number; txMonth: number };
};
const RecuringTransactionCard = ({ transaction }: Props) => {
  const dayToday = new Date().getDate();
  //Since txMonth is 1-12
  const currentMonth = new Date().getMonth() + 1;

  let dueType;
  if (transaction.txMonth === currentMonth) {
    dueType = "paid";
  } else if (transaction.txMonth < currentMonth) {
    if (transaction.dayOfMonth <= dayToday) {
      dueType = "unpaid";
    } else if (transaction.dayOfMonth <= dayToday + 5) {
      dueType = "dueSoon";
    } else {
      dueType = "upcoming";
    }
  }

  return (
    <div
      className="grid grid-cols-1 gap-y-2 md:grid-cols-[3fr_2fr] py-5 not-last:lower-border-[0] group"
      data-due={dueType}
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Avatar: reserve space to avoid CLS, force square crop */}
        {transaction.avatar ? (
          <div className="relative" style={{ width: AVATAR_PX, height: AVATAR_PX }}>
            <Image
              src={transaction.avatar}
              alt={transaction.name}
              width={AVATAR_PX}
              height={AVATAR_PX}
              sizes={`${AVATAR_PX}px`}
              className="rounded-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className="rounded-full"
            style={{
              width: AVATAR_PX,
              height: AVATAR_PX,
            }}
            aria-hidden
          />
        )}
        <div className="flex flex-col min-w-0">
          <p className="text-preset-4-bold truncate">{transaction.name}</p>
        </div>
      </div>
      <div
        className="flex-row-between w-full group-data-[due=dueSoon]:text-s-red
          group-data-[due=unpaid]:text-s-red
          group-data-[due=paid]:text-s-green
          group-data-[due=upcoming]:text-s-blue "
      >
        <div className="flex items-center gap-2">
          <p className="text-preset-5">Monthly - {prefixFromNumber(transaction.dayOfMonth)}</p>
          <div className="flex flex-col items-center cursor-pointer group/icon relative">
            <div className="inline-flex" title={dueType || ""}>
              {IconTypeMap[dueType as string] || <></>}
            </div>
            {dueType !== "upcoming" && (
              <span className="text-preset-5-bold italic absolute  opacity-0 group-hover/icon:opacity-100 bottom-full mb-1 whitespace-nowrap transition-300">
                {dueType}
              </span>
            )}
          </div>
        </div>

        <p className="text-preset-4-bold ">
          {toLocaleStringWithCommas(Number(transaction.amount), "USD", 2)}
        </p>
      </div>
    </div>
  );
};

export default RecuringTransactionCard;

const IconTypeMap: Record<string, JSX.Element> = {
  paid: <IconBillPaid className="size-4 text-s-green" />,
  unpaid: <IconCloseModal className="size-4 text-s-red" />,
  dueSoon: <IconBillDue className="size-4 text-s-red" />,
  upcoming: <></>,
};
