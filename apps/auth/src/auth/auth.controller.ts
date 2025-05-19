import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /**
   * 회원가입 API
   * @route POST /auth/signup
   * @param signupDto - 사용자명과 비밀번호를 포함한 회원가입 정보
   * @returns 생성된 사용자 정보 및 성공 메시지
   *
   * 회원 가입 성공 시 비밀번호를 제외한 사용자 정보를 반환함
   */
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.userService.create(
      signupDto.username,
      signupDto.password,
    );
    return {
      message: '회원가입에 성공했습니다.',
      user: {
        username: user.username,
        role: user.role,
      },
    };
  }

  /**
   * 로그인 API
   * @route POST /auth/login
   * @param loginDto - 사용자명과 비밀번호를 포함한 로그인 정보
   * @returns JWT access token
   *
   * 사용자 인증 성공 시 JWT 토큰을 발급해서 반환함
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    return this.authService.login(user);
  }
}
