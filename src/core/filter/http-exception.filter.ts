import {ArgumentsHost,Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import { Logger } from '../utils/log4js.helper';
import { CommonUtil } from '../utils/common.util';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码
    const req = ctx.getRequest();
    // 设置错误信息
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;
    const errorResponse = {
      data: {},
      message: message,
      code: -1,
    };
    Logger.error(
      `[${CommonUtil.getClientIp(req)}] [${req.originalUrl}] [${req.method}]`,
      ` [query: ${JSON.stringify(req.query)}]`,
      ` [body: ${JSON.stringify(req.body)}]`,
      ` [${status}]`,
      ` ${exception}`,
    );

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
