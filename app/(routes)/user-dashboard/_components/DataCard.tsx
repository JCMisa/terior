import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

const DataCard = ({
  label,
  value,
  Icon,
  className,
  link,
}: {
  label: string;
  value: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  className?: string;
  link?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-lg bg-neutral-100 dark:bg-neutral-900 py-4 px-3 flex flex-col relative shadow-lg",
        className
      )}
    >
      <Icon className="absolute top-3 right-3 size-4" />
      <p className="text-sm tracking-widest text-muted-foreground">{label}</p>
      {label === "Latest Design" ? (
        <Link
          href={link || "/user-dashboard"}
          className="text-2xl font-bold mt-3 hover:underline"
        >
          {value}
        </Link>
      ) : (
        <h2 className="text-2xl font-bold mt-3">{value}</h2>
      )}
    </div>
  );
};

export default DataCard;
