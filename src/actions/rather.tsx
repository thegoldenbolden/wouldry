"use server";

import { deleteRather as destroyRather } from "~/db/rather/delete-rather";
import { createRather as addRather } from "~/db/rather/create-rather";
import { createVote as addVote } from "~/db/rather/create-vote";
import { getUserVote } from "~/db/rather/get-session-user-vote";
import { getVotes as findVotes } from "~/db/rather/get-votes";
import { getRathers } from "~/db/rather/get-rathers";
import { getSession } from "~/lib/auth/utils";
import { redirect } from "next/navigation";
import { IdSchema } from "~/lib/validate";
import { safeParse } from "valibot";
import { links } from "~/lib/links";

import {
  type CreateRatherOutput,
  CreateRatherSchema,
  CreateVoteSchema,
  SearchSchema,
  SlugSchema,
} from "~/lib/validate/rather";

export async function search(searchParams: URLSearchParams) {
  const parse = safeParse(SearchSchema, Object.fromEntries(searchParams));
  if (!parse.success) {
    return { error: parse.issues[0].message };
  }

  try {
    const rathers = await getRathers(parse.output);
    return { ...rathers };
  } catch (error) {
    console.error(error);
    return { error: "Something unexpected occurred" };
  }
}

export async function createRather(formData: CreateRatherOutput) {
  const details = safeParse(CreateRatherSchema, formData);
  if (!details.success) {
    return { error: details.issues[0].message };
  }

  const slug = safeParse(SlugSchema, { slug: details.output.title });
  if (!slug.success) {
    return { error: slug.issues[0].message };
  }

  const session = await getSession();
  if (!session?.user?.id) {
    return redirect(links.login.href);
  }

  const data = { ...details.output, ...slug.output };

  try {
    const rather = await addRather(session.user.id, data);
    return { slug: rather.slug, number: rather.number };
  } catch (error) {
    console.error(error);
    return { error: "Something unexpected occurred" };
  }
}

export async function getVotes(id: string) {
  const parse = safeParse(IdSchema, { id });
  if (!parse.success) {
    return { error: parse.issues[0].message };
  }

  const session = await getSession();
  if (!session?.user?.id) {
    return redirect(links.login.href);
  }

  try {
    const [votes, voted] = await Promise.all([
      findVotes(parse.output),
      getUserVote(session.user.id, parse.output),
    ]);

    return {
      total: votes.total,
      choices: votes.choices.map((choice) => ({
        ...choice,
        ...(choice.id === voted?.choiceId && { voted: true }),
      })),
    };
  } catch (error) {
    console.error(error);
    return { error: "Error fetching votes" };
  }
}

export async function createVote(formData: FormData) {
  const parse = safeParse(CreateVoteSchema, Object.fromEntries(formData));
  if (!parse.success) {
    return { error: parse.issues[0].message };
  }

  const session = await getSession();
  if (!session?.user?.id) {
    return redirect(links.login.href);
  }

  try {
    const data = await addVote(session.user.id, parse.output);
    return { response: data };
  } catch (error) {
    console.error(error);
    return { error: "There was an error creating vote" };
  }
}

export async function deleteRather(formData: FormData) {
  const parse = safeParse(IdSchema, Object.fromEntries(formData));
  if (!parse.success) {
    return { error: parse.issues[0].message };
  }

  const session = await getSession();
  if (!session?.user?.id) {
    return redirect(links.login.href);
  }

  try {
    await destroyRather(session.user.id, parse.output);
    return { message: "Deleted rather" };
  } catch (error) {
    console.error(error);
    return { error: "There was an error creating vote" };
  }
}
