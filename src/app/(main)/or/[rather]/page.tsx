import { type TRather, getRather, isAuthenticated } from "~/lib/cache/react";
import { InfiniteComments, Disabled } from "~/components/comment/infinite";
import { ProfileLink } from "~/components/user/profile-link";
import { ErrorBoundary } from "~/components/error-boundary";
import { RelativeDate } from "~/components/relative-date";
import { Choices } from "~/components/rather/choice";
import { Avatar } from "~/components/avatar";
import type { Metadata } from "next";
import { links } from "~/lib/links";
import { Suspense } from "react";

type Props = {
  params: {
    rather: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.rather.split("-").at(-1);
  const rather = await getRather(id);

  const metadata: Metadata = {
    title: rather.title,
    alternates: {
      canonical: links.or.href(rather.number, rather.slug),
    },
  };

  if (rather.description) {
    metadata.description = rather.description;
  }

  return metadata;
}

export default async function Page({ params }: Props) {
  const id = params.rather.split("-").at(-1);
  const rather = await getRather(id);

  return (
    <main>
      <Suspense>
        <Choice rather={rather} />
      </Suspense>
      <div className="p-4 pb-16 mx-auto lg:w-8/12 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-pretty break-words">
          {rather.title}
        </h1>
        <div className="flex gap-3 items-center justify-start">
          <Avatar
            className="size-10 rounded-full border-2 border-border"
            src={rather.author?.image}
            alt={rather.author?.username || "Anonymous"}
          />
          <div className="flex flex-col">
            {rather.author?.username ? (
              <ProfileLink
                as="static"
                className="p-0 justify-start"
                username={rather.author.username}
              >
                <span className="hover:underline hover:underline-offset-1 font-semibold">
                  {rather.author.name}
                </span>
                &nbsp;
                <span className="text-sm texy-copy-lighter">
                  @{rather.author?.username}
                </span>
              </ProfileLink>
            ) : (
              <div>Anonymous</div>
            )}
            <RelativeDate
              style="short"
              date={rather.createdAt}
              className="w-full text-sm texy-copy-lighter"
            />
          </div>
        </div>
        <p>{rather.description}</p>
        <Suspense>
          <Comments enabled={rather.commentsEnabled} contentId={rather.id} />
        </Suspense>
      </div>
    </main>
  );
}

async function Choice({ rather }: { rather: TRather }) {
  const authenticated = await isAuthenticated();

  return (
    <div className="mx-auto flex flex-col sm:flex-row sm:overflow-auto lg:w-11/12 lg:gap-4 lg:rounded-none lg:p-2">
      <ErrorBoundary className="mx-auto">
        <Choices
          rather={{
            authenticated,
            ratherId: rather.id,
            total: rather.total,
            choices: rather.choices,
          }}
        />
      </ErrorBoundary>
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
