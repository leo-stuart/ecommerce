import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  autoLoadModels: true,
  synchronize: configService.get<string>('NODE_ENV') === 'development',
  logging: configService.get<string>('LOG_LEVEL') === 'debug' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true, // Soft deletes
  },
});

