"use client";
import { FormatNumber } from "~/components/format/number";
import { User } from "~/components/icons";
import { useVoteMutation, useVoteResult } from "~/components/poll/use-vote";
import { Button, type ButtonProps } from "~/components/ui/button";

type VoteProps = ButtonProps & {
  pollId: string;
  optionId: string;
};
export function Vote({ pollId, optionId, ...props }: VoteProps) {
  const { data, isFetching } = useVoteResult(pollId);
  const mutation = useVoteMutation();

  if (!data || !data?.options.length) {
    return null;
  }

  const vote = data.options.find((option) => option?.id === optionId);
  const hasVoted = data.options.some((option) => option?.voted);
  const isDisabled = hasVoted || isFetching || mutation.isPending;
  const voted = Boolean(vote?.voted);

  const createVote = (id: string) => {
    if (isDisabled) return;
    mutation.mutate({
      pollId: pollId,
      optionId: id,
    });
  };

  return (
    <Button
      {...props}
      aria-disabled={isDisabled}
      onClick={() => createVote(optionId)}
      className="peer absolute left-0 top-0 z-10 h-full w-full grow overflow-clip rounded-none"
    >
      {voted && (
        <User className="text-white absolute bottom-3 right-3 size-8 rounded-md border-none motion-safe:animate-in motion-safe:slide-in-from-bottom-6" />
      )}
      {hasVoted && (
        <div className="text-white absolute left-0 top-0 flex w-full items-center justify-between bg-black/25 px-3 py-px font-bold lowercase motion-safe:animate-in motion-safe:slide-in-from-top-6">
          <div>
            <FormatNumber
              options={{
                type: "number",
                number: vote?.total.votes || 0,
                notation: "compact",
              }}
            />
            &nbsp;
            <FormatNumber
              options={{
                type: "text",
                text: "votes",
                number: vote?.total.votes || 0,
                pluralize: true,
              }}
            />
          </div>
          <FormatNumber
            options={{
              type: "number",
              number: vote?.percentage || 0,
              notation: "standard",
              style: "percent",
            }}
          />
        </div>
      )}
    </Button>
  );
}
