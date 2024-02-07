"use client";

type DateProps = Options & { className?: string };
type DateComponent = (props: DateProps) => JSX.Element;

type Options = Intl.RelativeTimeFormatOptions & {
  date: Date | string | number;
  locales?: string | string[];
  ago?: boolean;
};

export const getRelativeTime = ({ date, numeric, locales, style }: Options) => {
  if (!date) throw new Error("Missing date");

  const ms: number | undefined =
    typeof date === "number"
      ? date
      : typeof date === "string"
        ? new Date(date).getTime()
        : date instanceof Date
          ? date.getTime()
          : undefined;

  if (ms === undefined) throw new Error("Unable to get milliseconds");

  const deltaSeconds = Math.round((ms - Date.now()) / 1000);
  const cutoffs = [60, 3600, 86400, 86400 * 30, 86400 * 365, Infinity];

  const units: Intl.RelativeTimeFormatUnitSingular[] = [
    "second",
    "minute",
    "hour",
    "day",
    "month",
    "year",
  ];
  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds),
  );
  const divisor = unitIndex > 0 ? cutoffs[unitIndex - 1] : 1;

  locales ??= "en";
  numeric ??= "always";
  style ??= "long";
  const rtf = new Intl.RelativeTimeFormat(locales, { numeric, style });
  return rtf.format(
    -Math.floor(Math.abs(deltaSeconds / divisor)),
    units[unitIndex],
  );
};

export const RelativeDate: DateComponent = ({
  className,
  ago = true,
  ...options
}) => {
  let date = getRelativeTime(options);

  if (!ago) {
    let agoIdx = date.indexOf(" ago");
    date = agoIdx > 0 ? date.substring(0, agoIdx) : date;
  }

  return <span className={className}>{date}</span>;
};
