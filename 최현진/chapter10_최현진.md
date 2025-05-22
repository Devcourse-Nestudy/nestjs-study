### Guard

`Guard`는 요청이 라우트 핸들러에 도달하기 전에 **사용자가 해당 요청을 할 수 있는 권한이 있는지**를 판단하는 역할을 한다.

즉, NestJS의 `가드`는 인증(Authentication), 권한(Authorization)과 같은 **접근 제어 로직**을 구현할 때 사용된다.

### 사용 예시

- 로그인 여부 확인 (JWT 유효성 검증)
- 특정 역할(role)을 가진 사용자만 접근 허용
- API 키 인증
- 커스텀 인증 흐름 구현 등

### 기본 구조

```ts
// auth/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    return this.authService.validateToken(token); // 유효하면 true 반환
  }
}
```

### 적용 방법

1.  전역 적용

```ts
// main.ts
app.useGlobalGuards(new JwtAuthGuard(authService));
```

2.  컨트롤러 레벨 적용

```ts
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile() {
  return '유효한 사용자입니다.';
}
```

📎 참고 문서
https://docs.nestjs.com/guards
