import { Button, type ButtonProps } from "~/components/ui/button";
import { useInView } from "react-intersection-observer";
import { Spinner } from "~/components/ui/spinner";
import { useEffect } from "react";

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
      size="sm"
      className="flex w-full items-center justify-center"
      {...props}
    >
      {isFetchingNextPage || isFetching ? (
        <Spinner />
      ) : hasNextPage ? (
        props.children
      ) : (
        "No more results to show"
      )}
    </Button>
  );
}
