# 핵심 도메인 로직을 포함하는 프로바이더

## 프로바이더

> 앱이 제공하고자 하는 핵심 기능, 즉 비즈니스 로직을 수행하는 역할을 하는 것

컨트롤러가 담당할 수도 있지만, 소프트웨어 구조 상 분리하는 것이 "단일 책임 원칙"에 부합하다!

```
⭐단일 책임 원칙(Single Responsibility Principle, SRP)
SOLID 원칙 중 하나로,하나의 클래스는 하나의 책임만 가진다는 핵심 개념을 가진다.
```

프로바이더는 서비스, 저장소, 팩터리, 헬퍼 등 여러가지 형태로 구현 가능하다.

```
⭐서비스
비즈니스 로직을 담당하는 프로바이더

⭐저장소(레포지토리)
데이터베이스 작업을 담당하는 프로바이더

⭐팩토리
객체 생성을 담당하는 프로바이더

⭐헬퍼
공통적으로 사용되는 유틸리티 기능을 제공하는 프로바이더
```

**Nest 프로바이더는 의존성 주입이 가능하다**

`@Injectable`을 사용하면 다른 어떤 nest 컴포넌트에도 주입할 수 있는 프로바이더가 된다. 별도의 스코프를 지정하지 않으면 싱클턴 인스턴스가 생성된다.

```
// UserService를 다른 클래스에서 이렇게 가져다 쓸 수 있다는 뜻
class UserController {
  constructor(private userService: UserService) {} // 여기서 주입!
}

// 여러 곳에서 UserService를 사용해도
class UserController { constructor(private userService: UserService) {} }
class AuthController { constructor(private userService: UserService) {} }
class AdminController { constructor(private userService: UserService) {} }

// 모두 같은 하나의 UserService 인스턴스를 공유한다는 뜻
// 즉, new UserService()는 딱 한 번만 실행됨
```

## 프로바이더 등록과 사용

### 속성 기반 주입

프로바이더를 직접 주입받아 사용하지 않고, 상속 관계에 있는 자식 클래스를 주입받아 사용하고 싶은 경우

- 자식 클래스에서 부모 클래스가 제공하는 함수를 호출해야 함
- 부모 클래스에서 필요한 프로바이더를 super()를 통해 전달해줘야 함

`base-service.ts`

```typescript
export class BaseService {
  constructor(private readonly serviceA: ServiceA) {}
  getHello(): string {
    return "Hello World BASE!";
  }

  doSomeFuncFromA(): string {
    return this.serviceA.getHello();
  }
}
```

`service-A.ts`

```typescript
@Injectable()
export class ServiceA {
  getHello(): string {
    return "Hello World A!";
  }
}
```

`service-B.ts`

```typescript
@Injectable()
export class ServiceB extends BaseService {
  getHello(): string {
    return this.doSomeFuncFromA();
  }
}
```

- BaseService가 주입을 받을 수 있는 클래스로 선언되어 있지 않기 때문에 Nest의 IoC 컨테이너는 생성자에 선언된 ServiceA를 주입하지 않는다.
- 이 문제를 해결하기 위해서는 ServiceB에 super를 토해 ServiceA의 인스턴스를 전달해주어야 한다.

```typescript
@Injectable()
export class ServiceB extends BaseService {
  constructor(private readonly _serviceA: ServiceA) {
    super(_serviceA);
  }
  getHello(): string {
    return this.doSomeFuncFromA();
  }
}
```

- 하지만 매번 super로 프로바이더를 전달하는건 귀찮다. -> 속성 기반 프로바이더 사용

```typescript
export class BaseService{
    @Inject(ServiceA) private readonly serviceA: ServiceA;
    ...

    doSomeFuncFromA(): string{
        return this.serviceA.getHello();
    }
}

```

- BaseService 클래스의 serviceA 속성에 `@Inject` 데커레이터를 달아줌다.

## 회원 가입 로직 구현

```
클라이언트 요청 → 컨트롤러 → 서비스 → 데이터 계층
                     ↑         |
                     └─────────┘
                      응답 반환
```

## 프로바이더 심화

- NestJS 프레임워크가 만들어주는 인스턴스 또는 캐시된 인스턴스 대신 인스턴스를 직접 생성하고 싶은 경우
- 여러 클래스가 의존 관계에 있을 때 이미 존재하는 클래스를 재사용하고 싶은 경우
- 테스트를 위해 모의 버전으로 프로바이더를 재정의하려는 경우

-> 커스텀 프로바이더를 사용

### 밸류 프로바이더

단순히 값을 주입하고 싶을 때 사용한다. 문자열, 숫자, 객체 등 어떤 값이든 주입 가능

```
providers: [
    {
      provide: 'API_KEY',  // 토큰(식별자)
      useValue: 'my-secret-api-key'  // 실제 주입할 값
    },
```

### 클래스 프로바이더

특정 토큰으로 클래스를 제공할 때 사용. 주로 인터페이스 주입이나 클래스 교체에 사용

```
const configServiceProvider = {
    provide: ConfigService,
    useClass:
        process.env.Node_ENV === 'development'
        ? DevelopmentConfigService
        : ProductionConfigService,
};

@Module({
    providers: [configServiceProvider],
})

export class AppModule {}
```

### 팩토리 프로바이더

동적으로 프로바이더를 생성하거나, 다른 프로바이더에 의존하는 프로바이더를 만들 때 사용

```
@Module({
  providers: [
    ConfigService,
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (configService: ConfigService) => {
        // configService로부터 설정을 읽어 동적으로 연결 생성
        const dbConfig = configService.getDatabaseConfig();
        return createConnection({
          type: dbConfig.type,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database
        });
      },
      inject: [ConfigService]  // 팩토리 함수에 주입할 의존성
    }
  ]
})
export class DatabaseModule {}
```

- useFactory: 값을 반환하는 함수
- inject: 팩토리 함수에 주입할 의존성 목록

### 프로바이더 내보내기

모듈의 exports 배열에 프로바이더를 포함시켜 다른 모듈에서 해당 프로바이더를 사용
