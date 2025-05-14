<!-- chapter 5 -->

# 모듈 설계

> 모듈: 여러 컴포넌트를 조합하여 좀 더 큰 작업을 수행할 수 있게 하는 단위

- nest 어플리케이션 실행을 위해서는 하나의 루트 모듈이 존재하고, 이 루트 모듈은 다른 모듈들로 구성된다.
  -> **책임을 나누고 응집도를 높이기 위함**
- 모듈이 커진다면 마이크로 서비스로 분리할 수도 있음!

```
마이크로 서비스 아키텍처
하나의 큰 애플리케이션을 여러 개의 작은 서비스로 분리하는 개발 방식

각 서비스는 독립적으로 배포, 확장 운영 가능하며 서비스 간 통신은 HTTP/REST 또는 메시지 큐 등을 통해 이루어진다.
```

- 모듈은 `@Module` 데커레이터 사용. 인수는 `ModuleMetadata`

> CommonModule: 서비스 전반에 쓰이는 공통 기능을 모아놓은 모듈

> CoreModule: 공통 기능이긴 하나 앱을 구동시키는 데 필요한 기능(로깅, 인터셉터) 등을 모아놓은 모듈

## 모듈 다시 내보내기

```
AppModule
   │
   │ imports
   ▼
CoreModule
   │
   │ imports & exports
   ▼
CommonModule
```

```javascript
@Module({
    imports: [CommonModule],
    exports: [CommonModule],
})

exports class CoreModule {}
```

- 다시 내보내기를 사용하여, `AppModule`에서는 `CoreModule`만 import 하여도 `CoreModule`, `CommonModule` 둘 다 사용 가능

## 전역 모듈

- `@Global` 데커레이터 사용
- 전역 모듈은 루트 모듈이나 코어 모듈에서 한 번만 등록해야 한다.

<br>

---

<!--chapter 6-->

# 동적 모듈을 활용한 환경 변수 구성

> 동적 모듈: 모듈이 생성될 때 동적으로 어떠한 변수들이 정해진다. -> 호스트 모듈을 가져다 쓰는 소비 모듈에서 호스트 모듈을 생성할 때 동적으로 값 설정!

- Config: 실행 환경에 따라 서버에 설정되는 환경 변수를 관리하는 모듈
- dotenv: 각 환경 변수를 `.env` 확장자를 가진 파일에 저장해두고 서버가 구동될 때 이 파일을 읽어 해당 값을 환경 변수로 설정해주는 역할
- Node.js는 `NODE_ENV` 환경 변수를 사용하여 서버 환경 구분

  ```
  set NODE_ENV=development

  또는

  "scripts" : {
      "start:dev": "npm run prebuild && NODE_ENV=development nest start --watch",
  }
  ```

## Config 패키지

Nest는 dotenv를 내부적으로 활용하는 `@nestjs/config` 패키지 제공

```javascript
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}
```

- `ConfigModule.forRoot()`: 동적 모듈을 리턴하는 정적 메서드
- forRoot가 아닌 어떤 이름을 써도 되지만, **관례상** `forRoot`나 `register` 사용
- 비동기 함수일 때는 `forRootAsync`, `registerAsync`로 함
- 인수로는 `ConfigModuleOptons`를 받음 -> `ConfigModule`은 소비 모듈이 원하는 옵션값을 전달하여 원하는대로 동적 ConfigModule 생성!

```javascript
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === "production"
          ? ".production.env"
          : process.env.NODE_ENV === "stage"
          ? ".stage.env"
          : ".development.env",
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
```

- `ConfigService`를 원하는 컴포넌트에서 주입하여 사용

## nestjs/config registerAs 함수 선언

**인자**

- token: 문자열 타입의 토큰
- configFactory: ConfigFactory 타입을 상속하는 함수

**반환 타입**

- TConfig & ConfigFactoryKeyHost<ReturnType<TConfig>>
- TConfig: 원래의 설정 팩토리 함수
- ConfigFactoryKeyHost: KEY와 asProvider 메서드를 가진 인터페이스

