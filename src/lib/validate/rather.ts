import {
  SearchParamsSchema,
  maxErrorMessage,
  minErrorMessage,
} from "~/lib/validate";
import { MAX_RATHERS_PER_PAGE, MIN_RATHERS_PER_PAGE } from "~/lib/constants";
import { ProfileSchema } from "~/lib/validate/user";

import {
  type Output,
  boolean,
  coerce,
  fallback,
  maxLength,
  maxValue,
  minLength,
  minValue,
  merge,
  number,
  object,
  optional,
  regex,
  string,
  toLowerCase,
  toTrimmed,
  toCustom,
} from "valibot";

export const fields = {
  title: {
    name: "title",
    label: "title",
    max: 50,
    min: 1,
    regex: /^[\w\d\-.,!?&():'" ]{1,50}$/,
    pattern: `^[a-zA-Z0-9.,!?&():'"\\- ]{1,50}$`,
  },
  link: {
    name: "link",
    label: "link",
    min: 2,
    max: 50,
    regex: /^[a-z0-9\-]{1,50}$/,
    pattern: `^[a-z0-9\\-]{1,50}$`,
    tips: `Link must only contain alphanumeric characters, hypens and must be between 2-50 characters in length`,
  },
  choice_one: {
    name: "choice_one",
    label: "choice one",
    max: 80,
    min: 2,
    regex: /^[\w\d\-.,!?&():'" ]{1,80}$/,
    pattern: `^[a-zA-Z0-9.,!?&():'"\\- ]{1,80}$`,
  },
  choice_two: {
    name: "choice_two",
    label: "choice two",
    max: 80,
    min: 2,
    regex: /^[\w\d\-.,!?&():'" ]{1,80}$/,
    pattern: `^[a-zA-Z0-9.,!?&():'"\\- ]{1,80}$`,
  },
  description: {
    name: "description",
    label: "description",
    max: 150,
    min: 0,
    regex: /^[\w\s\d\-.,!?&():'"]{0,150}$/,
    tips: "",
  },
  enable_comments: {
    name: "enable_comments",
    label: "enable comments",
  },
} as const;

export const CreateRatherSchema = object({
  enable_comments: fallback(boolean(), true),
  title: string([
    toTrimmed(),
    minLength(fields.title.min, minErrorMessage(fields.title.min)),
    maxLength(fields.title.max, maxErrorMessage(fields.title.max)),
    regex(
      fields.title.regex,
      "Valid characters: a-z A-Z 0-9 . , ! ? & ( ) : ' \" -",
    ),
  ]),
  choice_one: string([
    toTrimmed(),
    minLength(fields.choice_one.min, minErrorMessage(fields.choice_one.min)),
    maxLength(fields.choice_one.max, maxErrorMessage(fields.choice_one.max)),
    regex(
      fields.choice_one.regex,
      "Valid characters: a-z A-Z 0-9 . , ! ? & ( ) : ' \" -",
    ),
  ]),
  choice_two: string([
    toTrimmed(),
    minLength(fields.choice_two.min, minErrorMessage(fields.choice_two.min)),
    maxLength(fields.choice_two.max, maxErrorMessage(fields.choice_two.max)),
    regex(
      fields.choice_two.regex,
      "Valid characters: a-z A-Z 0-9 . , ! ? & ( ) : ' \" -",
    ),
  ]),
  description: optional(
    string([
      toTrimmed(),
      minLength(
        fields.description.min,
        minErrorMessage(fields.description.min),
      ),
      maxLength(
        fields.description.max,
        maxErrorMessage(fields.description.max),
      ),
      regex(
        fields.description.regex,
        "Consists of letters, numbers, underscores, and punctuation",
      ),
    ]),
  ),
});

export const SlugSchema = object({
  slug: string([
    toLowerCase(),
    toTrimmed(),
    minLength(fields.link.min),
    maxLength(fields.link.max),
    toCustom((value) =>
      value
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase()
        .replace(/--/g, "-"),
    ),
    regex(fields.link.regex),
  ]),
});

export const CreateVoteSchema = object({
  ratherId: string(),
  choiceId: string(),
});

export const SearchSchema = merge([
  SearchParamsSchema,
  object({
    username: optional(ProfileSchema.entries.username),
    limit: optional(
      coerce(
        number([
          minValue(MIN_RATHERS_PER_PAGE),
          maxValue(MAX_RATHERS_PER_PAGE),
        ]),
        Number,
      ),
      MIN_RATHERS_PER_PAGE,
    ),
  }),
]);

export type SearchOutput = Output<typeof SearchSchema>;
export type CreateRatherOutput = Output<typeof CreateRatherSchema>;
export type CreateVoteOutput = Output<typeof CreateVoteSchema>;
export type SlugOutput = Output<typeof SlugSchema>;
