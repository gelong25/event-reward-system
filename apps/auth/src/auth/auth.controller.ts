import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.userService.create(
      signupDto.username,
      signupDto.password,
    );
    return {
      message: '회원가입 성공',
      user: {
        username: user.username,
        role: user.role,
      },
    };
  }
}
