import {
  coerce,
  nullish,
  number,
  object,
  optional,
  picklist,
  string,
  toTrimmed,
  type Output,
} from "valibot";

export function minErrorMessage(length = 0) {
  return `Must be at least ${length} character(s)`;
}

export function maxErrorMessage(length = 0) {
  return `Cannot be more than ${length} character(s)`;
}

export const IdSchema = object({
  id: coerce(string(), String),
});

export const NumberSchema = object({
  number: coerce(number(), Number),
});

export const SearchSchema = object({
  orderBy: optional(picklist(["created_at"]), "created_at"),
  sort: optional(picklist(["asc", "desc"]), "desc"),
  before: optional(nullish(string([toTrimmed()])), null),
  after: optional(nullish(string([toTrimmed()])), null),
});

export type IdOutput = Output<typeof IdSchema>;
export type NumberOutput = Output<typeof NumberSchema>;
export type SearchOutput = Output<typeof SearchSchema>;
