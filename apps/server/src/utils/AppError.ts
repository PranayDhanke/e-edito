//creating a error handler to handle the error globally inside the server

//adding options in error handling
type AppErrorOptions = {
  code?: string;
  details?: unknown;
  isOperational?: boolean;
};

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;
  isOperational: boolean;

  constructor(statusCode: number, message: string, options: AppErrorOptions = {}) {
    super(message);

    this.statusCode = statusCode;
    this.code = options.code ?? "APP_ERROR";
    this.details = options.details;
    this.isOperational = options.isOperational ?? true;

    Error.captureStackTrace(this, this.constructor);
  }
}
