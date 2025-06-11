import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface DatabaseConfig {
    url: string;
    ssl?: boolean;
    synchronize?: boolean;
}

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
    const url = new URL(process.env.DATABASE_URL);
    const type = url.protocol.replace(':', '') as any;
    const sslParam = url.searchParams.get('ssl');

    return {
        type,
        url: process.env.DATABASE_URL,
        synchronize: process.env.NODE_ENV !== 'production',
        autoLoadEntities: true,
        ssl: sslParam === 'true',
        extra: {
            ssl: sslParam === 'true' ? {
                rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED !== 'false'
            } : false
        }
    };
};