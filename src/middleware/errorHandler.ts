import { Request, Response, NextFunction } from "express";


export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}


export class ErrorHandler {
  public static handleError(
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (!err.statusCode) {
      console.log(err);
    }
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
}
