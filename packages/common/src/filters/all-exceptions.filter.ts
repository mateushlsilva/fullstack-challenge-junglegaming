import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

   
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : (exception as any).status || (exception as any).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;


    let message = 'Internal server error';
    let exceptionResponse: string | object = { message: 'Internal server error' };

    if (exception instanceof HttpException) {
      exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message || message;
    } else if (httpStatus !== HttpStatus.INTERNAL_SERVER_ERROR) {

      message = (exception as any).message || message;
    } else {
      console.error(exception);
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      message: message,
    };
    
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}