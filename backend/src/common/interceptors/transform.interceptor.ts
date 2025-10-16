import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data already has pagination meta, use it
        if (data && typeof data === 'object' && 'meta' in data && 'data' in data) {
          return {
            success: true,
            ...data,
          };
        }

        // Otherwise, wrap the data
        return {
          success: true,
          data,
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}

