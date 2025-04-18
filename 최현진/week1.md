## Week-1

NestJS 기본 개념 및 CLI 실습 내용 정리

## 1. 기본 개념

### 1-1. 🌱 NestJS란?

- **Node.js 위에서 동작하는 백엔드 프레임워크**
- Angular에서 영향을 받아 **모듈 기반**, **의존성 주입(DI)**, **데코레이터 기반 구조**를 제공

---

## 2. 실습 진행

### 2-1. CLI를 이용한 모듈, 컨트롤러, 서비스 생성

Nest CLI를 통해 프로젝트의 구성요소를 빠르게 생성할 수 있다. (`--no-spec` 옵션 사용 시, 테스트용 `.spec.ts` 파일 생성 생략)

```bash
nest g module boards
nest g controller boards --no-spec
nest g service boards --no-spec
```

---

### 🧭 Controller 생성 흐름

1. CLI는 먼저 src/boards 폴더를 찾는다.

2. 해당 폴더 안에 컨트롤러 파일(boards.controller.ts)을 생성한다.

3. 자동으로 boards.module.ts 안에 컨트롤러를 controllers 배열에 등록해준다.

```ts
@Module({
  controllers: [BoardsController],
})
export class BoardsModule {}
```

### 2-2. 💡 Provider란?

- Nest의 기본 개념 중 하나

- 대부분의 Nest 클래스는 프로바이더로 간주됨 (예: 서비스, 리포지토리, 헬퍼 등)

- 의존성 주입(DI) 가능한 클래스나 객체

- Nest 런타임이 객체 간의 의존성을 자동으로 연결해주는 방식

```ts
@Injectable()
export class SomeService {}
```

### 2-3. 💡 Service란?

- 비즈니스 로직을 처리하는 곳

- @Injectable() 데코레이터로 선언하고 모듈에 등록하여 의존성 주입이 가능

- Controller에서는 사용자의 요청을 받아 해당 요청에 맞는 처리를 Service에 위임함

```ts
@Injectable()
export class BoardsService {
  private boards = [];

  getAllBoards() {
    return this.boards;
  }
}
```

Controller에서 사용:

```ts
@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  getAllBoards() {
    return this.boardsService.getAllBoards();
  }
}
```
