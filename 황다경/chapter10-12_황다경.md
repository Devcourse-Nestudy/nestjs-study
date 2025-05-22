<!--chapter 10-->

# Guard: 권한 확인

## 인가

> 인증을 통과한 유저가 요청한 기능을 사용할 권한이 있는지를 판별하는 것

- 퍼미션, 롤, 접근 제어 목록 같은 개념을 사용하여 유저가 가지고 있는 속성으로 리소스 사용알 허용할 지 판별

```
퍼미션: 특정 작업이나 리소스에 대한 구체적인 접근 권한
- 읽기, 쓰기, 삭제, 수정 등 세부적인 권한
- 가장 세분화된 권한 단위

롤: 여러 퍼미션을 묶어 놓은 논리적 그룹
- 관리자, 일반 사용자 등
- 사용자에게 여러 퍼미션을 개별적으로 부여하는 대신 역할을 할당하여 관리 효율성 증가

접근 제어 목록(ACL): 특정 리소스에 대해 어떤 사용자나 그룹이 어떤 작업을 수행할 수 있는지 명시한 목록
- 리소스 중심의 권한 관리 방식
- 각 리소스마다 누가 어떤 권한을 가지고 있는지 정의

```

| 구분            | 퍼미션               | 롤          | 접근 제어 목록(ACL)           |
| --------------- | -------------------- | ----------- | ----------------------------- |
| **범위**        | 단일 권한            | 권한 묶음   | 리소스별 권한 매핑            |
| **관점**        | 사용자 중심          | 사용자 중심 | 리소스 중심                   |
| **관리 복잡성** | 세부적이나 관리 복잡 | 관리 효율적 | 리소스가 많을 때 복잡해짐     |
| **유연성**      | 제한적               | 중간        | 가장 유연하지만 설정이 복잡함 |

> 인가를 인증처럼 미들웨어로 구현하면?

- **실행 콘텍스트 접근 불가**: 미들웨어는 요청과 응답 객체에만 접근할 수 있고, 실행될 핸들러나 라우트에 대한 정보를 알 수 없음
- **메타데이터 접근 불가**: 컨트롤러나 핸들러에 적용된 데코레이터 메타데이터에 접근할 수 없음
- **라우트 기반 제어만 가능**: 특정 경로에 대한 접근만 제어 가능하며, 세부적인 권한 검사가 어려움
- **실행 시점 제한**: 라우트 핸들러 실행 전에만 동작하며 중간에 개입 불가

```
만약 인가를 미들웨어로 구현한다면, 각 라우트마다 다른 권한 요구사항을 처리하기 위해 복잡한 조건문을 작성하거나 여러 미들웨어를 중첩해서 사용해야 하며, 메타데이터 기반 접근이 불가능해 유연성이 크게 떨어짐
```

> 가드는 실행 콘텍스트 인스턴스에 접근할 수 있어 다음에 실행될 작업을 정확히 알고 있음

### 가드

> nestjs에서 제공하는 특수한 클래스로, canActivate 인터페이스를 구현한다. 특정 라우트 핸들러가 실행될 수 있는지 여부를 결정하는 역할을 하며, 주로 인증인가 로직 처리에 사용된다.

### 가드의 특징

- 실행 시점: 모든 미들웨어 이후, 인터셉터나 파이프 이전에 실행됨
- 결정 기능: 현재 요청이 계속 진행딜지, 또는 거부될지 판단
- 실행 콘텍스트 접근: 요청에 대한 모든 정보와 메타데이터 접근 가능

### 가드 구현