<br>

---

<!--chapter7 파이프와 유효성 검사-->

# 파이프

> 요청이 라우터 핸들러로 전달되기 전에 요청 객체를 변환할 수 있는 기회 제공

- 미들웨어와 비슷한 기능을 함

파이프, 미들웨어, 라우트 핸들러

| 구분              | 파이프                                                                                                               | 미들웨어                                                                                                                                                                                       | 라우트 핸들러                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **실행 시점**     | 라우트 핸들러 실행 직전                                                                                              | 라우트 매칭 후, 가드 실행 전                                                                                                                                                                   | 요청 처리의 마지막 단계                                                                                   |
| **실행 컨텍스트** | - 라우트 핸들러의 특정 인자에만 적용<br>- `ExecutionContext`를 통해 컨텍스트 접근<br>- 매개변수 메타데이터 접근 가능 | - 실행 컨텍스트 정보 접근 불가<br>- 요청/응답 객체에만 접근 가능<br>- 현재 처리 중인 핸들러 정보 없음                                                                                          | - 완전한 실행 컨텍스트 접근<br>- `ExecutionContext`를 통해 모든 정보 접근<br>- 요청 처리의 모든 단계 제어 |
| **주요 기능**     | - 입력 데이터 변환<br>- 유효성 검사<br>- 타입 변환<br>- 예외 발생 가능                                               | - 요청/응답 객체 수정<br>- 요청 흐름 제어 (next 호출)<br>- 공통 로직 처리<br>- 응답 종료 가능                                                                                                  | - 비즈니스 로직 처리<br>- 최종 응답 생성<br>- 서비스 로직 호출<br>- 예외 처리                             |
| **사용 범위**     | - 전역<br>- 컨트롤러 클래스<br>- 메서드<br>- 특정 매개변수                                                           | - 전역<br>- 특정 경로<br>- 특정 컨트롤러<br>- 라우트 그룹                                                                                                                                      | - 특정 경로에 바인딩<br>- HTTP 메서드와 연결                                                              |
| **데코레이터**    | `@UsePipes()`<br>`@Param(pipe)`<br>`@Body(pipe)`                                                                     | `app.use()`<br>`@UseMiddlewares()`                                                                                                                                                             | `@Get()`, `@Post()` 등                                                                                    |
| **인터페이스**    | `PipeTransform`                                                                                                      | `NestMiddleware`                                                                                                                                                                               | `@Controller()`                                                                                           |
| **예시**          | `typescript<br>@Post()<br>@UsePipes(ValidationPipe)<br>createUser(@Body() dto: CreateUserDto)`                       | `typescript<br>export class LoggerMiddleware implements NestMiddleware {<br>  use(req: Request, res: Response, next: Function) {<br>    console.log('Request...');<br>    next();<br>  }<br>}` | `typescript<br>@Get()<br>getUsers() {<br>  return this.userService.findAll();<br>}`                       |
| **장점**          | - 특정 매개변수 처리 가능<br>- 데이터 검증 간편<br>- 재사용성 높음                                                   | - 모든 요청에 공통 로직 적용<br>- 요청 흐름 제어 가능<br>- 응답 가로채기 가능                                                                                                                  | - 비즈니스 로직 구현 집중<br>- 명확한 책임 분리<br>- 라우팅 명확                                          |
| **단점**          | - 매개변수 단위 처리만 가능<br>- 복잡한 로직 구현 어려움                                                             | - 실행 컨텍스트 접근 불가<br>- 핸들러 정보 알 수 없음<br>- 컨트롤러 별 적용 어려움                                                                                                             | - 중복 코드 발생 가능<br>- 책임 분리 철저히 필요                                                          |

## 파이프 사용 목적

1. 변환: 입력 데이터를 원하는 형식으로 변환
2. 유효성 검사

```
@nest/common 패키지 내장 파이프

- ValidationPipe

전달된 인수 타입 검사
- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe

- DefaultValuePipe
```

