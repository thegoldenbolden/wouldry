"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateVoteOutput } from "~/lib/validate/rather";
import { createVote, getVotes } from "~/actions/rather";
import type { Session } from "next-auth/types";
import { queryKeys } from "~/lib/query-keys";

export type GetVotesReturnType = Awaited<ReturnType<typeof getVotes>>;

export type UseVotesProps = GetVotesReturnType & {
  ratherId: string;
  authenticated: boolean;
};

export function useVotes({ ratherId, authenticated, ...data }: UseVotesProps) {
  return useQuery({
    initialData: data,
    queryKey: queryKeys.rathers({ id: ratherId }),
    queryFn: async () => await getVotes(ratherId),
    refetchOnMount: authenticated,
  });
}

type T = {
  total: {
    votes: number;
  };
  choices: {
    voted: boolean;
    total: {
      votes: number;
    };
    percentage: number;
    id: string;
    body: string;
  }[];
};

export function useVotesMutation(authenticated: boolean) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (
      variables: CreateVoteOutput & { user?: Session["user"] | null },
    ) => {
      if (!authenticated) return;
      const formData = new FormData();
      formData.set("choiceId", variables.choiceId);
      formData.set("ratherId", variables.ratherId);
      return await createVote(formData);
    },
    onMutate: async (variables) => {
      const queryKey = queryKeys.rathers({ id: variables.ratherId });
      await client.cancelQueries({ queryKey });

      client.setQueryData(queryKey, (data: T) => {
        if (!data) {
          return data;
        }

        const votes = data.total.votes + 1;

        return {
          total: { votes },
          choices: data.choices.map((choice) => {
            const choiceVotes =
              choice.total.votes + (choice.id === variables.choiceId ? 1 : 0);
            return {
              ...choice,
              voted: choice.id === variables.choiceId,
              total: { votes: choiceVotes },
              percentage: votes ? choiceVotes / votes : 0,
            };
          }),
        };
      });
    },
    onError: (_, variables) => {
      const queryKey = queryKeys.rathers({ id: variables.ratherId });

      client.setQueryData(queryKey, (data: T) => {
        if (!data) {
          return data;
        }

        const votes = data.total.votes - 1;

        return {
          total: { votes },
          choices: data.choices.map((choice) => {
            if (choice?.id !== variables.choiceId) return choice;
            const choiceVotes = choice.total.votes - 1;
            return {
              ...choice,
              voted: false,
              total: { votes: choiceVotes },
              percentage: votes ? choiceVotes / votes : 0,
            };
          }),
        };
      });
    },
  });
}
