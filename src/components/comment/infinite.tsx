"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Dots, EditMessage, Message } from "~/components/icons";
import { RelativeDate } from "~/components/relative-date";
import { MIN_COMMENTS_PER_PAGE } from "~/lib/constants";
import type { ThreadFilters } from "~/lib/query-keys";
import { NoResults } from "~/components/no-results";
import { Reply, More } from "~/components/comment";
import { LoadMore } from "~/components/load-more";
import { Spinner } from "~/components/ui/spinner";
import { createAvatarBorder } from "~/lib/utils";
import { Avatar } from "~/components/avatar";
import { Link } from "~/components/ui/link";
import { useCallback } from "react";
import { links } from "~/lib/links";

import {
  type UseInfiniteComments,
  useInfiniteComments,
} from "~/components/comment/use-infinite";

const KEY = "threadId" as const;

type ContentProps = React.PropsWithChildren<{
  authenticated: boolean;
  filters: Omit<ThreadFilters, "parentId">;
}>;

export function InfiniteComments({ filters, authenticated }: ContentProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const commentId = searchParams.get(KEY);
  const parentId = !commentId ? null : commentId;

  const {
    data,
    status,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInfiniteComments({
    filters: { ...filters, parentId },
  });

  const createUrl = useCallback(
    (threadId: string | null) => {
      if (!threadId) {
        return pathname;
      }

      return `${pathname}?${KEY}=${threadId}`;
    },
    [pathname],
  );

  const getTopCommentId = useCallback(() => {
    const threads = data?.pages?.[0]?.results?.[0];
    if (!threads?.parent?.id) {
      return null;
    }
    return threads.parent.id;
  }, [data]);

  const isEmpty = status === "success" && !data?.pages?.[0]?.results?.length;
  const backUrl = isEmpty ? pathname : createUrl(getTopCommentId());

  return (
    <div className="max-w-lg w-full mx-auto">
      {(parentId || authenticated) && (
        <div className="flex justify-between py-1.5 items-center">
          {parentId && (
            <Link
              className="rounded-md px-3 py-[2px] hover:bg-copy/5"
              scroll={false}
              href={backUrl}
            >
              Back
            </Link>
          )}
          {authenticated && (
            <Reply
              contentId={filters.contentId}
              fill="primary"
              className="ml-auto rounded-md px-3 py-[2px]"
            >
              Add Comment
            </Reply>
          )}
        </div>
      )}
      <CommentList
        contentId={filters.contentId}
        status={status}
        isEmpty={isEmpty}
        authenticated={authenticated}
      >
        {data?.pages.map((page) => {
          return page.results.map(({ parent, ...comment }) => {
            return (
              <li
                id={comment.id}
                className="flex flex-col gap-4 px-3 py-4 text-[15px]"
                key={comment.id}
              >
                {/** Comment Details */}
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex grow items-end gap-2">
                    <Avatar
                      style={createAvatarBorder(comment.author?.accentColor)}
                      className="size-6 rounded-full"
                      src={comment.author?.image}
                      alt={comment.author?.username || "An"}
                    />
                    {comment.author ? (
                      <Link
                        className="inline"
                        text="copy"
                        href={links.profile.href(comment.author.username)}
                      >
                        {comment.author.name}
                      </Link>
                    ) : (
                      <span>Anonymous</span>
                    )}
                  </div>
                  {comment.id === commentId && !parent && (
                    <span className="text-primary uppercase text-sm font-semibold">
                      OP
                    </span>
                  )}
                  <RelativeDate
                    ago={false}
                    date={comment.createdAt}
                    style="narrow"
                  />
                </div>
                <p className="z-[1] self-start">{comment.body}</p>

                {/** Parent Comment */}
                {parent && comment.id === commentId && (
                  <div className="relative p-3 border-border border rounded-md">
                    {/**styled to prevent nesting links*/}
                    <Link
                      scroll={false}
                      href={createUrl(parent.id)}
                      className="z-0 block outline-0 focus-visible:outline-0 after:z-0 after:absolute after:h-full after:w-full after:rounded-md after:focus-visible:outline after:focus-visible:outline-primary after:left-0 after:top-0 after:hover:bg-copy/5 after:content-['']"
                    >
                      <span className="sr-only">view comment</span>
                    </Link>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap w-full items-center">
                        <div className="flex grow items-end gap-2">
                          <Avatar
                            style={createAvatarBorder(
                              parent.author?.accentColor,
                            )}
                            className="size-6 rounded-full"
                            src={parent.author?.image}
                            alt={parent.author?.username || "Anonymous"}
                          />
                          {parent.author ? (
                            <Link
                              className="inline z-10"
                              text="copy"
                              href={links.profile.href(parent.author.username)}
                            >
                              {parent.author.name}
                            </Link>
                          ) : (
                            <span>Anonymous</span>
                          )}
                        </div>
                        <RelativeDate
                          className="text-sm z-10"
                          ago={false}
                          date={parent.createdAt}
                          style="narrow"
                        />
                      </div>
                      <p className="z-10 self-start">{parent.body}</p>
                    </div>
                  </div>
                )}

                {/** Toolbar */}
                <div className="flex items-center gap-6 z-[1]">
                  {comment.id !== commentId && (
                    <Link
                      scroll={false}
                      ghost="copy"
                      title="View"
                      className="p-1.5 rounded-md"
                      href={createUrl(comment.id)}
                    >
                      <Message />
                    </Link>
                  )}
                  {authenticated && (
                    <Reply
                      ghost="copy"
                      className="p-1.5 rounded-md"
                      contentId={filters.contentId}
                      comment={comment}
                    >
                      <EditMessage />
                    </Reply>
                  )}
                  <More
                    commentId={comment.id}
                    contentId={filters.contentId}
                    owner={comment.viewer.isOwner}
                    ghost="copy"
                    className="p-1.5 rounded-md"
                  >
                    <Dots className="size-4" />
                  </More>
                </div>
              </li>
            );
          });
        })}
        {data?.pages?.[0]?.results.length === MIN_COMMENTS_PER_PAGE && (
          <LoadMore
            hasNextPage={hasNextPage}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            className="flex items-center justify-center px-3 py-4 text-sm transition-colors"
          >
            Load older
          </LoadMore>
        )}
      </CommentList>
    </div>
  );
}

export function Disabled() {
  return (
    <p className="text-center border-t border-border py-4">
      Comments have been disabled.
    </p>
  );
}

type CommentListProps = React.PropsWithChildren<{
  status: UseInfiniteComments["status"];
  isEmpty: boolean;
  contentId: string;
  authenticated: boolean;
}>;

function CommentList({
  status,
  isEmpty,
  authenticated,
  children,
}: CommentListProps) {
  if (status === "pending") {
    return (
      <div className="items-center justify-center flex grow flex-col gap-2 p-2">
        <Spinner />
      </div>
    );
  }

  if (status === "error") {
    return <NoResults>Something unexpected happened</NoResults>;
  }

  if (isEmpty) {
    if (authenticated) {
      return (
        <p className="text-center border-t border-border py-4">
          Be the first to leave a comment.
        </p>
      );
    }

    return (
      <p className="text-center border-t border-border py-4">
        You must&nbsp;
        <Link title="login" text="primary" href={links.login.href}>
          login
        </Link>
        &nbsp;to comment.
      </p>
    );
  }

  return (
    <ul className="flex grow flex-col gap-2 divide-y divide-border">
      {children}
    </ul>
  );
}
