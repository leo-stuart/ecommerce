import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => {
  // Use DATABASE_URL from Railway Postgres
  const databaseUrl = configService.get<string>('DATABASE_URL');
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Parse DATABASE_URL for Railway Postgres
  const url = new URL(databaseUrl);
  return {
    dialect: 'postgres',
    host: url.hostname,
    port: parseInt(url.port, 10),
    username: url.username,
    password: url.password,
    database: url.pathname.substring(1), // Remove leading slash
    autoLoadModels: true,
    synchronize: configService.get<string>('DB_SYNC') === 'true',
    logging: configService.get<string>('LOG_LEVEL') === 'debug' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true, // Soft deletes
    },
  };
};

