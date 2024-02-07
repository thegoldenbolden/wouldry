"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { logger } from "~/lib/logger";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    logger.error(error, "An error occurred");
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-sm grow flex-col items-center justify-center gap-4 p-6">
      <h2 className="font-chillax text-lg font-medium leading-none">
        Something went wrong!
      </h2>
      <Button className="py-1" fill="foreground" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
