# Week6

## 1. Guard
요청이 핸들러에 도달하기 전에 실행되어 사용자의 요청을 차단하거나 통과시킬 수 있다. 
주로 **인증 및 권한 검사**에 사용. <br>
(guard는 @Response를 사용해도 작동함)

### 1.1 기본 
```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user?.role === 'admin';
  } // canActivate method는 boolean, Promise<boolean>, Observable<any>  중 하나여야 한다
}
```

### 1.2 JWT 인증 Guard 예제
```ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('JWT 토큰이 없습니다.'); // false를 반환해도 같은 효과이다
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch {
      throw new UnauthorizedException('JWT 토큰이 유효하지 않습니다.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

## 2. Exception Filter
왠만하면 기본 제공되는 필터를 사용하자

### 2.1 기본 구조
```ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof HttpException ? exception.message : 'Internal server error',
    });
  }
}
```

## 3. Interceptor
Interceptor는 요청-응답 흐름을 가로채서 추가적인 로직을 삽입

### 3.1 기본 구조
```ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
      }))
    );
  }
}
```

---

## 4. 적용 방법
- Guard: `@UseGuards()` 데코레이터로 라우터 또는 컨트롤러에 적용
- Exception Filter: `@UseFilters()` 또는 `app.useGlobalFilters()`
- Interceptor: `@UseInterceptors()` 또는 `app.useGlobalInterceptors()`

```ts
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```