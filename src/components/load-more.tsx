import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button, type ButtonProps } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";

type LoadMoreProps = ButtonProps & {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetching: boolean;
  fetchNextPage: () => void;
};

export function LoadMore({
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  fetchNextPage,
  ...props
}: LoadMoreProps) {
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  function load() {
    if (!hasNextPage) return;
    if (isFetching) return;
    if (isFetchingNextPage) return;
    fetchNextPage();
  }

  return (
    <Button
      ref={ref}
      disabled={!hasNextPage || isFetchingNextPage || isFetching}
      onClick={load}
      size="md"
      ghost="border"
      className="flex w-full items-center justify-center"
      {...props}
    >
      {isFetchingNextPage || isFetching ? (
        <Spinner size="sm" color="foreground" />
      ) : hasNextPage ? (
        props.children
      ) : (
        "No more results to show"
      )}
    </Button>
  );
}
