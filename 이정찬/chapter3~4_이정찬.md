## 컨트롤러
> NestJS에서 컨트롤러는 HTTP 요청을 처리하는 진입점이며, 각 라우트에 맞는 메서드를 정의한다.
엔드포인트 메커니즘을 통해 각 컨트롤러가 받을 수 있는 요청을 분류한다.

### 라우팅
```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
```
- AppController 클래스를 @Controller() 데커레이터에 의헤 컨트롤러의 역할을 하게 되었다. 
- @Controller()와 @Get() 데커레이터는 인수를 가질 수 있으며 디폴트 값은 '/' (루트 경로)이다.
- 위 코드처럼 @Controller에 'app', @Get에 '/hello'인수를 전달하면 getHello()가 호출되는 경로는 "localhost/app/hello' 이다.

### 요청 객체
NestJS는 내부적으로 Express를 기반으로 작동하기 때문에 @Req() 데코레이터를 사용하면 Express의 Request 객체에 직접 접근할 수 있다.
Request 객체를 통해 body, url 등 여러 정보를 얻을 수 있음.
```ts
  @Get()
  getHello(@Req() req: Request): string {
    console.log(req);
    return this.appService.getHello();
  }
```
NestJs는 데코레이터를 기반으로 @Req를 다루는 경우는 드물고 데코레이터를 통해 정보를 추출하는 것을 권장한다.
```bash
| 데코레이터               | 추출 정보        | 예시                            |
|--------------------------|------------------|--------------------------------|
| `@Param('id')`           | URL 파라미터     | `/user/1` → `'1'`              |
| `@Query('q')`            | 쿼리 스트링      | `/search?q=apple` → `'apple'`  |
| `@Body()`                | 요청 바디        | `{ name: 'Kim' }`              |
| `@Headers('user-agent')` | 특정 헤더        | `'Mozilla/5.0'`                |
```

### 라우트 매개변수
라우트 매개변수는 경로를 구성하는 매개변수로 인수에 @Param 테코레이터로 주입받을 수 있다.

라우트 매개변수를 전달받는 방법은 2가지가 있다.
첫 번째 방법은 객체로 한 번에 받는 방법이다.
```ts
  @Delete(':userId/memo/:memoId')
  deleteUserMemo(@Param() params: { [key: string]: string }) {
    return `userId: ${params.userId}, memoId: ${params.memoId}`;
  }
```
params 객체에 userId와 memoId를 한번에 받을 수 있다.
이 방법은 객체 params의 타입이 any가 되어 타입이 명확하지 않게 되고 명시적인 테코레이터 사용을 권장하는 Nest의 의도와 달라 추천하지 않는다.

두 번째 방법은 라우팅 매개변수를 따로 받는 방법이다.
```ts
  @Delete(':userId/memo/:memoId')
  deleteUserMemo(
    @Param('userId') userId: string,
    @Param('memoId') memoId: string,
  ) {
    return `userId: ${userId}, memoId: ${memoId}`;
  }
```
매개변수의 의도가 명시적이고 타입 추론과 문서화에 유리하다.

#### 객체로 받을 수 있는 방법
그래도 객체로 받는 것이 편하다면 다음과 같이 DTO를 활용해서 코드를 구성할 수 있다.
```ts
class DeleteMemoParams {
  userId: string;
  memoId: string;
}

@Delete(':userId/memo/:memoId')
deleteUserMemo(@Param() params: DeleteMemoParams) {
  return params;
}
```
객체를 사용하면서 타입 안정성을 유지할 수 있다.

### 페이로드
POST,PUT,PATCH는 요청에 body(본문)를 포함해서 데이터를 전송한다. 이 데이터 덩어리를 **페이로드**라고 한다.
Nest는 DTO를 통해 body를 쉽게 다룰 수 있다.  
#### DTO란?
> 외부에서 들어오는 데이터의 구조를 정의하고, 이를 검증하거나 변환하기 위한 객체
주로 @Body(), @Query(), @Param() 등에 들어오는 요청 데이터를 다룰 때 사용한다. ( 유효성 검사도 가능함 )
DTO는 다음과 같이 class의 형태로 데이터를 정의한다.
```ts
class CreateUserDto {
  name: string;
  age: number;
}

@Post()
createUser(@Body() dto: CreateUserDto) {
  const { name, age } = dto;
  return `이름 ${name} 나이 ${age}`;
}
```
위 코드와 같이 Body를 dto 객체에 받아 처리할 수 있다.

## 프로바이더
> 앱이 제공하고자 하는 핵심 기능인 비즈니스 로직을 수행하는 역할을 한다.

