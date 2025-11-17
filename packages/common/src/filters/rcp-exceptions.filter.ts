import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RRpcValidationFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const error = exception.getError() as {
      message: string;
      code?: number;
    };

    return response.status(error.code || 500).json({
      statusCode: error.code || 500,
      message: error.message,
    });
  }
}