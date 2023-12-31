"use client";

import pluralize from "pluralize";
import { cn } from "~/lib/utils";

type Options = Intl.NumberFormatOptions & { number: number };
type GetNumber = (options: Options, locale?: string) => string;
export const getNumber: GetNumber = (options, locale = "en-US") => {
  const number =
    options.number < 1 ? options.number : parseInt(options.number?.toString());
  if (isNaN(number)) return "-1";
  return new Intl.NumberFormat(locale, options).format(number);
};

type FormatNumberProps = React.ComponentProps<"span"> & {
  options:
    | {
        type: "text";
        text: string;
        pluralize: boolean;
        number: number;
        style?: "percent" | "decimal" | "currency" | "unit";
      }
    | (Options & {
        type: "number";
        locale?: string;
        number: number;
      });
};

const FormatNumber = ({ options, ...props }: FormatNumberProps) => {
  let text = "";

  switch (options.type) {
    case "number":
      text = getNumber(options, options.locale);
      break;
    case "text":
      if (options.pluralize) {
        text = pluralize(options.text, parseInt(`${options.number}`));
      } else {
        text = options.text;
      }
      break;
  }

  return (
    <span {...props} style={undefined} className={cn(props.className)}>
      {text}
    </span>
  );
};

export { FormatNumber };
