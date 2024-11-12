import path from 'path';
import { config } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

export const typeOrmConf: TypeOrmModuleOptions = {
    type: 'postgres',
    autoLoadEntities: true,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    migrations: [path.join(__dirname, '../infrastructure/database/migrations/*{.ts,.js}')],
};

const AppDataSource = new DataSource(typeOrmConf as DataSourceOptions);

export default AppDataSource;
