import { Avatar } from "~/components/avatar";
import { RelativeDate } from "~/components/format/date";
import { Link } from "~/components/ui/link";
import { NO_NAME } from "~/lib/constants";
import { links } from "~/lib/links";
import { cn } from "~/lib/utils";

function CommentRoot({ className, ...props }: React.ComponentProps<"article">) {
  return (
    <article {...props} className={cn("flex flex-col gap-2", className)} />
  );
}

type CommentAvatarProps = Omit<React.ComponentProps<typeof Avatar>, "alt"> & {
  image?: string | null;
  username?: string | null;
  alt?: string | null;
};
function CommentAvatar({
  className,
  image,
  username,
  ...props
}: CommentAvatarProps) {
  return (
    <Avatar
      {...props}
      className={cn("size-9 min-w-9 rounded-md", className)}
      src={image}
      alt={username || NO_NAME}
    />
  );
}

function CommentContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div {...props} className={cn("flex flex-col gap-2", className)} />;
}

type CommentDateProps = React.ComponentProps<typeof RelativeDate>;
function CommentDate({ className, ...props }: CommentDateProps) {
  return (
    <RelativeDate
      ago={false}
      style="narrow"
      className={cn("ml-auto text-sm text-foreground-light", className)}
      {...props}
    />
  );
}

type CommentAuthorProps = Partial<{
  username: string | null;
  nickname: string | null;
}>;
function CommentAuthor({ username, nickname }: CommentAuthorProps) {
  return (
    <div className="truncate">
      {!username ? (
        <span>{NO_NAME}</span>
      ) : (
        <>
          <Link
            className="z-[1] inline p-0 font-semibold text-foreground decoration-2 underline-offset-2 focus-visible:outline-1 focus-visible:outline-offset-0"
            text="foreground"
            href={links.profile.href(username)}
          >
            {nickname}
          </Link>
          &nbsp;
          <span className="text-sm font-normal text-foreground-light ">
            @{username}
          </span>
        </>
      )}
    </div>
  );
}

function CommentHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props} className={cn("flex items-center gap-2", className)} />
  );
}

type CommentBodyProps = React.ComponentProps<"p">;
function CommentMessage({ children, className, ...props }: CommentBodyProps) {
  return (
    <p
      {...props}
      className={cn("overflow-hidden text-ellipsis px-2.5", className)}
    >
      {children}
    </p>
  );
}

export const Comment = Object.assign(CommentRoot, {
  Avatar: CommentAvatar,
  Content: CommentContent,
  Author: CommentAuthor,
  Header: CommentHeader,
  Message: CommentMessage,
  Date: CommentDate,
});
