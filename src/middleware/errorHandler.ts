import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error('Operational error:', {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack
    });

    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    return;
  }

  // Programming or unknown errors
  logger.error('Unexpected error:', {
    message: err.message,
    stack: err.stack
  });

  res.status(500).json({
    success: false,
    message: 'Something went wrong'
  });
}; 