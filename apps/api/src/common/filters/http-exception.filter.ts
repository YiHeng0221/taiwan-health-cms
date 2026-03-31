/**
 * @fileoverview Global HTTP Exception Filter
 *
 * Provides consistent error response format across the API.
 * Maps NestJS exceptions to the ApiError interface from shared-types.
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiError } from '@taiwan-health/shared-types';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '伺服器內部錯誤';
    let errors: ApiError['errors'] = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || message;

        // Handle validation errors from class-validator
        if (Array.isArray(responseObj.message)) {
          message = '驗證錯誤';
          errors = (responseObj.message as string[]).map((msg: string) => {
            // Extract field name from validation message (e.g., "title must be a string" -> "title")
            const field = this.extractFieldName(msg);
            return { field, message: msg };
          });
        }
      }
    }

    const errorResponse: ApiError = {
      success: false,
      statusCode: status,
      message,
      errors,
    };

    response.status(status).json(errorResponse);
  }

  private extractFieldName(message: string): string {
    // class-validator messages typically start with the property name
    // e.g., "title must be a string", "email must be an email"
    const match = message.match(/^(\w+)\s/);
    return match ? match[1] : 'unknown';
  }
}
