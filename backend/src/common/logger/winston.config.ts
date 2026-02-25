import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

function maskPspRef(ref: string): string {
  if (ref.length <= 4) return '****';
  return ref.slice(0, -4) + '****';
}

const maskRefFormat = winston.format(
  (info: winston.Logform.TransformableInfo) => {
    const masked = { ...info };
    if (typeof (masked as Record<string, unknown>).pspReference === 'string') {
      (masked as Record<string, unknown>).pspReference = maskPspRef(
        (masked as Record<string, unknown>).pspReference as string,
      );
    }
    return masked;
  },
);

export const winstonConfig: WinstonModuleOptions = {
  level:
    process.env.LOG_LEVEL ??
    (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: winston.format.combine(
    winston.format.timestamp(),
    maskRefFormat(),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(
            ({
              timestamp,
              level,
              message,
              context,
              ...meta
            }: winston.Logform.TransformableInfo) => {
              const metaStr = Object.keys(meta).length
                ? ` ${JSON.stringify(meta)}`
                : '';
              return `${timestamp} [${context ?? 'App'}] ${level}: ${message}${metaStr}`;
            },
          ),
        ),
  ),
  transports: [new winston.transports.Console()],
};
