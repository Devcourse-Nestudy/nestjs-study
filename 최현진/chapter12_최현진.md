### 예외 처리

NestJS의 `Exception Filter`는 애플리케이션에서 예외(Exception)가 발생했을 때, **어떻게 응답할지를 정의하는 클래스**이이다.

HTTP 상태 코드, 에러 메시지, 로깅 등을 제어할 수 있다.

### 기본 개념

NestJS는 기본적으로 `HttpException`을 처리할 수 있는 내장 필터를 제공하며, **공통 응답 포맷**, **로깅**, **에러 메시지 커스터마이징**을 위해 **커스텀 필터**를 사용하기도 한다.

### 기본 구조

```ts
// common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 적용 방법

1.  전역 등록

```ts
// main.ts
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

app.useGlobalFilters(new HttpExceptionFilter());
```

2.  컨트롤러/핸들러 레벨

```ts
@UseFilters(HttpExceptionFilter)
@Get('test')
testException() {
  throw new HttpException('예외 발생 테스트', 400);
}
```
