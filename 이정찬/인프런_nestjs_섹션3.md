
## NestJS란?
- Nest(NestJS)는 효율적이고 확장 가능한 Node.js 서버 사이드 애플리케이션을 구축하기 위한 프레임워크
- 프로그레시브 JavaScript를 사용하며, TypeScript로 개발되었고 TypeScript를 지원한다.
- JavaScript로 코딩 가능
- OOP(객체 지향 프로그래밍), FP(함수형 프로그래밍), FRP(함수형 반응형 프로그래밍)
- Nest는 기본적으로 Express(기본)와 Fastify를 사용한다.


### NestJS의 철학
Node(및 서버 측 JavaScript)에 대한 훌륭한 라이브러리, 헬퍼 등 많이 있지만, 그 중 어느 것도 아키텍처 의 주요 문제를 효과적으로 해결하지 못했음.

NestJS는 개발자와 팀이 **쉬운 테스트, 유연한 확장성, 낮은 결합도, 유지보수가 쉬운** 애플리케이션을 만들 수 있는 아키텍처를 제공한다.

<br>

## NestJS 시작하기

#### 설치
```bash
$ npm i -g @nestjs/cli
```

#### 새 프로젝트 생성
```bash
$ nest new project-name
```

#### 디렉터리 구조
```bash
nestjs-board-app/
├── node_modules/                 # 설치된 외부 패키지
├── src/                          # 핵심 소스코드 폴더 
│ └──app.controller.ts            # 요청을 처리하는 컨트롤러 
│ └── app.controller.spec.ts      # 컨트롤러 단위 테스트 
│ └── app.module.ts               # 루트 모듈 
│ └── app.service.ts              # 비즈니스 로직을 처리하는 서비스
│ └── main.ts                     # 애플리케이션 진입점
├── test/                         # E2E 테스트 폴더 
│ └── app.e2e-spec.ts             # E2E 테스트 스펙
│ └── jest-e2e.json               # E2E 테스트 설정 파일
├── .gitignore                    # Git에 포함시키지 않을 파일 목록
├── .prettierrc                   # 코드 스타일 포맷 설정
├── eslint.config.mjs             # ESLint 설정
├── nest-cli.json                 # Nest CLI 설정
├── package.json                  # 프로젝트 메타 정보 및 스크립트
├── package-lock.json             # 의존성 잠금 파일
├── README.md                     # 프로젝트 소개 문서
├── tsconfig.json                 # TypeScript 컴파일 설정
└── tsconfig.build.json           # 빌드 전용 TypeScript 설정
```

#### JS 기본 구조

`eslintrc.js` : 코드를 깔끔하게 작성할 수 있게 도와주는 라이브러리 타입스크립트 가이드라인 제시, 문법 오류 캐치<br>
`prettierrc` : 코드 형식 지정 파일 (코드 포맷터) "" or '' , indent 값 2 or 4 등등 지정<br>
`nest-cli.json` : nest 프로젝트 전용 설정 json 파일<br>
`tsconfig.json` : 타입스크립트 컴파일 방식 지정<br>
`tsconfig.build.json` : tsconfig.json의 연장파일, 빌드할 때 필요한 설정 지정
    
<br>

### 기본 구조를 통한 NestJS 로직 흐름 살펴보기

<br>

**Hello World 텍스트를 출력하는 예제 흐름**

<br>

1. 브라우저에서 요청
```bash
localhost:3000/get
```
2. Controller에서 appService의 getHello호출
```typescript
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```
3. appService에서 'hello world' 리턴
```typescript
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```
4. Controller가 "hello world"를 리턴하게 되면서 브라우저에 응답

<br>

### NestJS 모듈이란?
<br>

@Module 데코레이터 주석이 달린 클래스이다.<br>
@Module 데코레이터를 통해 Nest가 애플리케이션 구조를 구성하는데 사용하는 메타데이터를 제공받는다.  
**모듈은 무조건 하나 이상은 존재해야한다.**

![image](https://github.com/user-attachments/assets/cfa862da-2453-4fc5-875c-3bda94ee4a12)

**모듈은 밀접하게 관련된 기능 집합**으로 같은 기능에 해당하는 것들을 하나의 모듈에서 사용한다.  
ex ) UserModule의 경우 UserController, UserService, UserEntity로 구성될 수 있다.

모듈은 기본적으로 **싱글 톤**이므로 여러 모듈간 공급자의 동일한 인스턴스를 공유 할 수 있다.  
모든 모듈은 자동으로 공유 모듈이 됨 == 모든 모듈에서 재사용 할 수 있다.
<br>
<br>
### NestJS 컨트롤러란?

컨트롤러는 **요청을 처리**하고 클라이언트에 **응답을 반환**한다.
![image](https://github.com/user-attachments/assets/049af8a5-89f8-4667-8efe-a5da1ee0c21e)  

라우팅을 통해 각 요청을 처리할 컨트롤러를 결정한다.

<br>

클래스를 정의할 때는 @Controller 데코레이터를 사용한다.
데코레이터는 **"경로"를 인자로 받는다.**
```typescript
@Controller('/boards') // /boards에 대한 컨트롤러
export class BoardsController {}
```
<br>

### Handler란?
@Get, @Post, @Delete 등과 같은 데코레이터로 장식된 클래스 내 메서드이다.
컨트롤러와 동일하게 **"경로"를 인자로 받는다.**
```typescript
@Controller('/boards')
export class BoardsController {
  @Get()
  getBoards(): string {
      return 'boards';
  } 
}
```
<br>

### NestJS Provider,Service란?
#### Provider
NestJS의 핵심개념으로 객체의 종속성 주입을 통해 서로 다양한 관계를 만들 수 있다.
객체의 인스턴스를 연결하는 기능은 대부분 Nest 런타임 시스템에서 작동한다.

#### Service
컨트롤러가 수행하는 기능 단위, 예를들어 데이터의 저장, 검색, 처리 등 서비스로 나누어 사용될 수 있다.
@Injectable 데코레이터로 감싸게 되면 전역 서비스 인스턴스로 사용될 수 있다.

<br>

![image](https://github.com/user-attachments/assets/82114230-d03f-4a0f-a39e-cfa88589ac71)

다음과 같이 컨트롤러에 Service에 대한 종속성을 주입할 수 있다.
```typescript
Constructor(private boardService: BoardsService) {}
```
<br>

Provider를 사용하기 위해서는 모듈에 등록해주어야한다.
```typescript
@Module({
  controllers: [BoardsController],
  providers: [BoardsService],
})
```


