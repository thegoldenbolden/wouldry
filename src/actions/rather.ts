"use server";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";
import { getSession } from "~/actions/utils";
import * as db from "~/db/rather";
import { IdSchema } from "~/db/validations";
import {
  CreateRatherSchema,
  CreateVoteSchema,
  SearchSchema,
  SlugSchema,
  type CreateRatherOutput,
} from "~/db/validations/rather";
import { links } from "~/lib/links";
import { logger } from "~/lib/logger";

export async function createRather(formData: CreateRatherOutput) {
  const parse = safeParse(CreateRatherSchema, formData);
  if (!parse.success) {
    return {
      data: null,
      error: {
        message: parse.issues[0].message,
      },
    };
  }

  const slug = safeParse(SlugSchema, { slug: parse.output.title });
  if (!slug.success) {
    return {
      data: null,
      error: {
        message: slug.issues[0].message,
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
    .createRather(session.user.id, {
      ...parse.output,
      ...slug.output,
    })
    .catch((error) => {
      logger.error(error, "Failed to create rather");
      return null;
    });

  if (!response) {
    return {
      data: null,
      error: {
        message: "Failed to create rather",
      },
    };
  }

  return response;
}

export async function createVote(formData: FormData) {
  const parse = safeParse(CreateVoteSchema, Object.fromEntries(formData));
  if (!parse.success) {
    return {
      data: null,
      error: {
        message: parse.issues[0].message,
      },
    };
  }

  const session = await getSession().catch((error) => {
    logger.error(error, "Failed to load session");
    return null;
  });

  if (!session?.user?.id) {
    return;
  }

  const response = await db.createVote(session.user.id, parse.output);
  if (!response) {
    return {
      data: null,
      error: {
        message: "Failed to create vote",
      },
    };
  }
}

export async function deleteRather(formData: FormData) {
  const parse = safeParse(IdSchema, Object.fromEntries(formData));
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
    .deleteRather(session.user.id, parse.output)
    .catch((error) => {
      logger.error(error, "Failed to delete rather");
      return null;
    });

  if (!response) {
    return {
      data: null,
      error: {
        message: "Failed to delete rather",
      },
    };
  }

  return response;
}

export async function getVotes(ratherId: string) {
  const parse = safeParse(IdSchema, { id: ratherId });
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

  const [votesRes, votedRes] = await Promise.all([
    db.getVotes(parse.output),
    session?.user?.id ? db.getVote(session.user.id, parse.output) : null,
  ]).catch((error) => {
    logger.error(error, "Failed to load votes");
    return [null, null];
  });

  const votes = votesRes?.data || { total: 0, options: [] };
  const voted = votedRes?.data || { vote: null };

  return {
    data: {
      total: votes.total,
      options: votes?.options.map((option) => {
        return {
          ...option,
          voted: option.id === voted.vote?.optionId,
        };
      }),
    },
  };
}

export async function findRathers(searchParams: URLSearchParams) {
  const parse = safeParse(SearchSchema, Object.fromEntries(searchParams));
  if (!parse.success) {
    return {
      data: null,
      error: {
        message: parse.issues[0].message,
      },
    };
  }

  const response = await db.findRathers(parse.output).catch((error) => {
    logger.error(error, "Failed to load rathers");
    return null;
  });

  if (!response) {
    return {
      data: null,
      error: {
        message: "Failed to load rathers",
      },
    };
  }

  return { data: response.data };
}
