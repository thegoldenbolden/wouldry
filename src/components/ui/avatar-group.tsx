import { AvatarFallback, AvatarImage, Avatar } from "~/components/ui/avatar";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof AvatarImage> & {
  size?: number;
  avatars: Array<{
    src?: string;
    alt: string;
  }>;
};

function AvatarGroup({ className, size = 3, avatars = [], ...props }: Props) {
  const items = avatars.slice(0, size);

  if (!items.length) {
    return null;
  }

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {items.map((avatar, i) => (
        <Avatar key={`avatar-${i}`} className={className}>
          {avatar.src && (
            <AvatarImage
              className="object-cover"
              src={avatar.src}
              alt={avatar.alt}
              {...props}
            />
          )}
          <AvatarFallback delayMs={600}>
            {avatar.alt.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}

export { AvatarGroup };
