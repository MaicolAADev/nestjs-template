import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@modules/auth/constants/jwt.constant';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { MailModule } from '@modules/mail/mail.module';
import { FileModule } from '@modules/file/file.module';

import { AppController } from '@modules/admin/app.controller';
import { getDatabaseConfig } from './config/configuration';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: jwtConstants.expiresIn,
      },
    }),
    AuthModule,
    UsersModule,
    MailModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
