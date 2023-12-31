import { Link, type LinkProps } from "~/components/ui/link";
import type { ComponentPropsWithoutRef } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { Avatar } from "~/components/avatar";
import { links } from "~/lib/links";
import { cn } from "~/lib/utils";

const Author = ({
  children,
  className,
  author,
  ...props
}: LinkProps & Pick<LimitedRather, "author">) => {
  if (!author) {
    return null;
  }

  return (
    <Link title={author.name} tabIndex={-1} className={className} {...props}>
      {children}
    </Link>
  );
};

type LimitedRather = {
  slug: string;
  title: string;
  number: number;
  author?: {
    name: string;
    image: string;
    username: string;
  } | null;
  choices: Array<{
    id: string;
    body: string;
  }>;
};

export type RatherProps = { rather: LimitedRather } & (
  | (ComponentPropsWithoutRef<"li"> & { as: "li" })
  | (ComponentPropsWithoutRef<"article"> & { as: "article" })
);

export function Rather({
  as = "article",
  children,
  className,
  rather,
  ...props
}: RatherProps) {
  const Comp = as;

  const ratherHref = links.or.href(rather.number, rather.slug);
  const authorHref = links.profile.href(rather.author?.username || "");

  return (
    <Comp
      className={cn(
        "md:min-w-80 w-full drop-shadow-lg grow rounded-md basis-0 snap-center flex flex-col gap-3",
        className,
      )}
      {...props}
    >
      <Link
        tabIndex={-1}
        href={links.or.href(rather.number, rather.slug)}
        className="flex-col rounded-inherit"
      >
        {rather.choices.map((choice) => (
          <p
            key={choice.id}
            className="text-center basis-0 p-2 text-ellipsis overflow-clip flex font-semibold text-lg items-center justify-center break-words w-full first:rounded-t-md last:rounded-b-md min-h-24 first:bg-rather-blue last:bg-rather-red first:text-rather-blue-content last:text-rather-red-content"
          >
            {choice.body}
          </p>
        ))}
      </Link>
      <div className="flex gap-3 p-2 w-full overflow-hidden text-ellipsis">
        <Author author={rather.author} href={authorHref}>
          <Avatar
            className="size-8 border border-border"
            src={rather.author?.image}
            alt={rather.author?.username || "Anonymous"}
          />
        </Author>
        <div className="inline-flex flex-col gap-px">
          <Link
            title={rather.title}
            text="copy"
            href={ratherHref}
            className="text-lg text-copy font-bold justify-start shrink-0 text-ellipsis"
          >
            {rather.title}
          </Link>
          <Author
            author={rather.author}
            href={authorHref}
            text="copy"
            tabIndex={0}
            title={rather.author?.name || "Anonymous"}
            className="text-sm text-copy/70 self-start"
          >
            {rather.author?.name ?? "Anonymous"}
          </Author>
        </div>
      </div>
    </Comp>
  );
}

type FallbackProps = {
  name?: string;
  size?: number;
  className?: string;
};

export function Fallback({
  name = "rather-fallback",
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
