import type { Metadata } from "next";
import { Suspense } from "react";
import { Poll } from "~/components/poll";
import {
  Carousel,
  CarouselContent,
  CarouselHeader,
  CarouselItem,
} from "~/components/ui/carousel";
import { Link } from "~/components/ui/link";
import { User } from "~/components/user";
import { getRecentPolls } from "~/db/poll";
import { getRecentUsers } from "~/db/user";
import { links } from "~/lib/links";

export const metadata: Metadata = {
  alternates: {
    canonical: links.home.href,
  },
};

export const revalidate = 43200;

export default function Page() {
  return (
    <main className="mt-10 flex flex-col gap-4 px-3">
      <section className="py-4">
        <Carousel className="mx-auto flex w-full max-w-screen-lg flex-col">
          <CarouselHeader>
            Explore&nbsp;
            <Link
              className="font-semibold"
              text="primary"
              href="/search/polls"
            >
              polls
            </Link>
          </CarouselHeader>
          <Suspense fallback={<PollCarouselContent.Fallback size={3} />}>
            <PollCarouselContent />
          </Suspense>
        </Carousel>
      </section>
      <section className="py-4">
        <Carousel className="mx-auto flex w-full max-w-screen-lg flex-col">
          <CarouselHeader>
            Find&nbsp;
            <Link className="font-semibold" text="primary" href="/search/users">
              users
            </Link>
          </CarouselHeader>
          <Suspense fallback={<UserCarouselContent.Fallback size={3} />}>
            <UserCarouselContent />
          </Suspense>
        </Carousel>
      </section>
    </main>
  );
}

async function UserCarouselContent() {
  const { data } = await getRecentUsers();

  if (!data?.users.length) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 px-2 py-4">
        <p className="flex items-center gap-3 text-xl font-bold">
          No users found
        </p>
        <Link text="primary" href={links.login.href}>
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <CarouselContent className="px-2 py-4">
      {data.users.map((user) => (
        <CarouselItem className="sm:basis-1/2 xl:basis-1/3" key={user.username}>
          <User user={user} className="h-full grow list-none p-0" />
        </CarouselItem>
      ))}
    </CarouselContent>
  );
}

UserCarouselContent.Fallback = function Fallback({
  size = 3,
}: {
  size?: number;
}) {
  return (
    <CarouselContent>
      {Array.from({ length: size }).map((_, i) => {
        return (
          <CarouselItem
            key={`home-user-fallback-${i}`}
            className="sm:basis-1/2 xl:basis-1/3"
          >
            <User.Fallback className="md:min-w-0" />
          </CarouselItem>
        );
      })}
    </CarouselContent>
  );
};

async function PollCarouselContent() {
  const { data } = await getRecentPolls();

  if (!data?.polls.length) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 px-2 py-4">
        <p className="flex items-center gap-3 text-xl font-bold">
          No polls found
        </p>
        <Link text="primary" href={links.create.href}>
          Create a Poll
        </Link>
      </div>
    );
  }

  return (
    <CarouselContent className="px-2 py-4">
      {data.polls.map((poll) => (
        <CarouselItem className="sm:basis-1/2 xl:basis-1/3" key={poll.id}>
          <Poll poll={poll} className="md:min-w-0" />
        </CarouselItem>
      ))}
    </CarouselContent>
  );
}

PollCarouselContent.Fallback = function Fallback({
  size = 3,
}: {
  size?: number;
}) {
  return (
    <CarouselContent>
      {Array.from({ length: size }).map((_, i) => {
        return (
          <CarouselItem
            key={`home-poll-fallback-${i}`}
            className="sm:basis-1/2 xl:basis-1/3"
          >
            <Poll.Fallback className="md:min-w-0" />
          </CarouselItem>
        );
      })}
    </CarouselContent>
  );
};
