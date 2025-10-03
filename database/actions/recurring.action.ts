import { validateAction } from "@/lib/handler/validate";
import { SearchParamsSchema } from "@/lib/validation/validation";
import mongoose from "mongoose";
import Transaction, { ITransactionDoc } from "../models/transaction.model";
import { SortKey } from "@/constants";

type SortOrder = 1 | -1;

const daySortMapping: Record<SortKey, Record<string, SortOrder>> = {
  latest: { dayOfMonth: 1, name: 1, _id: 1 },
  newest: { dayOfMonth: 1, name: 1, _id: 1 },
  oldest: { dayOfMonth: -1, name: 1, _id: 1 },
  az: { name: 1, dayOfMonth: 1, _id: 1 },
  za: { name: -1, dayOfMonth: 1, _id: 1 },
  highest: { amount: -1, dayOfMonth: -1, _id: -1 },
  lowest: { amount: 1, dayOfMonth: 1, _id: 1 },
};
export type RecurringTransactionResponse = {
  transactions: (ITransactionDoc & { dayOfMonth: number; txMonth: number })[]; // paginated, sorted by your chosen key
  totalToPay: number; // sum over ALL unique recurring
  totalCount: number; // count of ALL unique recurring
  bucketSummary: {
    paid: { count: number; total: number };
    unpaid: { count: number; total: number };
    upcoming: { count: number; total: number };
    dueSoon: { count: number; total: number };
  };
};

export async function getRecurringTransactions(
  sort = "latest" as SortKey,
  search = "",
  page = 1,
  pageSize = 10
): Promise<ActionResponse<RecurringTransactionResponse>> {
  const validated = await validateAction({
    params: { sort, search, page, pageSize },
    schema: SearchParamsSchema,
    authorize: true,
  });
  if (!validated.success) return validated;
  const { session } = validated;
  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }

  const ownerId = new mongoose.Types.ObjectId(session.user.id);
  const sortClause = daySortMapping[sort] || daySortMapping.latest;

  const [result] = await Transaction.aggregate([
    { $match: { ownerId, recurring: true } },

    // Normalize for grouping & sorting
    {
      $set: {
        amount: { $toDouble: "$amount" }, // Decimal128 -> number
        _parts: { $dateToParts: { date: "$date", timezone: "Europe/London" } },
      },
    },
    { $set: { dayOfMonth: "$_parts.day" } },

    // Dedupe: keep most recent per (name, categoryId, dayOfMonth)
    { $sort: { date: -1, _id: -1 } },
    {
      $group: {
        _id: { name: "$name", categoryId: "$categoryId", day: "$dayOfMonth" },
        doc: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$doc" } },

    // Optional name search
    ...(search.trim() ? [{ $match: { name: { $regex: search.trim(), $options: "i" } } }] : []),

    // Today context + fields for bucket logic
    { $set: { todayParts: { $dateToParts: { date: "$$NOW", timezone: "Europe/London" } } } },
    {
      $set: {
        today: "$todayParts.day",
        txYear: "$_parts.year",
        txMonth: "$_parts.month",
      },
    },

    {
      $facet: {
        // overall unique totals (before pagination)
        meta: [{ $group: { _id: null, totalToPay: { $sum: "$amount" }, totalCount: { $sum: 1 } } }],

        // paginated, sorted list you actually display
        transactions: [
          { $sort: sortClause },
          { $skip: Math.max(0, (page - 1) * pageSize) },
          { $limit: pageSize },
          { $project: { _parts: 0, todayParts: 0 } },
        ],

        // --- Bucket summaries (count + total only) ---

        // Paid this month (day <= today, and tx in current month & year)
        paidSummary: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$txYear", "$todayParts.year"] },
                  { $eq: ["$txMonth", "$todayParts.month"] },
                  { $lte: ["$dayOfMonth", "$today"] },
                ],
              },
            },
          },
          { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$amount" } } },
        ],

        // Unpaid (day <= today, but last tx before this month/year)
        unpaidSummary: [
          {
            $match: {
              $expr: {
                $and: [
                  { $lte: ["$dayOfMonth", "$today"] },
                  {
                    $or: [
                      { $lt: ["$txYear", "$todayParts.year"] },
                      {
                        $and: [
                          { $eq: ["$txYear", "$todayParts.year"] },
                          { $lt: ["$txMonth", "$todayParts.month"] },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
          { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$amount" } } },
        ],

        // Upcoming later this month (day > today)
        upcomingSummary: [
          { $match: { $expr: { $gt: ["$dayOfMonth", "$today"] } } },
          { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$amount" } } },
        ],

        // Due soon: within the next 5 days (1..5). Compute a precise next due and daysUntil.
        dueSoonSummary: [
          {
            $set: {
              nextDue: {
                $cond: [
                  { $gt: ["$dayOfMonth", "$today"] },
                  {
                    $dateFromParts: {
                      year: "$todayParts.year",
                      month: "$todayParts.month",
                      day: "$dayOfMonth",
                      timezone: "Europe/London",
                    },
                  },
                  {
                    $dateFromParts: {
                      year: {
                        $add: [
                          "$todayParts.year",
                          { $cond: [{ $eq: ["$todayParts.month", 12] }, 1, 0] },
                        ],
                      },
                      month: { $add: [{ $mod: [{ $add: ["$todayParts.month", 0] }, 12] }, 1] },
                      day: "$dayOfMonth",
                      timezone: "Europe/London",
                    },
                  },
                ],
              },
            },
          },
          {
            $set: {
              daysUntil: {
                $dateDiff: {
                  startDate: "$$NOW",
                  endDate: "$nextDue",
                  unit: "day",
                  timezone: "Europe/London",
                },
              },
            },
          },
          {
            $match: { $expr: { $and: [{ $gt: ["$daysUntil", 0] }, { $lte: ["$daysUntil", 5] }] } },
          },
          { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$amount" } } },
        ],
      },
    },

    // Shape final response: summaries default to zeros if empty
    {
      $project: {
        transactions: 1,
        totalToPay: { $ifNull: [{ $first: "$meta.totalToPay" }, 0] },
        totalCount: { $ifNull: [{ $first: "$meta.totalCount" }, 0] },

        bucketSummary: {
          paid: {
            count: { $ifNull: [{ $first: "$paidSummary.count" }, 0] },
            total: { $ifNull: [{ $first: "$paidSummary.total" }, 0] },
          },
          unpaid: {
            count: { $ifNull: [{ $first: "$unpaidSummary.count" }, 0] },
            total: { $ifNull: [{ $first: "$unpaidSummary.total" }, 0] },
          },
          upcoming: {
            count: { $ifNull: [{ $first: "$upcomingSummary.count" }, 0] },
            total: { $ifNull: [{ $first: "$upcomingSummary.total" }, 0] },
          },
          dueSoon: {
            count: { $ifNull: [{ $first: "$dueSoonSummary.count" }, 0] },
            total: { $ifNull: [{ $first: "$dueSoonSummary.total" }, 0] },
          },
        },
      },
    },
  ]).allowDiskUse(true);

  return {
    success: true,
    status: 200,
    data: JSON.parse(
      JSON.stringify(
        result ?? {
          transactions: [],
          totalToPay: 0,
          totalCount: 0,
          bucketSummary: {
            paid: { count: 0, total: 0 },
            unpaid: { count: 0, total: 0 },
            upcoming: { count: 0, total: 0 },
            dueSoon: { count: 0, total: 0 },
          },
        }
      )
    ),
  };
}
