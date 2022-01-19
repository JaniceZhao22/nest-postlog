export class CommonUtil {
    // 获取客户端ip
    static getClientIp(req): string {
      return (req.headers['x-forwarded-for'] || '').split(',')[0] || req.ip;
    }
  }
  