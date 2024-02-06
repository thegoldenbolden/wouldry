import {
  Input,
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
  toLowerCase,
  toTrimmed,
  type Output,
} from "valibot";
import {
  SearchSchema as BaseSearchSchema,
  maxErrorMessage,
  minErrorMessage,
} from "~/db/validations";
import { fields as user } from "./user";

export const MAX_COMMENTS_PER_PAGE = 24;
export const MIN_COMMENTS_PER_PAGE = 12;

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

export const CreateCommentSchema = object({
  contentId: string(),
  parentId: optional(string()),
  body: string([
    toTrimmed(),
    minLength(fields.body.min, minErrorMessage(fields.body.min)),
    maxLength(fields.body.max, maxErrorMessage(fields.body.max)),
    regex(fields.body.regex, "Comment contains an invalid character"),
  ]),
});

export const SearchSchema = merge([
  BaseSearchSchema,
  object({
    contentId: string(),
    username: optional(
      string([
        toLowerCase(),
        toTrimmed(),
        minLength(user.username.min, minErrorMessage(user.username.min)),
        maxLength(user.username.max, maxErrorMessage(user.username.max)),
        regex(
          user.username.regex,
          "Username must contain alphanumeric characters or underscores and start/end with a letter or number",
        ),
      ]),
    ),
    parentId: optional(nullable(string()), null),
    before: optional(nullable(string()), null),
    after: optional(nullable(string()), null),
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
  commentId: string(),
  forumId: string(),
});

export type CreateCommentOutput = Output<typeof CreateCommentSchema>;
export type SearchOutput = Output<typeof SearchSchema>;
export type DeleteCommentInput = Input<typeof DeleteCommentSchema>;
export type DeleteCommentOutput = Output<typeof DeleteCommentSchema>;
