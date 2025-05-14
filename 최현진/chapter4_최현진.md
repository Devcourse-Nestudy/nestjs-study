## Chap4. 프로바이더

### Provider란?

앱이 제공하는 핵심 기능, 즉 비즈니스 로직을 수행

보통 다음과 같은 항목들을 Provider로 사용

- 비즈니스 로직을 담당하는 Service 클래스
- 커스텀 로직 클래스
- 데이터베이스 연결/리포지토리
- 팩토리 함수로 만든 객체

### 기본 구조

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    ...
}
```

- @Injectable 데커레이터를 선언하여 프로바이더로 등록할 수 있도록 함
- 별로의 스코프를 지정하지 않으면 일반적으로 싱글턴 인스턴스가 생성됨

```ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

- providers: @Module() 내부에서 Provider를 등록하는 배열

```ts
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    ...
}
```

- 컨트롤러는 비즈니스 로직을 직접 수행하지 않고, 생성자에서 서비스를 주입받아 사용함으로써 작업을 위임함

### 프로바이더 등록

- 위의 예시처럼 생성자를 통해 직접 주입받아 사용하지 않고 속성 기반 주입을 사용하기도 함

```ts
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SomeService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  getValue() {
    return this.configService.get('SOME_KEY');
  }
}
```
