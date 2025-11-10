import type { Context } from "hono";

export class HttpException extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toResponse(c: Context) {
    const response: { error: string; details?: unknown } = {
      error: this.message,
    };
    if (this.details) {
      response.details = this.details;
    }
    return c.json(response, this.statusCode as never);
  }
}

export class BadRequestException extends HttpException {
  constructor(message = "Bad Request", details?: unknown) {
    super(400, message, details);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized", details?: unknown) {
    super(401, message, details);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden", details?: unknown) {
    super(403, message, details);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Not Found", details?: unknown) {
    super(404, message, details);
  }
}

export class ConflictException extends HttpException {
  constructor(message = "Conflict", details?: unknown) {
    super(409, message, details);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message = "Internal Server Error", details?: unknown) {
    super(500, message, details);
  }
}
