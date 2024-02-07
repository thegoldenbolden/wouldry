import { Avatar } from "~/components/avatar";
import { Link } from "~/components/ui/link";
import { Skeleton, SkeletonProps } from "~/components/ui/skeleton";
import { links } from "~/lib/links";
import { cn } from "~/lib/utils";

type TUser = {
  user: {
    username: string;
    nickname: string;
    image: string;
    about?: string | null;
  };
};

export type UserProps = TUser & React.ComponentProps<"article">;

export function User({ children, className, user, ...props }: UserProps) {
  return (
    <article
      className={cn("rounded-md border  border-border", className)}
      {...props}
    >
      <Link
        href={links.profile.href(user.username)}
        className="flex h-full flex-col items-start justify-start gap-2.5 rounded-md px-3 py-4 hover:bg-border/30"
      >
        <div className="flex w-full items-center gap-3">
          <h2 className="flex flex-col font-bold">
            {user.nickname}
            <span className="text-sm font-normal text-foreground-lighter">
              @{user.username}
            </span>
          </h2>
          <Avatar src={user.image} alt={user.username} className="ml-auto" />
        </div>
        {!user.about ? null : (
          <p className="line-clamp-2 max-w-72 text-balance text-sm">
            {user.about}
          </p>
        )}
      </Link>
    </article>
  );
}

User.Fallback = function Fallback({ className }: SkeletonProps) {
  return (
    <Skeleton
      className={cn(
        "min-h-16 min-w-full rounded-md bg-background sm:min-w-64",
        className,
      )}
    />
  );
};
