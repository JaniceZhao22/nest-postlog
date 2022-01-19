import {CallHandler, ExecutionContext, Injectable,NestInterceptor,} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { Logger } from '../utils/log4js.helper';
import { CommonUtil } from '../utils/common.util';


@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const begin = Date.now();
    return next.handle().pipe(
      tap(() =>
        Logger.info(`[${req.originalUrl}] times: ${Date.now() - begin}ms`),
      ),
      map((data) => {
        let resData = data;
        if (data && !data.hasOwnProperty('code')) {
          resData = { code: 0, data: data, msg: '请求成功' };
        }
        Logger.info(
          `[${CommonUtil.getClientIp(req)}] [${req.originalUrl}] [${req.method}]`,
          ` [query: ${JSON.stringify(req.query)}]`,
          ` [body: ${JSON.stringify(req.body)}]`,
          ` [response: ${JSON.stringify(resData)}]`,
        );
        return resData;
      }),
    );
  }
}

