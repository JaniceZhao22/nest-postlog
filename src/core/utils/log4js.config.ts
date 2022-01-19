import * as path from 'path';

// 日志目录
const logPath = process.env['log-path'] || '../../../logs';
const baseLogPath = path.resolve(__dirname, logPath);

// 日志配置
export const Log4jsConfig: any = {
  appenders: {
    console: {
      type: 'console', // 会打印到控制台
    },
    app: {
      type: 'dateFile',
      filename: `${baseLogPath}/app.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '[%d] [%h] [%p] - %m',
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      daysToKeep: 15,
      numBackups: 3,
      keepFileExt: true,
      disableClustering: true,
    },
    errorFile: {
      type: 'dateFile',
      filename: `${baseLogPath}/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '[%d] [%h] [%p] - %m',
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      daysToKeep: 30,
      // maxLogSize: 10485760,
      numBackups: 3,
      keepFileExt: true,
      disableClustering: true,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },
  categories: {
    default: {
      appenders: ['console', 'app', 'errors'],
      level: 'DEBUG',
    },
  },
  pm2: true, // 使用 pm2 来管理项目时，打开
  pm2InstanceVar: 'INSTANCE_ID', // 会根据 pm2 分配的 id 进行区分，以免各进程在写日志时造成冲突
};
