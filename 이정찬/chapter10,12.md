## 가드
> 가드는 요청이 컨트롤러에 도달하기 전에 허용 여부를 결정하는 로직이다.

실행 위치는 컨트롤러/라우터 접근 전이다.

 NestJS에서는 가드가 인가(authorization)를 구현하는 유일하고 가장 적절한 공식 방법이라고 소개한다. 미들웨어는 실행 콘텍스트에 접근하지 못하기 때문에 인가 기능을 구현할 수 없다.

---

### 가드를 사용한 인가 기능 구현

가드는 @Injectable() + CanActivate 인터페이스로 구현된다.

 ```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request) {
    return false;
  }
}
 ```

요청과 응답에 대한 정보를 가지고 있는 ExecutionContext를 통해서 필요한 정보를 가져올 수 있다. 최종적으로 vailidateRequest 함수를 통해 인가를 진행한다.

---

### 가드 적용
@UseGuards(AuthGuard) 데커레이터를 사용해서 가드를 적용한다.
```ts
@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @UseGuards(AuthGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

---

### 전역 가드 적용
NestJS 애플리케이션 전체의 요청에 대해 자동으로 가드를 적용하는 방식으로 모든 컨트롤러/라우트에 @UseGuards()를 일일이 안 붙여도 되고,
공통적으로(모든 API) 로그인 인증이 필요한 경우에 사용한다.

1. main.ts의 부트스트랩에 적용
```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new AuthGuard());
  await app.listen(3000);
}
bootstrap();
```
2. APP_GUARD 프로바이더 사용
```ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
```
---

### 가드를 사용한 jwt 토큰 인가 처리
다음과 같은 유저 정보 조회 기능에서는 JWT 토큰의 유효성을 검사하는 로직을 모든 엔드포인트에 중복 구현해야한다. 가드를 이용해 핸들러 코드에서 분리할 수 있다.
```ts
@Get(':id')
async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo> {
    const jwtString = headers.authorization.split(' ')[1];

    this.authService.verify(jwtString);

    return this.usersService.getUserInfo(userId);
}
```

#### jwtAuthGuard 구현
```ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.auth.service'; 
;
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = await this.validateRequest(request); // 사용자 검증
    request.user = user; // 검증된 유저를 req.user에 저장

    return true;
  }

  private async validateRequest(request: Request) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization 헤더가 없습니다.');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('잘못된 인증 형식입니다.');
    }

    try {
      // 토큰 검증: 유효하지 않으면 예외 발생
      const user = await this.authService.verify(token); 
      return user;
    } catch (e) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }
  }
}
```

jwtAuthGuard를 적용하면
```ts
@UseGuards(JwtAuthGuard)
@Get(':id')
async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo> {
    return this.usersService.getUserInfo(userId);
}
```

---

## 슬라이딩 세션과 리프레시 토큰
토큰을 사용하면 서버에 상태를 저장하지 않지만 토큰을 탈취당할 시 무효화시키지 못한다는 취약점이 있다.
- 액세스 토큰은 짧게 설정해야 안전함 (예: 15분)	
- 그런데 사용자가 자주 로그인하면 UX가 안 좋음	
- 그래서 “리프레시 토큰(Refresh Token)”을 따로 둔다.  

**리프레시 토큰 (Refresh Token)** 재발급 전용으로 만료 시간이 길고 보안을 위해 DB에 저장된다.  
엑세스 토큰이 만료됐다면 리프레시 토큰을 통해 새로운 엑세스 토큰을 발급한다.


**슬라이딩 세션**은 리프레시 토큰을 사용할 때마다 새로운 리프레시 토큰과 엑세스 토큰을 재발급하는 방식이다. 

---

## 예외처리
NestJS에서는 예외를 그냥 throw하면 자동으로 HTTP 응답으로 변환된다.
```ts
throw new NotFoundException('유저가 없습니다');
```
-> 자동으로 HTTP 404 상태 코드와 메시지를 응답함.

모든 예외는 HttpException를 상속받아 만들어진 클래스이다.

---

## 예외 필터
Nest는 예외를 더 정교하게 다루고 싶을 때 예외 필터를 사용할 수 있다.

에러포맷 통일, 로깅 등에 사용할 듯하다.

예외가 발생했을 때 URL과 발생 기각을 콘솔에 출력하는 필터를 만들어 보았다.
```ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) { }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
    }
    this.logger.log(log);

    res
      .status((exception as HttpException).getStatus())
      .json(response);
  }
}
```

#### 전역 적용
main.ts
```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

#### 컨트롤러 적용
user.controller.ts
```ts
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // @UseFilters(HttpExceptionFilter)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  ...
}
```

커스텀 예외 필터는 쓸까...?

### 실무 사용 예
- 에러 응답 포맷 통일
```json
{
  "success": false,
  "code": "USER_NOT_FOUND",
  "message": "해당 유저가 존재하지 않습니다.",
  "timestamp": "2025-05-22T13:00:00Z"
}
```

- 로깅, 에러 추적, 슬랙 알림 등 확장 포인트로 사용
```ts
catch(exception: any, host: ArgumentsHost) {
  this.logger.error('API 예외 발생', exception.message);
  // 슬랙 등의 알림 전송도 가능하다
}
```