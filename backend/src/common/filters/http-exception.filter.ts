import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      success: false,
      error: {
        code: this.getErrorCode(status),
        message: this.getErrorMessage(exceptionResponse),
        details: this.getErrorDetails(exceptionResponse),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    const codes: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'VALIDATION_ERROR',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_ERROR',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_ERROR',
    };
    return codes[status] || 'UNKNOWN_ERROR';
  }

  private getErrorMessage(exceptionResponse: any): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }
    return exceptionResponse.message || 'An error occurred';
  }

  private getErrorDetails(exceptionResponse: any): any {
    if (typeof exceptionResponse === 'object' && exceptionResponse.message) {
      if (Array.isArray(exceptionResponse.message)) {
        return exceptionResponse.message.map((msg: string) => ({
          message: msg,
        }));
      }
    }
    return undefined;
  }
}

