## 미들웨어

**미들웨어**란 요청 처리전에 부가 기능을 수행하기 위한 것으로 라우트 핸들러가 클라이언트의 요청을 처리하기 전에 수행되는 컴포넌트를 말한다.

Nest는 Express의 미들웨어와 동일하다. 요청/응답 주기를 끝낼 수 있으며 next()를 통해 제어권을 전달할 수 있다.

미들웨어는 보통 다음과 같은 역할을 수행한다.

- 쿠키 파싱 : 사용하기 쉬운 데이터 구조로 변경하기 위해 쿠키를 파싱하는 역할
- 세션 관리 : 세션 쿠키를 찾고, 쿠키에 대한 상태를 조회해서 요청에 정보를 추가하는 역할. 다른 핸들러가 세션 객체를 이용할 수 있게 해준다.
- 인증/인가 : 사용자의 접근 권한을 확인하는 역할
- 본문 파싱 : 파일 스트림 같은 데이터를 읽고 해석한 다음 매개변수에 넣어주는 역할

미들웨어는 함수로 작성하거나 NestMiddleware 인터페이스를 구현한 클래스로 작성할 수 있다. 커스텀 미들웨어를 만드는 것도 가능

### Logger 미들웨어

들어온 요청에 포함된 정보를 로깅하기 위한 Logger를 미들웨어로 구현해보았다.

```ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Request...");
    next();
  }
}
```

next()자리에 다음 코드를 추가해서 미들웨어의 수행을 중단시킬 수 있다.

```ts
res.send("DONE");
```

당연히 생성한 미들웨어는 모듈에 등록해주어야 한다.

```ts
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { LoggerMiddleware } from "./logger/logger.middleware";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [UsersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes("/users");
  }
}
```

/user 경로를 요청하면 콘솔에 Request...가 출력된다.

미들웨어를 다음과 같이 함수로 구성한다면 전역으로 사용할 수 있다.

```ts
import { Request, Response, NextFunction } from "express";

export function logger3(req: Request, res: Response, next: NextFunction) {
  console.log(`Request3...`);
  next();
}
```

앱 실행의 최상단인 main.ts에서 적용해준다.

```ts
import { logger3 } from "./logger/logger3.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger3);
  await app.listen(3000);
}
bootstrap();
```

loger3 미들웨어가 최상단에 전역으로 등록되었기 때문에 제일 먼저 적용된다.

> 함수로 만든 미들웨어는 DI 컨테이너를 사용할 수 없기 때문에 프로바이더를 주입받아 사용할 수 없다.
