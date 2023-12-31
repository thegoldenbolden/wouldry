import {
  type Output,
  nullish,
  number,
  object,
  optional,
  picklist,
  string,
  toTrimmed,
  coerce,
} from "valibot";

export const minErrorMessage = (length = 0) => {
  return `Must be at least ${length} character(s)`;
};

export const maxErrorMessage = (length = 0) => {
  return `Cannot be more than ${length} character(s)`;
};

export const SearchParamsSchema = object({
  orderBy: optional(picklist(["created_at"]), "created_at"),
  sort: optional(picklist(["asc", "desc"]), "desc"),
  before: optional(nullish(string([toTrimmed()])), null),
  after: optional(nullish(string([toTrimmed()])), null),
});

export const IdSchema = object({
  id: coerce(string(), String),
});

export const NumberSchema = object({
  number: coerce(number(), Number),
});

export type IdOutput = Output<typeof IdSchema>;
export type NumberOutput = Output<typeof NumberSchema>;
