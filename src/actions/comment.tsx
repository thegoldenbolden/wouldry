"use server";

import { deleteComment as destroy } from "~/db/comment/delete-comment";
import { getComments } from "~/db/comment/get-comments";
import { create } from "~/db/comment/create-comment";
import { getSession } from "~/lib/auth/utils";
import { redirect } from "next/navigation";
import { links } from "~/lib/links";
import { safeParse } from "valibot";

import {
  type DeleteCommentOutput,
  CreateCommentSchema,
  DeleteCommentSchema,
  SearchSchema,
} from "~/lib/validate/comment";

export async function createComment(formData: FormData) {
  const parse = safeParse(CreateCommentSchema, Object.fromEntries(formData));

  if (!parse.success) {
    return {
      error: parse.issues[0].message,
    };
  }

  const session = await getSession();
  if (!session?.user?.id) {
    return redirect(links.login.href);
  }

  try {
    await create(session.user.id, parse.output);
    return;
  } catch (error) {
    console.error(error);
    return { error: "Failed to create comment" };
  }
}

export async function deleteComment(data: DeleteCommentOutput) {
  const parse = safeParse(DeleteCommentSchema, data);

  if (!parse.success) {
    return {
      error: parse.issues[0].message,
    };
  }

  const session = await getSession();
  if (!session?.user?.id) {
    return redirect(links.login.href);
  }

  try {
    await destroy(session.user.id, parse.output);
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete comment" };
  }
}

export async function search(searchParams: URLSearchParams) {
  const parse = safeParse(SearchSchema, Object.fromEntries(searchParams));

  if (!parse.success) {
    return {
      error: parse.issues[0].message,
    };
  }

  try {
    const comments = await getComments(parse.output);
    return { ...comments };
  } catch (error) {
    console.error(error);
    return { error: "Something unexpected occurred" };
  }
}
