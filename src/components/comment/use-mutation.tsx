"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment } from "~/actions/comment";
import { queryKeys } from "~/lib/query-keys";

type DeleteComment = {
  type: "delete";
  contentId: string;
  commentId: string;
};

type AddComment = {
  type: "add";
  contentId: string;
  parentId?: string;
  body: string;
};

type CommentAction = AddComment | DeleteComment;
type Variables<T = CommentAction> = T extends { type: "delete" }
  ? DeleteComment
  : T extends { type: "add" }
    ? AddComment
    : never;

export function useCommentMutation() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (variables: Variables) => {
      switch (variables.type) {
        case "add":
          const formData = new FormData();

          Object.entries(variables).forEach(([key, value]) => {
            if (key === "type") return;
            formData.set(key, value);
          });

          const response = await createComment(formData).catch((e) => e);
          if (response?.error) {
            throw new Error(response.error);
          }

          return response;
        case "delete":
          await deleteComment({
            commentId: variables.commentId,
            forumId: variables.contentId,
          });
          return;
      }
    },
    onSuccess(_, variables) {
      if (variables.type === "add") {
        client.invalidateQueries({
          queryKey: queryKeys.threads({
            contentId: variables.contentId,
            parentId: variables.parentId || null,
          }),
        });
      }

      if (variables.type === "delete") {
        client.invalidateQueries({
          queryKey: queryKeys.threads({
            contentId: variables.contentId,
            parentId: variables.commentId,
          }),
        });
      }
    },
  });
}
