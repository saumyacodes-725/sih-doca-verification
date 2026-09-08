// Lets route handlers throw an error with an HTTP status attached, instead of
// hand-rolling res.status(...).json(...) at every call site. Thrown inside an
// async route handler, Express 5 forwards it automatically to the error
// handler in server.js.
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
