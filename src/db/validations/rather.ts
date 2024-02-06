import {
  SearchSchema as BaseSearchSchema,
  maxErrorMessage,
  minErrorMessage,
} from "~/db/validations";
import { fields as user } from "./user";

import {
  boolean,
  coerce,
  fallback,
  maxLength,
  maxValue,
  merge,
  minLength,
  minValue,
  number,
  object,
  optional,
  regex,
  string,
  toCustom,
  toLowerCase,
  toTrimmed,
  type Output,
} from "valibot";

export const MAX_RATHERS_PER_PAGE = 24;
export const MIN_RATHERS_PER_PAGE = 12;

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
  option_one: {
    name: "option_one",
    label: "option one",
    max: 80,
    min: 2,
    regex: /^[\w\d\-.,!?&():'" ]{1,80}$/,
    pattern: `^[a-zA-Z0-9.,!?&():'"\\- ]{1,80}$`,
  },
  option_two: {
    name: "option_two",
    label: "option two",
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
  option_one: string([
    toTrimmed(),
    minLength(fields.option_one.min, minErrorMessage(fields.option_one.min)),
    maxLength(fields.option_one.max, maxErrorMessage(fields.option_one.max)),
    regex(
      fields.option_one.regex,
      "Valid characters: a-z A-Z 0-9 . , ! ? & ( ) : ' \" -",
    ),
  ]),
  option_two: string([
    toTrimmed(),
    minLength(fields.option_two.min, minErrorMessage(fields.option_two.min)),
    maxLength(fields.option_two.max, maxErrorMessage(fields.option_two.max)),
    regex(
      fields.option_two.regex,
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
  optionId: string(),
});

export const SearchSchema = merge([
  BaseSearchSchema,
  object({
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

export type CreateRatherOutput = Output<typeof CreateRatherSchema>;
export type SlugOutput = Output<typeof SlugSchema>;
export type CreateVoteOutput = Output<typeof CreateVoteSchema>;
export type SearchOutput = Output<typeof SearchSchema>;
