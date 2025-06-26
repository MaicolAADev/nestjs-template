import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseController } from '@modules/common/base/admin.controller';

import { ActiveUser } from '@modules/common/decorators/active-user.decorator';
import { UserActiveInterface } from '@modules/common/interfaces/user-active.interface';
import { AuthService } from '@modules/auth/auth.service';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { RegisterDto } from '@modules/auth/dto/register.dto';
import { ResetPasswordDto } from '@modules/auth/dto/reset-pass.dto';

import { Public } from '@modules/auth/decorators/public.decorator';

import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { messages } from 'src/messages/messages';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      const validationErrors = await validate(
        plainToClass(RegisterDto, registerDto),
      );
      if (validationErrors.length > 0) {
        const error = validationErrors
          .map((error) => Object.values(error.constraints).join(', '))
          .join(', ');
        this.badRequestResponse(res, error);
      }

      const response = await this.authService.register(registerDto);
      return this.createdResponse(res, messages.userCreated, response);
    } catch (error) {
      console.log(error);
      return this.handleError(res, error);
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const validationErrors = await validate(plainToClass(LoginDto, loginDto));
      if (validationErrors.length > 0) {
        throw new BadRequestException(
          validationErrors
            .map((error) => Object.values(error.constraints).join(', '))
            .join(', '),
        );
      }

      const response = await this.authService.login(loginDto);
      return this.successResponse(res, messages.successLogin, response);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Get('profile')
  async profile(@ActiveUser() user: UserActiveInterface, @Res() res: Response) {
    try {
      const response = await this.authService.profile(user);
      return this.successResponse(res, messages.success, response);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string, @Res() res: Response) {
    try {
      const response = await this.authService.sendResetPasswordEmail(email);
      return this.successResponse(res, response.message, null);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    try {
      const response = await this.authService.resetPassword(resetPasswordDto);
      return this.successResponse(res, response.message, null);
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
