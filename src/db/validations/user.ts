import {
  coerce,
  fallback,
  length,
  maxLength,
  maxValue,
  merge,
  minLength,
  minValue,
  nullable,
  nullish,
  number,
  object,
  optional,
  picklist,
  regex,
  string,
  toLowerCase,
  toTrimmed,
  transform,
  type Output,
} from "valibot";
import {
  SearchSchema as BaseSearchSchema,
  maxErrorMessage,
  minErrorMessage,
} from "~/db/validations";
import { providers } from "~/lib/auth/providers";

export const MAX_USERS_PER_PAGE = 24;
export const MIN_USERS_PER_PAGE = 12;

export const fields = {
  username: {
    max: 32,
    min: 1,
    name: "username",
    label: "username",
    regex: /^[a-zA-Z0-9](?!.*[_.]{2})[a-zA-Z0-9._]{0,30}[a-zA-Z0-9]$/,
  },
  nickname: {
    max: 32,
    min: 1,
    name: "nickname",
    label: "nickname",
    regex: /^[a-zA-Z0-9](?!.*[_.]{2})[a-zA-Z0-9._ ]{0,30}[a-zA-Z0-9]$/,
  },
  about: {
    max: 80,
    min: 0,
    regex: /^[\s\S]{0,80}$/,
    name: "about",
    label: "about",
  },
} as const;

export const USER_ID_LENGTH = 18;
export const OAUTH_ID_LENGTH = 21;
export const SESSION_ID_LENGTH = 21;

export const CreateUserSchema = object({
  id: string([length(USER_ID_LENGTH), regex(/[a-zA-Z0-9]{18}/g)]),
  image: string(),
  email: string(),
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
  nickname: string([
    toTrimmed(),
    minLength(fields.nickname.min, minErrorMessage(fields.nickname.min)),
    maxLength(fields.nickname.max, maxErrorMessage(fields.nickname.max)),
    regex(
      fields.nickname.regex,
      "Display name must contain alphanumeric characters or underscores and start/end with a letter or number",
    ),
  ]),
  about: optional(
    string([
      toTrimmed(),
      maxLength(fields.about.max, maxErrorMessage(fields.about.max)),
      regex(fields.about.regex, "About contains an invalid character"),
    ]),
  ),
});

export const UserIdSchema = object({
  id: CreateUserSchema.entries.id,
});

export const EmailSchema = object({
  email: CreateUserSchema.entries.email,
});

export const OAuthAccountSchema = object({
  provider: picklist(providers),
  providerUserId: string(),
});

export const UpdateUserSchema = object({
  username: CreateUserSchema.entries.username,
  nickname: CreateUserSchema.entries.nickname,
  about: CreateUserSchema.entries.about,
});

export const CreateOAuthAccountSchema = object({
  id: string([length(OAUTH_ID_LENGTH), regex(/[a-zA-Z0-9]{21}/g)]),
  image: string(),
  nickname: string(),
  username: string(),
  provider: picklist(providers),
  scope: optional(fallback(nullable(string()), null)),
  providerUserId: string(),
  userId: string(),
  email: string(),
});

export const StrippedUsername = transform(
  string([
    toLowerCase(),
    regex(/^@[a-zA-Z0-9](?!.*[_.]{2})[a-zA-Z0-9._]{0,30}[a-zA-Z0-9]$/),
  ]),
  (input) => input.slice(1),
);

export const SearchSchema = merge([
  BaseSearchSchema,
  object({
    before: optional(nullish(string([toTrimmed()])), null),
    after: optional(nullish(string([toTrimmed()])), null),
    username: optional(
      string([
        toLowerCase(),
        toTrimmed(),
        minLength(fields.username.min, minErrorMessage(fields.username.min)),
        maxLength(fields.username.max, maxErrorMessage(fields.username.max)),
        regex(
          fields.username.regex,
          "Username must contain alphanumeric characters or underscores and start/end with a letter or number",
        ),
      ]),
    ),
    limit: optional(
      coerce(
        number([minValue(MIN_USERS_PER_PAGE), maxValue(MAX_USERS_PER_PAGE)]),
        Number,
      ),
      MIN_USERS_PER_PAGE,
    ),
  }),
]);

export type CreateUserOutput = Output<typeof CreateUserSchema>;
export type UserIdOutput = Output<typeof UserIdSchema>;
export type EmailOutput = Output<typeof EmailSchema>;
export type OAuthAccountOutput = Output<typeof OAuthAccountSchema>;
export type UpdateUserOutput = Output<typeof UpdateUserSchema>;
export type CreateOAuthAccountOutput = Output<typeof CreateOAuthAccountSchema>;
export type StrippedUsernameOutput = Output<typeof StrippedUsername>;
export type SearchOutput = Output<typeof SearchSchema>;