프로바이더는 서비스, 저장소, 팩토리, 헬퍼 등 여러가지 형태로 구현이 가능하다. Nest에서는 프로바이더와 의존성 주입을 활용해서 어플리케이션을 구성한다. 
Nest에서 컨트롤러는 요청을 받아서 직접 처리하지 않는다. 컨트롤러 생성자에서 프로바이더를 주입받아, 비즈니스 로직을 수행하도록 메서드를 정의한다.

프로바이더는 모듈에서 등록한 후 사용할 수 있다.
```ts
@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService], // 프로바이더 등록
})
```

##### app.controllers.ts
프로바이더의 **생성자 주입** 방식
```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {} // 프로바이더 주입

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello(); // appService에 작업을 위임
  }
}
```

##### app.service.ts
@Injectable 테코레이커를 선언함으로써 다른 컴포넌트에 주입 가능한 프로바이더가 된다. ( 싱글턴 인스턴스 생성 )
```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

##### base-service.ts
다음과 같이 상속 관계에서는 속성 기반 주입 방식을 사용할 수 있다.
메서드 테스트 외에는 거의 사용하지 않는다.
```ts
import { Inject, Injectable } from '@nestjs/common';
import { ServiceA } from './service-A';

export class BaseService {

  @Inject(ServiceA)
  private readonly serviceA: ServiceA;

  getHello(): string {
    return 'Hello World BASE!';
  }

  doSomeFuncFromA(): string {
    return this.serviceA.getHello();
  }
}
```

#### 커스텀 프로바이더
Nest는 기본적으로 @Injectable()를 선언하고 해당 클래스를 모듈에 넣어주면 자동으로 의존성을 주입해준다.  
**다른 클래스를 주입**하고 싶거나 **특정 값을 주입**하고 싶거나 (ex. 상수, 객체, 함수 등) **상황에 따라 다른 클래스를 주입**해야 할 때 **커스텀 프로바이더**를 사용할 수 있다.  
#### useValue : 특정 값 주입 하기
```ts
const config = {
  apiKey: 'abc123',
};

@Module({
  providers: [
    { provide: 'CONFIG', useValue: config },
  ],
})
```
위처럼 프로바이더를 선언하면
```ts
constructor(@Inject('CONFIG') private config: any) {
  console.log(config.apiKey); // 'abc123'
}
```
이런 식으로 특정 값으로써 사용할 수 있다.
#### useClass : 다른 클래스 넣기
테스트 할 때나 목적에 따라 구현체를 선택해야 할 때 사용할 수 있다.
```ts
class MyLogger { // 클래스 선언
  log(msg: string) {
    console.log('LOG:', msg);
  }
}

class MyLogger2 { // 클래스2 선언
  log(msg: string) {
    console.log('LOG:', msg);
  }
}

@Module({
  providers: [
    { provide: 'LoggerService', useClass: MyLogger }, // useClass에서 어떤 클래스를 쓸지 선택 가능 
  ],
})
```
#### useFactory : 동적 값 주입하기
```ts
const dbFactory = {
  provide: 'DB_CONNECTION',
  useFactory: () => {
    const isProd = process.env.NODE_ENV === 'production';
    return isProd ? 'prod-db-url' : 'dev-db-url';
  },
};

@Module({
  providers: [dbFactory],
})
```

## 스코프
NestJS에서 스코프는 프로바이더나 컨트롤러가 언제, 얼마나 자주 인스턴스화되는지를 제어할 수 있다. 즉, Nest가 객체를 언제 새로 만들지, 얼마나 오래 유지할지를 결정하는 설정이라고 할 수 있음.
(생명주기 제한)

### 스코프 종류
DEFAULT : 싱글턴 인스턴스가 전체 애플리케이션에서 공유된다. 즉, 앱 시작 시 한 번 생성된다. 따로 선언하지 않으면 DEFAULT가 적용됨
REQUEST : 들어오는 요청마다 새로 생성한다. 
TRANSIENT : 이 스코프를 지정한 인스턴스는 공유되지 않는다. 프로바이더가 주입될 때마다 새로 생성됨.
가능하면 DEFAULT 스코프를 사용하는 것을 권장 ( 싱글톤 방식의 메모리와 동작 성능 )

Nest의 기본 철학은 싱글톤 기반 구조이다. 특별한 이유가 없다면 스코프를 굳이 지정할 필요는 없음  
하지만 요청별로 데이터를 다르게 처리해야 할 때는 REQUEST 스코프가 유용하다.

스코프는 종속성에 따라서 변경된다. A가 B에 의존하고 있다면 A는 B의 스코프를 따라가게 된다.
