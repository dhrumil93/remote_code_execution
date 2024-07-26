class APIError extends Error {
  statusCode: number = 400;
  errors: any;
  errorMessage: string = '';

  constructor(
    statusCode = 400,
    message = 'This is Default Error Message',
    errors: any = [],
  ) {
    super();
    this.statusCode = statusCode;
    this.errorMessage = message;
    this.errors = errors;
  }
}

export default APIError;
