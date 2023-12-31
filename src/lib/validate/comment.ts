import { MAX_COMMENTS_PER_PAGE, MIN_COMMENTS_PER_PAGE } from "~/lib/constants";
import { ProfileSchema } from "~/lib/validate/user";

import {
  SearchParamsSchema,
  maxErrorMessage,
  minErrorMessage,
} from "~/lib/validate";

import {
  type Output,
  coerce,
  maxLength,
  maxValue,
  merge,
  minLength,
  minValue,
  nullable,
  number,
  object,
  optional,
  regex,
  string,
  toTrimmed,
} from "valibot";

export const fields = {
  body: {
    name: "body",
    label: "comment",
    max: 300,
    min: 1,
    regex: /^[\s\S]{1,300}$/,
  },
  contentId: {
    name: "contentId",
  },
  parentId: {
    name: "parentId",
  },
  commentId: {
    name: "commentId",
  },
} as const;

export const CommentIdSchema = object({
  id: string([regex(/\w{12}/)]),
});

export const CreateCommentSchema = object({
  contentId: string(),
  parentId: optional(CommentIdSchema.entries.id),
  body: string([
    toTrimmed(),
    minLength(fields.body.min, minErrorMessage(fields.body.min)),
    maxLength(fields.body.max, maxErrorMessage(fields.body.max)),
    regex(fields.body.regex, "Comment contains an invalid character"),
  ]),
});

export const SearchSchema = merge([
  SearchParamsSchema,
  object({
    contentId: string(),
    parentId: optional(nullable(CommentIdSchema.entries.id), null),
    before: optional(nullable(CommentIdSchema.entries.id), null),
    after: optional(nullable(CommentIdSchema.entries.id), null),
    username: optional(ProfileSchema.entries.username),
    limit: optional(
      coerce(
        number([
          minValue(MIN_COMMENTS_PER_PAGE),
          maxValue(MAX_COMMENTS_PER_PAGE),
        ]),
        Number,
      ),
      MIN_COMMENTS_PER_PAGE,
    ),
  }),
]);

export const DeleteCommentSchema = object({
  commentId: CommentIdSchema.entries.id,
  forumId: string(),
});

export type CreateCommentOutput = Output<typeof CreateCommentSchema>;
export type DeleteCommentOutput = Output<typeof DeleteCommentSchema>;
export type CommentIdOutput = Output<typeof CommentIdSchema>;
export type SearchOutput = Output<typeof SearchSchema>;