`canActivate` 인터페이스를 구현해야 한다.

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate() {}
}
```

- `canActive`는 `ExecutionContext` 인스턴스를 인수로 받는다.
- `ExecutionContext`는 `ArgumentsHost`를 상속받는다(요청, 응답에 대한 정보 포함)
- (HTTP) 인터페이스에서 제공하는 `switchToHttp()` 함수를 사용하여 필요한 정보를 불러올 수 있다.

<details>
<summary>가드 구현 관련 함수 추가 설명</summary>

### `canActive` 인터페이스

- 모든 가드가 반드시 구현해야 하는 인터페이스
- 요청 처리를 계속할지, 말지 결정한다.
- 동기 또는 비동기(`Promise<boolean>` 또는 `Observable<boolean>`) 값 반환 가능

### `ExecutionContext`

- 현재 실행 중인 핸들러에 대한 정보를 담고 있는 객체
- 현재 실행될 핸들러 함수, 컨트롤러 클래스, 라우트 정보 등에 접근 가능
- 제어 흐름(HTTP, WebSocket, gRPC 등)에 따라 적절한 컨텍스트로 전환할 수 있는 메서드 제공
- 메타데이터에 접근할 수 있는 기능 제공

### `ArgumentsHost`

- `ExecutionContext`의 부모 클래스
- 모든 실행 컨텍스트에서 사용 가능한 기본적인 인수 정보 제공
- 호스트 유형에 관계없이 요청/응답 객체에 접근하는 일반적인 방법 제공
- `getArgs()`, `getType()` 등의 기본 메서드 포함

### `switchToHttp()` 메서드

- `ArgumentHost`/`ExecutionContext`에서 제공하는 유틸리티 메서드
- HTTP 특화 컨텍스트로 전환하여 HTTP 요청/응답 객체에 직접 접근 가능
- HTTP 컨텍스트에만 사용되는 `getRequest()`, `getResponse()` 메서드 호출 가능

### 관계/흐름름 정리

```
CanActivate 인터페이스
    ↓
가드 클래스가 구현
    ↓
canActivate(context: ExecutionContext) 메서드
    ↓
ExecutionContext (ArgumentsHost 상속)
    ↓
context.switchToHttp() (컨텍스트 타입 전환)
    ↓
