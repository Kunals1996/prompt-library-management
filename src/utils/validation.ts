import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

export const validateObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Middleware for validating MongoDB ObjectId
export const validateMongoId = (req: Request, res: Response, next: NextFunction): void => {
  const id = req.params.id;
  
  if (!validateObjectId(id)) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
    return;
  }
  
  next();
}; 