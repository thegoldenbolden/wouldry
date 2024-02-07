import type { CSSProperties } from "react";
import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarWrapper,
} from "~/components/ui/avatar";
import { NO_NAME } from "~/lib/constants";
import { cn } from "~/lib/utils";

type Props = React.PropsWithChildren<{
  className?: string;
  src?: string | null;
  alt?: string | null;
  style?: CSSProperties;
}>;

export function Avatar({ style, className, src, alt }: Props) {
  return (
    <AvatarWrapper style={style} className={cn("overflow-clip", className)}>
      {!src ? null : (
        <AvatarImage src={src} alt={alt || NO_NAME} className="object-cover" />
      )}
      <AvatarFallback
        className="rounded-inherit border border-inherit bg-inherit p-0 text-xs uppercase text-inherit"
        delayMs={600}
      >
        {(alt || NO_NAME).charAt(0)}
      </AvatarFallback>
    </AvatarWrapper>
  );
}
