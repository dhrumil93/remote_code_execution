import { Response } from 'express';

class APIResponse {
  message: string = 'This is Default API Response Message';
  statusCode: number = 200;
  data: any;

  constructor(
    message = 'This is Default Message',
    statusCode: number,
    data: any,
    res: Response,
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;

    res.status(statusCode).json({ statusCode, message, data });
  }
}

export default APIResponse;
