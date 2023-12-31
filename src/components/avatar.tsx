import type { CSSProperties } from "react";

import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarWrapper,
} from "~/components/ui/avatar";

type Props = React.PropsWithChildren<{
  className?: string;
  src?: string;
  alt: string;
  style?: CSSProperties;
}>;

export function Avatar({ style, className, src, alt }: Props) {
  return (
    <AvatarWrapper style={style} className={className}>
      {src && (
        <AvatarImage
          src={src}
          alt={alt}
          className="object-cover bg-background"
        />
      )}
      <AvatarFallback className="bg-background text-copy" delayMs={600}>
        {alt.substring(0, 2)}
      </AvatarFallback>
    </AvatarWrapper>
  );
}
