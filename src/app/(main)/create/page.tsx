import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ErrorBoundary } from "~/components/error-boundary";
import { RatherForm } from "~/components/rather/create";
import { getSession } from "~/lib/cache/react";
import { Card } from "~/components/ui/card";
import { redirect } from "next/navigation";
import { links } from "~/lib/links";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create",
  description: "Create would you rather questions",
  alternates: {
    canonical: links.create.href,
  },
};

export default async function Page() {
  const session = await getSession();

  if (!session?.user) {
    redirect(links.login.href);
  }

  return (
    <main className="mx-auto flex flex-col gap-6 px-3 py-8 max-w-2xl w-full">
      <h1 className="text-2xl sm:text-[50vh] sm:uppercase sm:text-copy/5 font-bold sm:fixed sm:-right-1/4 sm:top-1/2 sm:-translate-y-1/2 sm:-z-10 sm:-rotate-90">
        Create
      </h1>
      <ErrorBoundary>
        <Tabs defaultValue="rather" className="flex flex-col gap-2">
          <TabsList className="flex h-4 items-center gap-2">
            <TabsTrigger
              className="relative radix-state-active:after:bottom-0 radix-state-active:after:absolute radix-state-active:after:content-[''] radix-state-active:after:w-1/2 radix-state-active:after:bg-primary radix-state-active:after:left-1/2 radix-state-active:after:-translate-x-1/2 radix-state-active:after:h-px px-4 font-semibold"
              value="rather"
            >
              Rather
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rather">
            <Card className="p-6">
              <ErrorBoundary>
                <RatherForm username={session?.user?.username} />
              </ErrorBoundary>
            </Card>
          </TabsContent>
        </Tabs>
      </ErrorBoundary>
    </main>
  );
}
