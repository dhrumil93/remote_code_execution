import { NextFunction, Request, Response, RequestHandler } from 'express';

// Define the type for the request handler
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any> | void;

// AsyncHandler function with type annotations
const AsyncHandler = (requestHandler: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.error(err);
      next(err);
    });
  };
};

export default AsyncHandler;
