import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

export const errorHandler = (
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

    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Programming or unknown errors
  logger.error('Unexpected error:', {
    message: err.message,
    stack: err.stack
  });

  return res.status(500).json({
    success: false,
    message: 'Something went wrong'
  });
}; 