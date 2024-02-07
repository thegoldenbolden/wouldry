import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Avatar } from "~/components/avatar";
import { Disabled, InfiniteComments } from "~/components/comment/infinite";
import { ErrorBoundary } from "~/components/error-boundary";
import { Footer } from "~/components/footer";
import { RelativeDate } from "~/components/format/date";
import { Vote } from "~/components/poll/vote";
import { Card } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { findComments } from "~/db/comment";
import { getVotes } from "~/db/poll";
import { MIN_COMMENTS_PER_PAGE } from "~/db/validations/comment";
import { getPoll, isAuthenticated } from "~/lib/cache/react";
import { NO_NAME } from "~/lib/constants";
import { links } from "~/lib/links";
import { ThreadFilters, queryKeys } from "~/lib/query-keys";

type Props = {
  params: {
    poll: string;
  };
  searchParams: {
    threadId?: string;
  };
};

type Search = Awaited<ReturnType<typeof findComments>>["data"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.poll.split("-").at(-1);
  const poll = await getPoll(id);

  const metadata: Metadata = {
    title: poll.title,
    alternates: {
      canonical: links.or.href(poll.slug, poll.number),
    },
  };

  if (poll.description) {
    metadata.description = poll.description;
  }

  return metadata;
}

export default async function Page({ params }: Props) {
  const id = params.poll.split("-").at(-1);
  const poll = await getPoll(id);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  });

  const threadFilters: ThreadFilters = {
    contentId: poll.id,
    parentId: null,
  };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.polls({ id }),
      queryFn: async () => {
        const response = await getVotes({ id: poll.id });
        return response.data;
      },
    }),
    // Only prefetch comments if comments are enabled
    poll.commentsEnabled &&
      queryClient.prefetchInfiniteQuery<Search>({
        initialPageParam: 0,
        getNextPageParam: (next: Search) => next?.after,
        queryKey: queryKeys.threads(threadFilters),
        queryFn: async () => {
          const response = await findComments({
            ...threadFilters,
            limit: MIN_COMMENTS_PER_PAGE,
            sort: "desc",
            orderBy: "created_at",
            after: null,
            before: null,
          });
          return response.data;
        },
      }),
  ]);

  return (
    <div>
      <main>
        <div className="mx-auto flex flex-col sm:flex-row sm:overflow-auto lg:w-11/12 lg:gap-4 lg:rounded-none lg:p-2">
          <ErrorBoundary>
            <HydrationBoundary state={dehydrate(queryClient)}>
              {poll.options.map((option) => {
                return (
                  <div
                    key={`option-${option.id}`}
                    className="group relative inline-flex min-h-[220px] w-full items-center justify-center rounded-none px-0 py-0 @container odd:bg-blue odd:text-blue-foreground even:bg-red even:text-red-foreground lg:min-h-[320px] lg:rounded-md"
                  >
                    <Vote optionId={option.id} pollId={poll.id} />
                    <p className="flex h-full grow select-none items-center justify-center text-balance break-words p-3 text-lg transition-transform peer-hover:-translate-y-2 peer-focus-visible:-translate-y-2 peer-aria-disabled:transform-none @sm:text-xl @md:text-2xl @lg:text-3xl">
                      {option.value}
                    </p>
                  </div>
                );
              })}
            </HydrationBoundary>
          </ErrorBoundary>
        </div>
        <div className="mx-auto flex flex-col gap-4 p-4 pb-16 lg:w-8/12">
          <h1 className="text-pretty break-words text-2xl font-bold">
            {poll.title}
          </h1>
          <div className="flex items-center justify-start gap-3">
            <Avatar
              className="size-10 rounded-full border border-border"
              src={poll.author?.image}
              alt={poll.author?.username || NO_NAME}
            />
            <div className="flex flex-col">
              <Author
                username={poll.author?.username}
                nickname={poll.author?.nickname}
              />
              <RelativeDate
                style="short"
                date={poll.createdAt}
                className="texy-foreground-lighter w-full text-sm"
              />
            </div>
          </div>
          {!poll.description ? null : (
            <Card className="p-4">
              <p>{poll.description}</p>
            </Card>
          )}
          <Suspense>
            <Comments enabled={poll.commentsEnabled} contentId={poll.id} />
          </Suspense>
        </div>
      </main>
      <Footer className="mx-auto" />
    </div>
  );
}

function Author({
  username,
  nickname,
}: {
  username?: string | null;
  nickname?: string | null;
}) {
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

type CommentsProps = {
  enabled: boolean;
  contentId: string;
};

async function Comments({ enabled, contentId }: CommentsProps) {
  if (enabled) {
    const authenticated = await isAuthenticated();
    return (
      <ErrorBoundary>
        <InfiniteComments
          filters={{ contentId }}
          authenticated={authenticated}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Disabled />
    </ErrorBoundary>
  );
}
