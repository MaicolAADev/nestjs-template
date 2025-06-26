import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface DatabaseConfig {
    url: string;
    ssl?: boolean;
    synchronize?: boolean;
}

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const databaseUrl = process.env.DATABASE_URL.replace('postgresql://', 'postgres://');
  const url = new URL(databaseUrl);
  
  return {
    type: 'postgres',
    host: url.hostname,
    port: parseInt(url.port),
    username: url.username,
    password: url.password,
    database: url.pathname.replace('/', ''),
    ssl: url.searchParams.get('ssl') === 'true',
    synchronize: process.env.NODE_ENV !== 'production',
    autoLoadEntities: true,
    extra: {
      ssl: url.searchParams.get('ssl') === 'true' ? {
        rejectUnauthorized: false
      } : false
    }
  };
};