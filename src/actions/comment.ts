"use server";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";
import * as db from "~/db/comment";
import {
  CreateCommentSchema,
  DeleteCommentSchema,
  SearchSchema,
  type DeleteCommentInput,
} from "~/db/validations/comment";
import { links } from "~/lib/links";
import { logger } from "~/lib/logger";
import { getSession } from "./utils";

export async function createComment(formData: FormData) {
  const parse = safeParse(CreateCommentSchema, Object.fromEntries(formData));

  if (!parse.success) {
    return {
      data: null,
      error: {
        message: parse.issues[0].message,
      },
    };
  }

  const session = await getSession().catch((e) => {
    logger.error(e, e.message || "Failed to get session");
    return null;
  });

  if (!session?.user?.id) {
    redirect(links.login.href);
  }

  const response = await db
    .createComment(session.user.id, parse.output)
    .catch((error) => {
      logger.error(error, "Failed to create comment");
      return null;
    });

  if (!response) {
    return {
      data: null,
      error: {
        message: "Failed to create comment",
      },
    };
  }

  return response;
}

export async function deleteComment(input: DeleteCommentInput) {
  const parse = safeParse(DeleteCommentSchema, input);

  if (!parse.success) {
    return {
      data: null,
      error: {
        message: parse.issues[0].message,
      },
    };
  }

  const session = await getSession().catch((e) => {
    logger.error(e, e.message || "Failed to load session");
    return null;
  });

  if (!session?.user?.id) {
    redirect(links.login.href);
  }

  const response = await db
    .deleteComment(session.user.id, parse.output)
    .catch((error) => {
      logger.error(error, "Failed to delete comment");
      return null;
    });

  if (!response) {
    return {
      data: null,
      error: {
        message: "Failed to delete comment",
      },
    };
  }

  return response;
}

export async function findComments(params: URLSearchParams) {
  const parse = safeParse(SearchSchema, Object.fromEntries(params));

  if (!parse.success) {
    return {
      data: null,
      error: {
        message: parse.issues[0].message,
      },
    };
  }

  const response = await db.findComments(parse.output).catch((error) => {
    logger.error(error, "Failed to load comments");
    return null;
  });

  if (!response) {
    return {
      data: null,
      error: {
        message: "Failed to load comments",
      },
    };
  }

  return {
    data: response.data,
  };
}
