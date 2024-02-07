"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RegisteredDatabaseUserAttributes } from "lucia";
import { toast } from "sonner";
import { createVote, getVotes } from "~/actions/poll";
import type { CreateVoteOutput } from "~/db/validations/poll";
import { queryKeys } from "~/lib/query-keys";

export type GetVotesReturnType = Awaited<ReturnType<typeof getVotes>>["data"];
export function useVoteResult(pollId: string) {
  return useQuery({
    queryKey: queryKeys.polls({ id: pollId }),
    queryFn: async () => {
      const response = await getVotes(pollId);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    refetchOnMount: false,
  });
}

type T = {
  total: {
    votes: number;
  };
  options: {
    voted: boolean;
    total: {
      votes: number;
    };
    percentage: number;
    id: string;
    body: string;
  }[];
};

export function useVoteMutation() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (
      variables: CreateVoteOutput & {
        user?: RegisteredDatabaseUserAttributes | null;
      },
    ) => {
      const formData = new FormData();
      formData.set("optionId", variables.optionId);
      formData.set("pollId", variables.pollId);

      const response = await createVote(formData);

      if (response?.error) {
        throw response.error;
      }
    },
    onMutate: async (variables) => {
      const queryKey = queryKeys.polls({ id: variables.pollId });
      await client.cancelQueries({ queryKey });

      client.setQueryData(queryKey, (data: T) => {
        if (!data) {
          return data;
        }

        const votes = data.total.votes + 1;

        return {
          total: { votes },
          options: data.options.map((option) => {
            const optionVotes =
              option.total.votes + (option.id === variables.optionId ? 1 : 0);
            return {
              ...option,
              voted: option.id === variables.optionId,
              total: { votes: optionVotes },
              percentage: votes ? optionVotes / votes : 0,
            };
          }),
        };
      });
    },
    onError: (_, variables) => {
      const queryKey = queryKeys.polls({ id: variables.pollId });

      client.setQueryData(queryKey, (data: T) => {
        if (!data) {
          return data;
        }

        const votes = data.total.votes - 1;

        return {
          total: { votes },
          options: data.options.map((option) => {
            if (option?.id !== variables.optionId) return option;
            const optionVotes = option.total.votes - 1;
            return {
              ...option,
              voted: false,
              total: { votes: optionVotes },
              percentage: votes ? optionVotes / votes : 0,
            };
          }),
        };
      });

      toast.error("Failed to save vote");
    },
  });
}
