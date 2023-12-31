// TODO: improve

export const errors = {
  400: {
    code: 400,
    message: "Bad Request",
    description:
      "The request could not be processed due to invalid parameters or malformed data",
  },
  401: {
    code: 401,
    message: "Unauthorized",
    description:
      "Authentication credentials are missing or invalid. Please provide valid credentials.",
  },
  403: {
    code: 403,
    message: "Forbidden",
    description: "You do not have permission to access this resource.",
  },
  404: {
    code: 404,
    message: "Not Found",
    description: "The requested resource could not be found.",
  },
  409: {
    code: 409,
    message: "Conflict",
    description: "The resource already exists.",
  },
  429: {
    code: 429,
    message: "Too Many Requests",
    description:
      "You have exceeded the rate limit for this resource. Please try again later.",
  },
  500: {
    code: 500,
    message: "Internal Server Error",
    description:
      "An unexpected error occurred on the server. Please try again later.",
  },
} as const;

export class CustomError extends Error {
  code: keyof typeof errors;

  constructor(code: keyof typeof errors) {
    super();
    this.code = code;
  }

  getError() {
    return errors[this.code];
  }
}