HTTP 컨텍스트에서 getRequest(), getResponse() 사용
```

- @Injectable() 데코레이터로 가드 클래스 정의
- CanActivate 인터페이스 구현
- canActivate(context: ExecutionContext) 메서드 구현
- context.switchToHttp()를 호출하여 HTTP 컨텍스트로 전환
- getRequest()로 요청 객체 획득, 인증/인가 로직 구현
- 권한 여부에 따라 true/false 반환

</details>

### 가드 적용

- 컨트롤러 범위 또는 메서드 범위로 적용하고자 한다면 `@UseGuards(AuthGauard)`
- 여러 종류 가드 사용 시 쉼표로 이어서 작성
- 전역 가드는 `useGlobalGuards` 함수 사용

```typescript
@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppServiece) {}

  @UseGuards(AuthGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

<details>
<summary>왜 가드 데코레이터가 두 번 사용되지?
</summary>

> Nestjs에서 가드를 적용할 수 있는 두 가지 범위(스코프)를 보여주기 위한 예제임...

1. 컨트롤러 레벨 가드

   ```
   @UseGuards(AuthGuard)
   @Controller()
   export class AppController {
   ```

   - 컨트롤러 클래스 전체에 적용
   - 이 컨트롤러의 모든 라우트 핸들러(엔드포인트)에 가드가 적용됨
   - 모든 요청이 기본적으로 인증 검사를 통과해야 함

2. 메서드 레벨 가드
   ```
   @UseGuards(AuthGuard)
   @Get()
   getHello(): string {
   ```
   - 특정 라우터 핸들러(메서드)에만 적용
   - 해당 엔드포인트에 대한 요청만 이 가드를 추가로 통과해야 함

<br>

이렇게 다른 목적의 가드를 조함하여 사용함

```typescript
@UseGuards(AuthGuard) // 기본 인증 검사
@Controller("users")
export class UserController {
  @Get()
  getAllUsers() {
    /* 인증된 모든 사용자 접근 가능 */
  }

  @UseGuards(RolesGuard) // 역할 기반 추가 권한 검사
  @Roles("admin")
  @Delete(":id")
  deleteUser() {
    /* 관리자만 접근 가능 */
  }
}
```

</details>

## 인증

> 요청자가 자신이 누구인지 증명하느 과정

- 매 요청마다 헤더에 jwt 토큰을 실어 보내고, 이 토큰을 통해 요청자가 라우터에 접근 가능한지 확인하는 방식 사용.

| 구분             | 세션 기반 인증                                                                                                                                           | 토큰 기반 인증                                                                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **정의**         | 서버 측에서 사용자의 인증 상태를 유지하기 위해 생성하는 임시 데이터 저장소                                                                               | 사용자 인증 정보와 추가 데이터를 포함하는 암호화된 문자열(JWT 등)                                                                                          |
| **동작 흐름**    | 1. 사용자 로그인<br>2. 서버에서 세션 생성 및 저장<br>3. 세션 ID를 쿠키로 클라이언트에 전송<br>4. 이후 요청 시 쿠키와 함께 요청<br>5. 서버가 세션 ID 검증 | 1. 사용자 로그인<br>2. 서버에서 토큰 생성<br>3. 토큰을 클라이언트에 반환<br>4. 이후 요청 시 헤더에 토큰 포함<br>5. 서버가 토큰 자체 검증                   |
| **저장 공간**    | 서버 측 (메모리, DB, Redis 등)                                                                                                                           | 클라이언트 측 (localStorage, sessionStorage, 쿠키 등)                                                                                                      |
| **단점(취약점)** | • 서버 확장성 문제<br>• CSRF 공격에 취약<br>• 서버 부하 증가<br>• 다중 서버 환경에서 세션 공유 문제<br>• 모바일 앱에서 사용 어려움                       | • XSS 공격에 취약<br>• 네트워크 오버헤드 증가<br>• 토큰 즉시 무효화 어려움<br>• 토큰에 민감 정보 포함 시 보안 위험<br>• 토큰 탈취 시 만료 전까지 악용 가능 |

```
$ npm install express-session @nestjs/passport passport passport-local
```

```typescript
// auth.module.ts
@Module({
  imports: [
    PassportModule.register({ session: true }), // 패스포트에 세션 사용 활성화
  ],
  providers: [
    LocalStrategy, // 유저/패스워드 검증 전략
    SessionSerializer, // 세션에 유저 정보 직렬화/역직렬화 처리
  ],
  controllers: [AuthController],
})
export class AuthModule {}

// auth.controller.ts
@Controller("auth")
export class AuthController {
  @Post("login")
  @UseGuards(LocalAuthGuard) // 로그인 시 로컬 전략 사용
  login(@Request() req) {
    // Passport가 자동으로 req.user 생성하고 req.session에 저장
    return { message: "로그인 성공" };
  }
}

// session.guard.ts
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated(); // Passport 함수로 세션 유효성 확인
  }
}
```

```
$ npm install @nestjs/jwt passport-jwt
```

```typescript
// auth.module.ts
@Module({
  imports: [
    JwtModule.register({
      secret: "your-secret-key", // JWT 서명에 사용될 비밀키
      signOptions: { expiresIn: "1h" }, // 토큰 만료 시간 설정
    }),
  ],
  providers: [
    JwtStrategy, // JWT 검증 전략
    AuthService, // 인증 로직 처리 서비스
  ],
  controllers: [AuthController],
})
export class AuthModule {}

// auth.controller.ts
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Post("login")
  async login(@Body() loginDto) {
    // 사용자 검증
    const user = await this.authService.validateUser(loginDto);

    // JWT 토큰 생성 및 반환
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload), // 토큰 생성
    };
  }
}

// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization 헤더에서 추출
      ignoreExpiration: false, // 만료된 토큰 거부
      secretOrKey: "your-secret-key", // 토큰 검증용 키
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username }; // 요청에 user 객체로 추가됨
  }
}
```

## 슬라이딩 세션과 리프레시 토큰

### 슬라이딩 세션

> 비상태 저장 방식인 토큰의 보안 취약점을 보강하고 사용자 편의성을 유지하기 위해 사용하는 방식

> 로그인 정보를 다시 입력하지 앟고 현재 가지고 있는 토큰을 새로운 토큰으로 발급하는 과정

### 리프레시 토큰

> 만료 시간이 긴 토큰으로, 리프레시 토큰을 사용하여 엑세스 토큰을 재발급

- 보통 db에 저장해두고 요청에 포함된 리프레시 토큰과 비교
- 비상태 저장 방식의 장점 약화->사용성, 보안성 간의 절충안

<!--chapter 12 예외 필터-->

# 예외 필터

> nest는 프레임워크 내에 예외 레이어를 두고 잇다.

- 내장 예외 필터는 인식할 수 없는 에러를 `InternalServerErrorException`으로 변환한다.

## 표준 예외 클래스

| 예외 클래스                   | HTTP 상태 코드 | 의미                                            |
| ----------------------------- | -------------- | ----------------------------------------------- |
| BadRequestException           | 400            | 잘못된 요청 (유효성 검사 실패 등)               |
| UnauthorizedException         | 401            | 인증되지 않음 (로그인 필요 등)                  |
| PaymentRequiredException      | 402            | 결제 필요 (사용은 드묾)                         |
| ForbiddenException            | 403            | 금지됨 (권한 부족)                              |
| NotFoundException             | 404            | 리소스를 찾을 수 없음                           |
| MethodNotAllowedException     | 405            | 허용되지 않은 HTTP 메서드                       |
| NotAcceptableException        | 406            | 허용되지 않는 응답 포맷                         |
| RequestTimeoutException       | 408            | 요청 시간 초과                                  |
| ConflictException             | 409            | 충돌 발생 (중복 리소스 등)                      |
| GoneException                 | 410            | 리소스가 더 이상 사용 불가                      |
| PayloadTooLargeException      | 413            | 페이로드가 너무 큼                              |
| UnsupportedMediaTypeException | 415            | 지원되지 않는 미디어 타입                       |
| UnprocessableEntityException  | 422            | 요청 구문은 맞지만 처리 불가 (유효성 검사 실패) |
| TooManyRequestsException      | 429            | 너무 많은 요청 (rate limiting)                  |
| InternalServerErrorException  | 500            | 서버 내부 오류                                  |
| NotImplementedException       | 501            | 아직 구현되지 않음                              |
| BadGatewayException           | 502            | 게이트웨이 오류                                 |
| ServiceUnavailableException   | 503            | 서비스 불가 상태                                |
| GatewayTimeoutException       | 504            | 게이트웨이 시간 초과                            |

## 예외 필터

- nest에서 제공하는 전역 예외 필터 외에 직접 예외 필터 레이어를 둬, 원하는대로 예외를 다룰 수 잇다.
- 예외가 일어낫을 때 로그를 남기거나 응답 객체를 원하는대로 변경하고자 하는 등의 요구사항을 해결하고자 할 때 사용

### 적용

- `@Catch` 데커레이터는 처리되지 않은 모든 예외를 잡으려고 할 때 사용
- `HttpException`이 아닌 예외는 알 수 없는 예외이므로 `InternalServerErrorException`으로 처리
- `@UseFilter` 데커레이터로 컨트롤러에 직접 적용하거나 전역으로 적용 가능, 예외 필터는 전역 필터를 하나만 기지도록 하는게 일반적이다!!

---

### 미들웨어의 한계가 왜 인가 구현에 문제가 되는가?

`실행 콘텍스트 접근 불가`

> 인가의 핵심 요구사항: 사용자가 "특정 기능"에 접근할 권한이 있는지 확인해야 함

- 문제점: 미들웨어는 "어떤 컨트롤러나 핸들러가 호출될 예정인지" 알 수 없음
- 실제 예시: 같은 /users 경로라도 GET(조회)과 DELETE(삭제) 요청에 필요한 권한이 다른데, 미들웨어는 이를 구분할 방법이 없음

`메타데이터 접근 불가`

> 인가 시스템 설계 방식: 보통 데코레이터로 필요한 권한을 명시함 (예: @Roles('admin'))

- 문제점: 미들웨어는 이런 데코레이터 메타데이터를 읽을 수 없음
- 예시:
  ```typescript
    @Roles('admin')  // 이 메타데이터를 미들웨어는 읽을 수 없음
    @Get('/sensitive-data')
    getAdminData() {}
  ```

`라우트 기반 제어만 가능`

> 세밀한 인가 요구사항: 같은 라우트에서도 다양한 권한 체크가 필요함

- 문제점: 미들웨어는 URL 패턴만으로 권한을 확인해야 함
- 실제 예시: 블로그 시스템에서 /posts/:id 경로에 접근할 때, 자신의 글이면 수정 가능하고 타인의 글이면 읽기만 가능해야 하는 로직을 구현하기 어려움

`실행 시점 제한의 문제`

> 동적 권한 체크: 때로는 요청 처리 중간에 추가 권한 검사가 필요함

- 문제점: 미들웨어는 라우트 핸들러 실행 전에만 작동하고 이후엔 개입 불가
- 실제 예시: 데이터베이스에서 데이터를 조회한 후에야 소유자 확인이 가능한 경우, 미들웨어 단계에서는 이를 확인할 수 없음

**결론: 가드 쓰자
가드는 위 모든 문제를 해결할 수 있다.**

- `ExecutionContext`를 통해 실행될 핸들러 정보에 접근 가능
- `Reflector`를 사용해 메타데이터 접근 가능
- 요청 객체, 핸들러 정보, 메타데이터를 모두 활용한 복잡한 권한 로직 구현 가능
- 라우트 핸들러 실행 전 정확한 시점에 실행되어 최적의 권한 검사 가능

### 문제

**Q1: NestJS에서 인증과 인가를 처리할 때 왜 미들웨어 대신 가드를 사용하는 것이 더 효과적인가요?**

```
A1: 미들웨어는 실행 콘텍스트에 접근할 수 없어 어떤 핸들러가 호출될지 알 수 없기 때문에 같은 경로라도 다른 HTTP 메서드에 다른 권한을 적용하기 어렵습니다. 또한 메타데이터(예: @Roles('admin'))에 접근할 수 없고, URL 패턴만으로 권한을 확인해야 하는 제약이 있습니다. 특히 데이터베이스 조회 후 소유자 확인이 필요한 경우처럼 동적 권한 체크가 불가능합니다. 반면 가드는 ExecutionContext를 통해 핸들러 정보에 접근할 수 있고, Reflector로 메타데이터를 활용할 수 있으며, 라우트 핸들러 실행 직전에 정확한 타이밍에 실행되어 복잡한 권한 로직을 효과적으로 구현할 수 있습니다.
```

**Q2: 세션 기반 인증과 토큰 기반 인증의 주요 차이점과 각각의 장단점은 무엇인가요?**

```
A2: 세션 기반 인증은 서버 측에서 사용자의 인증 상태를 저장하고, 클라이언트에는 세션 ID만 쿠키로 전송합니다. 확장성 문제, CSRF 공격 취약성, 서버 부하 증가, 다중 서버 환경에서의 세션 공유 문제, 모바일 앱 호환성 문제가 단점입니다. 반면 토큰 기반 인증(JWT 등)은 사용자 인증 정보와 추가 데이터를 포함한 암호화된 문자열을 클라이언트에 저장합니다. 서버가 상태를 유지할 필요가 없어 확장성이 좋지만, XSS 공격에 취약하고, 네트워크 오버헤드가 증가하며, 토큰 즉시 무효화가 어렵고, 토큰 탈취 시 만료 전까지 악용될 수 있는 단점이 있습니다.
```

**Q3: NestJS의 가드(Guard)에서 ExecutionContext가 제공하는 기능과 이것이 권한 부여 시스템 구현에 어떤 이점을 주는지 설명해 주세요**

```
A3: ExecutionContext는 현재 실행 중인 핸들러에 대한 모든 정보를 담고 있는 객체로, ArgumentsHost를 상속받습니다. 이를 통해 실행될 핸들러 함수, 컨트롤러 클래스, 라우트 정보 등에 접근할 수 있으며, 다양한 컨텍스트(HTTP, WebSocket 등)로 전환하는 메서드를 제공합니다. 권한 부여 시스템 구현 시 ExecutionContext를 사용하면 단순히 URL만이 아닌 정확히 어떤 핸들러가 실행될지 알 수 있어, 메서드별로 다른 권한 요구사항을 적용할 수 있습니다. 또한 메타데이터에 접근하여 @Roles와 같은 데코레이터를 통해 선언적으로 권한을 정의하고 검사할 수 있으며, 요청 객체를 통해 사용자 정보를 조회하여 복잡한 조건부 권한 체크가 가능합니다.
```

**Q4: 리프레시 토큰의 개념과 왜 액세스 토큰만으로는 충분하지 않은지 설명해 주세요.**

```
A4: 리프레시 토큰은 액세스 토큰보다 만료 시간이 긴 토큰으로, 액세스 토큰이 만료되었을 때 사용자가 다시 로그인하지 않고도 새 액세스 토큰을 발급받을 수 있게 해주는 토큰입니다. 액세스 토큰만 사용할 경우 보안과 사용자 경험 사이에 딜레마가 발생합니다. 만료 시간을 짧게 설정하면 토큰 탈취 시 피해를 줄일 수 있지만 사용자가 자주 재로그인해야 하는 불편함이 생기고, 반대로 길게 설정하면 편의성은 높아지나 보안 위험이 커집니다. 리프레시 토큰은 이러한 문제의 절충안으로, 액세스 토큰은 짧게 유지하면서도 리프레시 토큰으로 사용자 경험을 해치지 않게 합니다. 리프레시 토큰은 주로 데이터베이스에 저장되어 필요시 검증되므로, 토큰 탈취 시에도 서버 측에서 무효화할 수 있어 보안성이 향상됩니다.
```

**Q5: NestJS의 예외 필터가 필요한 이유와 전역 예외 필터를 구현할 때의 장점은 무엇인가요?**

```
A5: NestJS는 기본적으로 내장 예외 필터를 통해 처리되지 않은 예외를 InternalServerErrorException으로 변환합니다. 하지만 특정 예외에 대해 로그를 남기거나, 응답 형식을 일관되게 유지하거나, 비즈니스 로직에 맞는 사용자 정의 예외 처리가 필요한 경우 직접 예외 필터를 구현해야 합니다. 전역 예외 필터를 사용하면 애플리케이션 전체에서 일관된 예외 처리 방식을 적용할 수 있어 코드 중복을 줄이고 유지보수성을 높일 수 있습니다. 또한 모든 예외를 한곳에서 집중적으로 관리함으로써 로깅, 모니터링, 디버깅이 용이해지고, 클라이언트에게 일관된 오류 응답 형식을 제공하여 프론트엔드 개발자가 예측 가능한 방식으로 오류를 처리할 수 있도록 도와줍니다. NestJS에서는 @Catch 데코레이터와 함께 예외 필터를 정의하고, useGlobalFilters 함수를 사용하여 전역으로 적용할 수 있습니다.
```
