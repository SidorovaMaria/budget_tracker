import React from "react";
import Link from "next/link";
import IconCaretRight from "../icons/IconCaretRight";
type OverviewLinkProps = {
  title: string;
  href: string;
  linkText: string;
};
const OverviewLink = ({ title, href, linkText }: OverviewLinkProps) => {
  return (
    <div className="flex-row-between">
      <h2 className="text-preset-2">{title}</h2>
      <Link
        href={href}
        className="text-grey-500 hover:text-grey-900 flex items-center gap-3 group relative"
      >
        {linkText}
        <IconCaretRight className="size-3" />
        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-grey-500 transition-[width] duration-300 group-hover:w-full" />
      </Link>
    </div>
  );
};

export default OverviewLink;
