# Week3

## Controller?
- Controller는 HTTP 요청을 처리하는 역할을 담당.  
- 클라이언트로부터 요청을 받고, 적절한 서비스(provider)를 호출하여, 로직 처리후 결과를 반환 
- `@Controller("path")` 데코레이터로 정의
- 데코레이터 인자로 경로 전달 가능

### Routing

```ts
import { AppService } from './app.service';

@Controller('app') // /app/* 으로 오는 요청 처리
export class AppController {
    constructor(private readonly appService: AppService) {
    } // provider를 주입 받음

    @Get("/hello") // /app/hello로 오는 GET 요청을 처리
    getHello(
        @Query() query: any // query param 인자로 받을 수 있음
    ): string {
        return this.appService.getHello();
    }
    
    @Get("/hello/:name") // /app/hello로 오는 GET 요청을 처리
    getHelloFrom(
        @Param("name") name: string  // path param 인자로 받을 수 있음
    ): string {
        return this.appService.getHelloFrom(name);
    }
  
  @Post("/hello") // 같은 경로에 다른 메서드 지정 가능
  async createHello(
      @Body() body: any // request body를 인자로 받을 수 있음
  ) {}
  
  @Get("/hi")
  getHi(@Query("to") to: string) {} // 이렇게 property name을 지정해서 받는 것도 가능
    
  @HttoCode(204) // 성공시 반환 코드도 지정 가능 default: GET -> 200, POST -> 201  
  @Post("/hi")
  createHi(@Body("from") from: string) {} // body도 마찬가지이다  
}
```

아래와 같이 express의 Request, Response와 혼용 가능.
```ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
    
@Controller('custom')
export class CustomController {
    @Get("/")
    handleRequest(@Req() req: Request, @Res() res: Response) {
        const data = req.body;
        res.cookie("data", data);
        res.status(200).send('커스텀 응답');
    }

    @Get("/a")
    redirectRequest(@Req() req: Request, @Res() res: Response) {
       res.redirect("/a"); // 리디렉션도 쉽게 가능
    }
}
```
단, express 객체를 직접 사용하는 경우에는,`res.send()` 또는 `res.json()`등으로 명시적인 응답 필요 
(nest가 자동으로 응답을 보내주지 않음)
 
## Provider?
- DI 가능한 요소들
- `@Injectable()` 데코레이터를 사용해 의존성 주입 대상임을 명시
- 모듈의 `providers` 배열에 등록
- Controller나 다른 Provider에서 주입받아 사용

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

## Controller vs Provider
- Controller: 비즈니스 로직을 직접 수행하지 않고, 대부분의 처리를 Provider(Service)에 위임 (외부와의 인터페이스 역할)
- Provider: 내부 로직(비즈니스 로직, DB 접근 등)을 처리함

```` mermaid
flowchart TB
User((User)) <--> Controller <--> Provider <--> DB[(Database)]
````

## Custom Provider

### Value Provider

```ts
const CONFIG = {
  apiKey: 'my-api-key',
};

@Module({
  providers: [
    {
      provide: 'CONFIG',
      useValue: CONFIG,
    },
  ],
})
export class AppModule {}
```

### Factory Provider

```ts
@Module({
    providers: [
        {
            provide: A, // 꼭 문자열일 X
            useFactory: () => new A()
        },
    ],
})
export class AppModule {}
```

비동기 함수도 가능, promise 반환시 resolve 후 주입됨

```ts
@Module({
  providers: [
    {
      provide: 'ASYNC_VALUE',
      useFactory: async () => {
        const value = await fetchSomeData();
        return value;
      },
    },
  ],
})
export class AppModule {}
```

### Class Provider

```ts
@Module({
  providers: [
    {
      provide:  ClassA, 
      useClass: ClassA
    },
  ],
})
export class AppModule {}
```

아래와 같이 주입해서 사용

```ts

@Controller("A")
export class AppController {
    constructor(
        @Inject('CONFIG') // provide 필드의 값을 인자로 넣는다.
        private readonly _config: CONFIG,
        @Inject(A)
        private readonly _a: A,
        @Inject(ClassA)
        private readonly _classA: ClassA
    ) {}
}
```


