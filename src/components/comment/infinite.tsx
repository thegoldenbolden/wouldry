"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Comment } from "~/components/comment";
import { More } from "~/components/comment/more";
import { Reply } from "~/components/comment/reply";
import {
  useInfiniteComments,
  type UseInfiniteComments,
} from "~/components/comment/use-infinite";
import { Chat, ChevronLeft, Dots, Edit, Pencil, X } from "~/components/icons";
import { LoadMore } from "~/components/load-more";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Spinner } from "~/components/ui/spinner";
import { MIN_COMMENTS_PER_PAGE } from "~/db/validations/comment";
import type { ThreadFilters } from "~/lib/query-keys";

const KEY = "threadId" as const;

type ContentProps = React.PropsWithChildren<{
  authenticated: boolean;
  filters: Omit<ThreadFilters, "parentId">;
}>;

function goTo(threadId: string | null) {
  if (!window) {
    return;
  }

  if (!threadId) {
    window.history.pushState(null, "", `?${KEY}=all`);
    return;
  }

  window.history.pushState(null, "", `?${KEY}=${threadId}`);
}

export function InfiniteComments({ filters, authenticated }: ContentProps) {
  const searchParams = useSearchParams();

  const commentId = searchParams.get(KEY);
  const parentId = !commentId || commentId === "all" ? null : commentId;

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

  const getTopCommentId = useCallback(() => {
    const threads = data?.pages?.[0]?.results?.[0];
    if (!threads?.parent?.id) {
      return null;
    }
    return threads.parent.id;
  }, [data]);

  const isEmpty = status === "success" && !data?.pages?.[0]?.results?.length;

  return (
    <Dialog defaultOpen={Boolean(parentId)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <DialogTrigger ghost="border" size="md">
          View all comments
        </DialogTrigger>
        {!authenticated ? null : (
          <Reply
            contentId={filters.contentId}
            fill="primary"
            size="md"
            className="ml-auto rounded-md"
          >
            Add Comment
          </Reply>
        )}
      </div>
      <DialogContent className="max-h-svh min-h-svh overflow-y-auto border-none p-0 sm:border md:h-[80svh] md:min-h-0">
        <div className="flex flex-col gap-4 bg-inherit">
          <DialogHeader className="sticky top-0 z-50 flex flex-row items-center justify-between border-b border-b-border bg-inherit px-3 py-2">
            {!parentId ? null : (
              <Button
                className="items-center gap-2 rounded-md hover:bg-foreground/5"
                size="icon"
                title="Back"
                aria-label="previous page"
                onClick={() => {
                  goTo(getTopCommentId());
                }}
              >
                <ChevronLeft />
              </Button>
            )}
            {!authenticated ? null : (
              <Reply
                contentId={filters.contentId}
                fill="primary"
                size="icon"
                aria-label="Add comment"
                className="ml-auto rounded-md"
                title="add comment"
              >
                <Edit />
              </Reply>
            )}
            <DialogClose
              aria-label="close comments"
              title="Close comments"
              className="gap-2 rounded-md hover:bg-foreground/5"
              size="icon"
            >
              <X />
            </DialogClose>
          </DialogHeader>
          <CommentList
            contentId={filters.contentId}
            status={status}
            isEmpty={isEmpty}
          >
            {data?.pages.map((page) => {
              return page?.results.map(({ parent, ...comment }) => {
                return (
                  <Comment
                    key={comment.id}
                    className="text-ellipsis py-4 text-sm"
                  >
                    <Comment.Content>
                      <Comment.Header>
                        <Comment.Avatar
                          image={comment.author?.image}
                          username={comment.author?.username}
                          alt={comment.author?.username}
                          className="size-8 min-w-8 rounded-full"
                        />
                        <Comment.Author
                          nickname={comment.author?.nickname}
                          username={comment.author?.username}
                        />
                        <Comment.Date date={comment.createdAt} />
                      </Comment.Header>
                      <Comment.Message>{comment.body}</Comment.Message>
                      {/** Parent Comment */}
                      {!parent?.author || comment.id !== commentId ? null : (
                        <Comment className="group relative my-2 rounded-md border  border-border p-3 sm:ml-0 sm:p-4">
                          {/**styled to prevent nesting interactive elements*/}
                          <Button
                            onClick={() => {
                              goTo(parent.id);
                            }}
                            aria-label="view comment"
                            className="absolute left-0 top-0 z-[1] h-full w-full focus-visible:outline-offset-0 group-hover:bg-foreground/5"
                          >
                            <span className="sr-only">view comment</span>
                          </Button>
                          <Comment.Content>
                            <Comment.Header>
                              <Comment.Avatar
                                image={parent?.author?.image}
                                username={parent?.author?.username}
                                alt={parent?.author?.username}
                                className="size-6 min-w-5 rounded-full text-[10px]"
                              />
                              <Comment.Author
                                nickname={parent?.author?.nickname}
                                username={parent?.author?.username}
                              />
                              <Comment.Date date={parent?.createdAt} />
                            </Comment.Header>
                            <Comment.Message>{parent?.body}</Comment.Message>
                          </Comment.Content>
                        </Comment>
                      )}
                      <div className="z-[1] flex items-center gap-6 px-2.5">
                        {comment.id === commentId ? null : (
                          <Button
                            ghost="foreground"
                            title="View"
                            className="rounded-md p-1.5"
                            onClick={() => goTo(comment.id)}
                          >
                            <Chat className="size-4" />
                          </Button>
                        )}
                        {!authenticated ? null : (
                          <Reply
                            ghost="foreground"
                            className="group rounded-md p-1.5"
                            contentId={filters.contentId}
                            data-active={false}
                            comment={comment}
                          >
                            <Pencil className="size-4" />
                          </Reply>
                        )}
                        <More
                          commentId={comment.id}
                          contentId={filters.contentId}
                          permissions={comment.permissions}
                          ghost="foreground"
                          className="rounded-md p-1.5"
                        >
                          <Dots className="size-4" />
                        </More>
                      </div>
                    </Comment.Content>
                  </Comment>
                );
              });
            })}
            {data?.pages?.[0]?.results.length !==
            MIN_COMMENTS_PER_PAGE ? null : (
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
      </DialogContent>
    </Dialog>
  );
}

export function Disabled() {
  return (
    <p className="border-t border-border py-4 text-center">
      Comments have been disabled.
    </p>
  );
}

type CommentListProps = React.PropsWithChildren<{
  status: UseInfiniteComments["status"];
  isEmpty: boolean;
  contentId: string;
}>;

function CommentList({ status, isEmpty, children }: CommentListProps) {
  if (status === "pending") {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <Spinner size="md" color="foreground" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="p-4 text-center">An error occurred loading comments</p>
    );
  }

  if (isEmpty) {
    return <p className="p-4 text-center">Be the first to leave a comment.</p>;
  }

  return (
    <section className="flex flex-col gap-2 divide-y divide-border px-4">
      {children}
    </section>
  );
}
