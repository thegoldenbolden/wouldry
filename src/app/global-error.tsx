"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { chillax, synonym } from "~/lib/fonts";
import { logger } from "~/lib/logger";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    logger.error(error, "An error occurred");
  }, [error]);

  return (
    <html className={`${chillax.variable} ${synonym.variable}`}>
      <body className="font-synonym grid min-h-svh place-items-center">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-3 p-6">
          <h2 className="font-chillax text-xl font-medium leading-none">
            Something went wrong!
          </h2>
          <Button className="py-1" fill="foreground" onClick={() => reset()}>
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