## parse

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id:number){
  return this.userService.findOne(id);
}
```

- 현재 실행 콘텍스트에 id 바인딩

```typescript
@Get(':id')
findOne(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE}))id: number){
  return this.userService.findOne(id);
}
```

- 파이프 객체를 직접 생성하여 전달 가능
- 생성할 파이프 객체의 동작을 원하는대로 바꾸고자 하는 경우 사용

## defaultvaluepipe

> 인수의 값에 기본 값을 설정할 때 사용

## validationpipe

## 유효성 검사 파이프라인

### 라이브러리

class-validator, class-transformer 라이브러리 설치

validation.pipe.ts

```
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  // transform(value: any, metadata: ArgumentMetadata) {
  //   console.log(metadata);
  //   return value;
  // }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

- class-transformer:plainToClass 함수로 순수 자바스크립트 객체를 클래스의 객체로 변환
- 역질렬화 과정에서 본문 객체가 아무런 타입 정보도 가지고 있지 않아 타입을 지정하는 변환 과정을 plainToClass로 수행하는 것

전역 설정은 부트스트랩 과정에서 적용!

`@Transform` 데커레이터

- transformFn을 인수로 받음
- tarnsformFn: 속성의 값과 그 속성을 가지고 있는 객체 등을 인수로 받아 속성을 변형하고, 리터

---

# 인증, 인가

## 인증

> 어떤 개체의 신원을 확인하는 과정

- 사용자가 본인이 맞는지 확인하는 절차
- 보통 로그인 과정을 통해 이루어짐
- NestJS에서는 주로 Passport와 JWT를 사용하여 구현

### Passport

- NodeJS에서 가장 많이 사용되는 인증 라이브러리
- 다양한 전략(Strategy)을 통해 여러 종류의 인증 방식 지원
  - passport-local: 사용자명/비밀번호 기반 인증
  - passport-jwt: JSON Web Token 기반 인증
  - passport-oauth2: OAuth 2.0 기반 인증
  - passport-google-oauth20: Google OAuth 2.0 인증

### JWT (JSON Web Token)

- 당사자 간 정보를 안전하게 JSON 객체로 전송하기 위한 간결하고 자체 포함된 방식
- 헤더, 페이로드, 서명으로 구성
- NestJS에서 JWT 구현:

```typescript
// auth.module.ts
@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  // ...
})
```

## 인가

> 어떤 개체가 어떤 리소스에 접근할 수 있는지 검증

- 인증된 사용자가 특정 리소스에 접근할 권한이 있는지 확인하는 과정
- NestJS에서는 가드(Guards)를 사용하여 인가 구현

### 가드 (Guards)

- 특정 라우트 핸들러가 요청을 처리할지 여부를 결정
- `CanActivate` 인터페이스 구현
- 실행 컨텍스트(ExecutionContext) 정보에 접근 가능

```typescript
// auth.guard.ts
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
```

### 역할 기반 인가 (RBAC)

- 사용자의 역할에 따라 권한 부여
- @Roles() 데코레이터와 RolesGuard 조합으로 구현

```typescript
// roles.decorator.ts
export const Roles = (...roles: string[]) => SetMetadata("roles", roles);

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

### 리소스 기반 인가

- 특정 리소스에 대한 접근 권한 검증
- 예: 사용자가 자신의 게시물만 수정/삭제할 수 있도록 제한

```typescript
@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(private postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const postId = request.params.id;
    const userId = request.user.id;

    const post = await this.postsService.findById(postId);
    return post.authorId === userId;
  }
}
```

## 인증/인가 구현 흐름

1. 사용자 등록 (회원가입)
2. 사용자 로그인 및 JWT 발급
3. JWT를 사용한 인증
4. 권한에 따른 리소스 접근 제어

### 전체 인증 흐름 예제

```typescript
// auth.controller.ts
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get("profile")
  @UseGuards(AuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
```
