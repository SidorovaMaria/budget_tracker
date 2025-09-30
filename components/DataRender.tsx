import { ERROR_STATE } from "@/constants/states";
import React from "react";
interface Props<T> {
  success: boolean;

  data: T[] | null | undefined;
  emptyState: {
    title?: string;
    description?: string;
  };
  emptyStateBtn?: React.ReactNode;

  // empty: string | { title: string; description: string }
  render: (data: T[]) => React.ReactNode;
}
const DataRender = <T,>({ success, data, emptyState, render, emptyStateBtn }: Props<T>) => {
  if (!success) {
    return (
      <section role="alert" className="flex flex-col items-center justify-center text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">{ERROR_STATE.title}</h2>
        <p className="text-grey-500">{ERROR_STATE.description}</p>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">{emptyState.title || "No Data Available"}</h2>
        {emptyState.description && <p className="text-grey-500">{emptyState.description}</p>}
        {emptyStateBtn && <div className="mt-6">{emptyStateBtn}</div>}
      </section>
    );
  }
  return <>{render(data)}</>;
};

DataRender.displayName = "DataRender";

export default DataRender;
