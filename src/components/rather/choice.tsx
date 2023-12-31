"use client";
import { FormatNumber } from "~/components/format-number";
import { NoResults } from "~/components/no-results";
import { Button } from "~/components/ui/button";
import { User } from "~/components/icons";

import {
  type UseVotesProps,
  useVotes,
  useVotesMutation,
} from "~/components/rather/use-votes";

export function Choices({ rather }: { rather: UseVotesProps }) {
  const { data, isFetching } = useVotes(rather);
  const mutation = useVotesMutation(rather.authenticated);

  if (!data || !data?.choices) {
    return <NoResults>No choices were found</NoResults>;
  }

  const voted = data.choices.some((choice) => choice.voted);
  const isDisabled = voted || isFetching || mutation.isPending;

  const vote = (id: string) => {
    if (isDisabled) return;
    mutation.mutate({
      choiceId: id,
      ratherId: rather.ratherId,
    });
  };

  return (
    <>
      {data.choices.map((choice) => {
        return (
          <Button
            aria-disabled={isDisabled}
            key={choice.id}
            name="choiceId"
            onClick={() => vote(choice.id)}
            value={choice.id}
            className="group rounded-none px-0 relative min-h-[220px] w-full overflow-clip py-0 @container odd:bg-rather-blue odd:text-rather-blue-content even:bg-rather-red even:text-rather-red-content lg:min-h-[320px] lg:rounded-md"
          >
            <p className="flex h-full text-balance break-words grow items-center justify-center p-3 text-lg transition-transform group-hover:-translate-y-2 group-focus-visible:-translate-y-2 group-aria-disabled:transform-none @sm:text-xl @md:text-2xl @lg:text-3xl">
              {choice.body}
            </p>
            {choice.voted && (
              <User className="absolute bottom-3 right-3 size-8 rounded-md border-none drop-shadow-md motion-safe:animate-in motion-safe:slide-in-from-bottom-6" />
            )}
            {voted && (
              <div className="flex absolute top-0 left-0 w-full items-center justify-between px-3 py-px font-bold lowercase bg-black/25 motion-safe:animate-in motion-safe:slide-in-from-top-6">
                <div>
                  <FormatNumber
                    options={{
                      type: "number",
                      number: choice.total.votes,
                      notation: "compact",
                    }}
                  />
                  &nbsp;
                  <FormatNumber
                    options={{
                      type: "text",
                      text: "votes",
                      number: choice.total.votes,
                      pluralize: true,
                    }}
                  />
                </div>
                <FormatNumber
                  options={{
                    type: "number",
                    number: choice.percentage,
                    notation: "standard",
                    style: "percent",
                  }}
                />
              </div>
            )}
          </Button>
        );
      })}
    </>
  );
}
