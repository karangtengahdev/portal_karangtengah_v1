import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Terjadi kesalahan internal';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as Record<string, unknown>;
        message = (r.message as string) ?? message;
        code = (r.error as string)?.toUpperCase().replace(/ /g, '_') ?? code;
      }
      code = HttpStatus[status] ?? code;
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    }

    const isDev = process.env.NODE_ENV !== 'production';
    const detail =
      exception instanceof Error && isDev
        ? { name: exception.name, detail: exception.message }
        : {};

    response.status(status).json({
      success: false,
      error: { code, message, ...detail },
    });
  }
}
