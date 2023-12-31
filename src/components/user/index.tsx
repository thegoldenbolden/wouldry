import { Skeleton } from "~/components/ui/skeleton";
import { Avatar } from "~/components/avatar";
import { Link } from "~/components/ui/link";
import { Card } from "~/components/ui/card";
import { links } from "~/lib/links";
import { cn } from "~/lib/utils";

type TUser = {
  user: {
    image: string;
    name: string;
    username: string;
    biography?: string | null;
  };
};

export type UserProps = TUser &
  (
    | (React.ComponentPropsWithoutRef<"li"> & { as: "li" })
    | (React.ComponentPropsWithoutRef<"article"> & { as: "article" })
  );

export function User({
  as = "article",
  children,
  className,
  user,
  ...props
}: UserProps) {
  const Comp = as;

  return (
    <Card asChild className={className}>
      <Comp {...props}>
        <Link
          ghost="copy"
          href={links.profile.href(user.username)}
          className="px-3 h-full py-4 rounded-md flex flex-col justify-start gap-2.5 items-start"
        >
          <div className="flex items-center gap-3 w-full">
            <h2 className="flex font-bold flex-col">
              {user.name}
              <span className="font-normal text-sm text-copy-lighter">
                @{user.username}
              </span>
            </h2>
            <Avatar src={user.image} alt={user.username} className="ml-auto" />
          </div>
          {user.biography && (
            <p className="text-sm max-w-72 text-balance line-clamp-2">
              {user.biography}
            </p>
          )}
        </Link>
      </Comp>
    </Card>
  );
}

type FallbackProps = {
  name?: string;
  size?: number;
  className?: string;
};

export function Fallback({
  name = "user-fallback",
  className,
  size = 1,
}: FallbackProps) {
  return (
    <>
      {Array.from({ length: size }).map((_, i) => {
        return (
          <Skeleton
            key={`${name}-${i}`}
            className={cn(
              "min-h-[12rem] sm:min-w-64 md:min-w-96 min-w-full grow rounded-md basis-0 snap-center overflow-clip flex flex-col gap-3 bg-background",
              className,
            )}
          />
        );
      })}
    </>
  );
}
