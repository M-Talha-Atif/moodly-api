import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();
    const { method, url } = req;
    const started = Date.now();
    return next.handle().pipe(
      tap(() =>
        // WINSTON_MODULE_NEST_PROVIDER wraps winston in NestJS's LoggerService shape.
        // Its log() takes one object (message plus arbitrary extra fields as metadata)
        // rather than winston's own (message, meta) signature, an object as the second
        // positional argument would be treated as a context label, not metadata.
        this.logger.log({
          message: 'Handled request',
          method,
          url,
          durationMs: Date.now() - started,
        }),
      ),
    );
  }
}
