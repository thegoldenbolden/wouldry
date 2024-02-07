import { Avatar } from "~/components/avatar";
import { Link, type LinkProps } from "~/components/ui/link";
import { Skeleton, type SkeletonProps } from "~/components/ui/skeleton";
import { NO_NAME } from "~/lib/constants";
import { links } from "~/lib/links";
import { cn } from "~/lib/utils";

const Author = ({
  className,
  author,
  ...props
}: LinkProps & Pick<LimitedPoll, "author">) => {
  if (!author) {
    return null;
  }

  return (
    <Link
      title={author.nickname}
      tabIndex={-1}
      className={className}
      {...props}
    />
  );
};

type LimitedPoll = {
  slug: string;
  title: string;
  number: number;
  author?: {
    nickname: string;
    image: string;
    username: string;
  } | null;
  options: Array<{
    id: string;
    value: string;
  }>;
};

export type PollProps = {
  poll: LimitedPoll;
} & React.ComponentProps<"article">;

export function Poll({ children, className, poll, ...props }: PollProps) {
  const pollHref = links.or.href(poll.slug, poll.number);
  const authorHref = links.profile.href(poll.author?.username || "");

  return (
    <article
      className={cn(
        "flex flex-col gap-0 rounded-md md:min-w-80 md:max-w-96",
        className,
      )}
      {...props}
    >
      <Link
        tabIndex={-1}
        href={pollHref}
        className="flex-col gap-0 rounded-inherit"
      >
        {poll.options.map((option) => (
          <p
            key={option.id}
            className="flex min-h-24 w-full basis-0 items-center justify-center overflow-clip text-ellipsis break-words p-2 text-center text-lg font-semibold first:rounded-t-md first:bg-blue first:text-blue-foreground last:rounded-b-md last:bg-red last:text-red-foreground"
          >
            {option.value}
          </p>
        ))}
      </Link>
      <div className="flex w-full gap-2 overflow-hidden text-ellipsis p-2">
        <Author author={poll.author} href={authorHref}>
          <Avatar
            className="size-8 border  border-border"
            src={poll.author?.image}
            alt={poll.author?.username || NO_NAME}
          />
        </Author>
        <div className="inline-flex flex-col gap-px">
          <Link
            title={poll.title}
            text="foreground"
            href={pollHref}
            className="shrink-0 justify-start text-ellipsis p-0 text-lg font-medium text-foreground"
          >
            {poll.title}
          </Link>
          <Author
            author={poll.author}
            href={authorHref}
            text="foreground"
            tabIndex={0}
            title={poll.author?.nickname || NO_NAME}
            className="self-start p-0 text-sm text-foreground/70"
          >
            {poll.author?.nickname ?? NO_NAME}
          </Author>
        </div>
      </div>
    </article>
  );
}

Poll.Fallback = function Fallback({ className }: SkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton
        className={cn(
          "min-h-[12rem] min-w-80 rounded-md bg-background sm:min-w-64",
          className,
        )}
      />
      <div className="flex w-full items-center gap-3 p-2">
        <Skeleton className="size-8" />
        <div className="flex w-full flex-col gap-1">
          <Skeleton className="full h-5" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>
    </div>
  );
};
