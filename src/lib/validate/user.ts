import { MAX_USERS_PER_PAGE, MIN_USERS_PER_PAGE } from "~/lib/constants";
import {
  SearchParamsSchema,
  maxErrorMessage,
  minErrorMessage,
} from "~/lib/validate";

import {
  type Output,
  maxLength,
  minLength,
  object,
  regex,
  string,
  toLowerCase,
  toTrimmed,
  coerce,
  nullish,
  number,
  minValue,
  maxValue,
  optional,
  merge,
  transform,
} from "valibot";

export const fields = {
  username: {
    max: 32,
    min: 1,
    name: "username",
    label: "username",
    regex: /^[a-zA-Z0-9](?!.*[_.]{2})[a-zA-Z0-9._]{0,30}[a-zA-Z0-9]$/,
  },
  display_name: {
    max: 32,
    min: 1,
    name: "display_name",
    label: "display name",
    regex: /^[a-zA-Z0-9](?!.*[_.]{2})[a-zA-Z0-9._ ]{0,30}[a-zA-Z0-9]$/,
  },
  biography: {
    max: 80,
    min: 0,
    regex: /^[\s\S]{0,80}$/,
    name: "biography",
    label: "biography",
  },
} as const;

export const ProfileSchema = object({
  username: string([
    toLowerCase(),
    toTrimmed(),
    minLength(fields.username.min, minErrorMessage(fields.username.min)),
    maxLength(fields.username.max, maxErrorMessage(fields.username.max)),
    regex(
      fields.username.regex,
      "Username must contain alphanumeric characters or underscores and start/end with a letter or number",
    ),
  ]),
  display_name: string([
    toTrimmed(),
    minLength(
      fields.display_name.min,
      minErrorMessage(fields.display_name.min),
    ),
    maxLength(
      fields.display_name.max,
      maxErrorMessage(fields.display_name.max),
    ),
    regex(
      fields.display_name.regex,
      "Display name must contain alphanumeric characters or underscores and start/end with a letter or number",
    ),
  ]),
  biography: optional(
    string([
      toTrimmed(),
      maxLength(fields.biography.max, maxErrorMessage(fields.biography.max)),
      regex(fields.biography.regex, "Biography contains an invalid character"),
    ]),
  ),
});

export const SearchSchema = merge([
  SearchParamsSchema,
  object({
    before: optional(nullish(string([toTrimmed()])), null),
    after: optional(nullish(string([toTrimmed()])), null),
    username: optional(ProfileSchema.entries.username),
    limit: optional(
      coerce(
        number([minValue(MIN_USERS_PER_PAGE), maxValue(MAX_USERS_PER_PAGE)]),
        Number,
      ),
      MIN_USERS_PER_PAGE,
    ),
  }),
]);

export const UsernameSchema = object({
  username: ProfileSchema.entries.username,
});

export const StrippedUsername = transform(
  string([
    toLowerCase(),
    regex(/^@[a-zA-Z0-9](?!.*[_.]{2})[a-zA-Z0-9._]{0,30}[a-zA-Z0-9]$/),
  ]),
  (input) => input.slice(1),
);

export type ProfileOutput = Output<typeof ProfileSchema>;
export type SearchOutput = Output<typeof SearchSchema>;
