import { getRecentUsers, getRecentRathers } from "~/lib/cache/next";
import { Rather, Fallback } from "~/components/rather";
import { Link } from "~/components/ui/link";
import { User } from "~/components/user";
import type { Metadata } from "next";
import { links } from "~/lib/links";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

export const metadata: Metadata = {
  alternates: {
    canonical: links.home.href,
  },
};

export default function Page() {
  return (
    <main className="flex flex-col gap-4 px-3">
      <section className="flex flex-col gap-2 py-4">
        <RecentRathers />
      </section>
      <section className="flex flex-col gap-2 py-4">
        <RecentUsers />
      </section>
    </main>
  );
}

async function RecentUsers() {
  const users = await getRecentUsers();

  if (!users.length) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 px-2 py-4">
        <p className="text-xl font-bold flex items-center gap-3">
          No users found
        </p>
        <Link text="primary" href={links.login.href}>
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <Carousel className="max-w-screen-lg mx-auto w-full">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="flex flex-wrap gap-4 items-center justify-end">
          <CarouselPrevious className="border border-border" />
          <CarouselNext className="border border-border" />
        </div>
      </div>
      <CarouselContent className="py-4 px-2">
        {users.map((user) => (
          <CarouselItem
            className="sm:basis-1/2 xl:basis-1/3"
            key={user.username}
          >
            <User
              as="li"
              user={user}
              className="list-none drop-shadow-md p-0 h-full grow"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

async function RecentRathers() {
  let rathers = await getRecentRathers();

  if (!rathers.length) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 px-2 py-4">
        <p className="text-xl font-bold flex items-center gap-3">
          No rathers found
        </p>
        <Link text="primary" href={links.create.href}>
          Create a Rather
        </Link>
      </div>
    );
  }

  return (
    <Carousel className="max-w-screen-lg mx-auto w-full">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Rathers</h2>
        <div className="flex flex-wrap gap-4 items-center justify-end">
          <CarouselPrevious className="border border-border" />
          <CarouselNext className="border border-border" />
        </div>
      </div>
      <CarouselContent className="py-4 px-2">
        {rathers.map((rather) => (
          <CarouselItem className="sm:basis-1/2 xl:basis-1/3" key={rather.id}>
            <Rather rather={rather} className="md:min-w-0" as="article" />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
