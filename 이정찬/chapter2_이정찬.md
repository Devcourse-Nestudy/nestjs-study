##### 챕터 2에서는 웹 개발 기초지식부터 Node.js, Typescript, NestJS의 핵심개념인 데커레이커까지 살펴보았습니다.

## 웹 프레임워크
인터넷은 정적 페이지로 이루어진 문서 저장소였지만 현재에 이르러 다양한 기능을 처리할 수 있게 발전했음. 이 기능들을 쉽게 개발할 수 있게 만든 틀을 **웹 프레임워크**라고 한다.
> 웹 프레임워크는 뼈대, 골조의 의미로 데이터베이스에 연결 설정, 데이터와 세션 관리 등의 동작을 정해진 방법과 추상화된 인터페이스로 제공한다.

=> 웹 프레임워크를 활용해 표준으로 제시하는 방법을 통해서 쉽고 빠르게 안정적인 애플리케이션을 구축할 수있음.

### SSR이란?
SSR(Server Side Rendering)은 HTML을 서버에서 생성해서 클라이언트에 보내주는 방식이다. 즉, 브라우저가 아닌 서버에서 HTML을 완성한 후 전송하는 렌더링 방식
#### SSR 동작
- 서버가 요청을 처리
- HTML과 자바스크립트 응답을 브라우저에 전송
- 브라우저는 전달받은 HTML을 화면에 뿌려줌
- 동적 구성은 같이 전달받은 자바스크립트를 파싱

<br>

이전의 웹 페이지는 모두 **SSR**으로 동작했다. 사용자 경험(UX) 중심의 진화,백엔드와 프론트엔드 분리 구조의 유행과 웹 프레임워크의 발전으로 SPA기반 웹 프레임워크가 대세가 되었다.

### SPA란?
SPA(Single Page Application)은 초기 HTML은 단 하나만 로딩하고, 이후부터는 JavaScript가 동적으로 페이지를 구성하고 전환하는 방식이다.  
대표적인 예로는 SPA의 인기를 주도한 React가 있다. 
#### SPA 동작
- 첫 요청 시, HTML + JS 번들 1회 로딩
- 서버로부터 매 요청에 대해 최소한의 데이터만 응답으로 받음 ( javascript를 통해 필요한 뷰만 전환함 )
- 화면 구성로직을 프론트엔드에서 처리

=> 페이지 전환이 부드럽지만 초기 로딩 속도가 오래걸림

## Node.js
Node.js는 JavaScript를 서버에서도 실행할 수 있게 만든 런타임 환경(runtime environment)이다.  
자바스크립트는 원래 프론트엔드에서만 사용하는 스크립트 언어라는 인식이 강했지만 Node.js의 등장으로 서버를 구동할 수 있게 됐음.
때문에 자바스크립트로 풀스택 개발이 가능해지면서 생산성이 향상되었다.

> NestJS는 Node.js를 기반으로 한 Express와 Fastify를 통해 소스 코드를 자바스크립트로 컴파일한다.

### Node.js 특징

#### 단일 스레드에서 구동되는 논블로킹 I/O 이벤트 기반 비동기 방식
Node.js에서는 싱글 스레드에서 작업을 처리한다.
- 애플리케이션 단에서는 단일 스레드
- 백그라운드에서는 비동기 I/O 라이브러리인 libuv를 통해 스레드 풀을 관리하고 작업을 처리
- 논블로킹 방식으로 작업을 비동기로 처리함

###### => 입력은 싱글 스레드로 받지만 순서대로 처리하지 않고 먼저 처리된 결과를 이벤트로 반환해줌

#### 이벤트 루프
Node.js가 단일 스레드 기반임에도 불구하고 논블로킹 작업을 수행할 수 있도록 해주는 핵심 기능이다.  
시스템 커널에서 가능한 작업이 있으면 그 작업을 커널에 이관하는 방식으로 동작함 ??  
=> 비동기 작업의 콜백들을 적절한 타이밍에 실행시켜주는 반복적인 루프이다.

##### 이벤트 루프의 단계
각 단계는 단계마다 **처리해야 하는 콜백 함수를 담기 위한 큐**를 가지고 있다.  
###### node main.js 명령어 실행 흐름 
1. Node.js는 먼저 이벤트 루프를 생성한 다음 main.js를 실행한다.
2. 이 과정에서 생성된 콜백들은 각 단계의 큐에 들어가게 된다.
3. 큐가 비어있다면 이벤트 루프를 빠져나가 프로세스를 종료한다.

###### 이벤트 루프 실행 흐름 다이어그램
```bash
   [코드 실행 시작]
           │
    ┌──────▼──────┐
    │  Call Stack │  ← 동기 코드 실행
    └──────┬──────┘
           ↓
   ┌────────────────┐
   │ Web APIs(libuv)│ ← 비동기 작업 처리: Timer, fs.readFile 등
   └──────┬─────────┘
          ↓ (작업 완료)
 ┌────────────────────┐
 │ Microtask Queue    │ ← 가장 먼저 처리 (process.nextTick, Promise)
 └──────┬─────────────┘
        ↓
 ┌─────────────────────┐
 │ Event Loop Tick 시작│
 └─────────────────────┘
        ↓
┌────────────────────────┐
│ Phase 1: Timers        │ ← setTimeout, setInterval
└────────────────────────┘
        ↓
┌────────────────────────────┐
│ Phase 2: Pending Callbacks │ ← 시스템에서 지연된 콜백 처리
└────────────────────────────┘
        ↓
┌────────────────────────┐
│ Phase 3: Idle, Prepare │ ← 내부용 유휴 단계
└────────────────────────┘
        ↓
┌─────────────────────────┐
│ Phase 4: Poll (I/O 대기)│ ← I/O 작업 대기 및 처리 (fs, net 등)
└─────────────────────────┘
        ↓
┌────────────────────────┐
│ Phase 5: Check         │ ← setImmediate() 실행
└────────────────────────┘
        ↓
┌─────────────────────────┐
│ Phase 6: Close Callbacks│ ← socket.on('close') 등의 이벤트 종료 함수 실행
└─────────────────────────┘
        ↓
   (다시 Microtasks → Tick 반복)

```

1. Timer 단계: setTimeout이나 setInterval과 같은 함수로 등록된 타이머들을 큐에 넣고, 실행할 시간이 지난 타이머들을 최소 힙에서 꺼내어 순차적으로 실행

2. Pending (i/o) 콜백 단계: 해당 루프의 이전 작업에서 큐에 들어온 콜백들을 실행한다. TCP 핸들러, 파일 I/O 작업, 에러 핸들러 콜백 등이 여기에 포함됨

3. Idle, Prepare 단계: 내부 동작을 위한 단계로, 실질적인 작업은 이루어지지 않는다.

4. Poll 단계: 새로운 I/O 이벤트를 가져와서 관련 콜백을 실행함. Watch_Queue(폴 단계의 큐)에 대기 중인 작업들을 순차적으로 처리하고, 시스템 실행 한도에 도달할 때까지 모든 콜백을 실행한다.

5. Check 단계: setImmediate의 콜백만을 처리하는 단계로, 큐가 비거나 시스템 실행 한도에 도달할 때까지 콜백을 실행한다.

6. Close 콜백 단계: close나 destroy 이벤트 타입의 콜백을 처리한다. 다음 루프에서 처리해야하는 작업이 남아있는지 검사한다. 작업이 남아있다면 루프 재시작, 그렇지 않다면 루프를 종료한다.

#### 좀 더 쉽게 이벤트 루프를 이해해보자

> 이벤트 루프는 결국 시간 오래 걸리는 작업(setTimeout, 파일 읽기 등)은 넘겨두고, 그동안 다른 일들을 처리할 수 있게 해주는 구조이다.
- 지금 할 일(Call Stack)이 있는가?
- 비동기 작업 결과(Callback Queue)에 대기 중인 게 있는가?
- 지금 실행해도 되는 타이밍인가?

### 패키지 의존성 관리

#### Package.json
- 애플리케이션이 필요로 하는 패키지 목록 나열
- 각 패키지는 시맨틱 버저닝 규칙으로 필요한 버전을 기술
- 다른 개발자와 같은 빌드 환경을 구성할 수 있음

##### 시멘틱 버저닝 규칙
시멘틱 버저닝 규칙은 패키지의 버전명을 숫자로 관리하는 방법이다.

###### 규칙
```bash
[Major].[Minor].[Patch].[label]
```

```bash
예시 : 1.4.2.beta

- MAJOR (1) : 호환되지 않는 API 변경 발생 시
- MINOR (4) : 기능 추가 (기존과 호환 유지)
- PATCH (2) : 버그 수정
- label (beta) : 버전에 대한 부가설명
```

#### Package-lock.json
- 프로젝트가 필요로 하는 패키지들이 실제로 설치되는 장소 ( 런타임 시 참조함 )
- package.json에 선언된 패키지들이 설치될 때의 정확한 버전과 서로 간 의존성을 표현
- node_modules를 저장소에 공유하지 않아도 되게 해줌
- npm install시 이 파일을 기준으로 패키지를 설치

<br>

※ 타입스크립트는 배우는 내용이니 건너뛰었습니다.

## 데커레이터
NestJS는 데커레이터를 적극 활용한다. 데커레이터를 활용해서 횡단 관심사를 분리하여 관점 지향 프로그래밍을 적용할 수 있음
클래스, 메서드, 접근자, 프로퍼티, 매개변수에 적용 가능하며 선언부 앞에 @로 시작하는 데커레이터를 선언하면 데커레이터로 구현된 코드를 같이 실행할 수 있다.

#### 횡단 관심사란?
> 비즈니스 로직과는 직접 관련이 없지만, 애플리케이션 여러 부분에서 반복적으로 필요한 기능이다.
- 로깅 : 모든 요청, 응답 시간, 에러 기록
- 인증/인가	: 사용자의 권한 체크
- 트랜잭션 처리	: DB 트랜잭션 시작/커밋/롤백
- 에러 처리	: 공통적인 예외 처리 방식
- 보안 필터링	: 민감 정보 마스킹 등
#### 관점 지향 프로그래밍이란?
> 핵심 로직과 공통 관심사를 분리해서, 필요한 지점에서 자동/선언적으로 적용할 수 있도록 한 프로그래밍 패러다임
- Aspect (관점) :	횡단 관심사를 모듈화한 것 (예: 로깅 Aspect)
- Advice (조언)	: 언제 실행할지 정의 (before, after, around)
- Join Point (접합 지점) : Advice가 실행될 수 있는 시점 (ex. 메서드 호출)
- Pointcut : 어떤 Join Point에 Advice를 적용할지 결정하는 조건
- Weaving (위빙) : 실제 코드에 Aspect를 적용하는 과정 (컴파일, 런타임 등)

#### AOP를 왜 사용할까?
- 중복 제거 : 공통 로직을 한 곳에만 정의
- 관심사 분리 : 핵심 로직과 부가 로직이 분리되어 가독성 향상
- 유지보수 용이 : 변경 시 한 곳만 수정하면 됨
- 테스트 쉬움 : 핵심 로직만 테스트 가능 (로깅 등 분리됨)

> NestJs는 AOP 철학을 자연스럽게 따르는 프레임워크이며, 데코레이터 기반 구조를 통해 관심사 분리, 코드 재사용, 유지보수성을 향상시킨다.

##### 코드 예시
```ts
// 관심사 분리 전
getUser() {
  console.log('요청 시작');
  const user = this.userService.find();
  console.log('요청 끝');
  return user;
}

// AOP 방식 (관심사 분리)
@Log()
getUser() {
  return this.userService.find();
}
```
유저 생성 요청을 데이터 전송 객체로 표현한 클래스
```ts
class CreateUserDto {
  @IsEmail()
  @MaxLength(60)
  readonly email: strig;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly passward: string;
}
```
사용자의 잘못된 요청을 데커레이커를 활용해 유효성 검사를 수행하는 코드이다.
데커레이터는 그냥 날로 먹으면 되는건가?
```ts
function deco(target: any, propertyKey: string, descriptor: PropertyDescriptor) { // 데커레이터 정의 방식
  console.log("데커레이커가 평가됨");
}

class TestClass {
  @deco
  test() {
    console.log("함수 호출됨");
  }
}

const t = new TestClass();
t.test();
```
다음 예제처럼 test 메서드의 데커레이터인 deco를 선언했다. 어떠한 기능을 가진 데커레이터는 함수의 형태로 선언해줘야 하는 것  
해당 코드를 실행하면 다음과 같은 결과가 출력된다.
```bash
데커레이터가 평가됨
함수 호출됨
```
다음과 같이 인수를 넘겨서 사용할 수도 있다.
```ts
function deco(value: string) {
  console.log("데커레이터가 평가됨");
  return function (target: any,propertyKey: string, descriptor: PropertyDescriptor
  ) {
    console.log(value);
  };
}

class TestClass {
  @deco("Hello")
  test() {
    console.log("함수 호출됨");
  }
}
```
실행 결과
```bash
데커레이터가 평가됨
Hello
함수 호출됨
```
### 데커레이터 합성
여러 개의 데커레이터를 **함수 합성**과 같이 합성할 수 있다. 여러 개의 데코레이터를 한꺼번에 묶어서, 하나의 커스텀 데코레이터처럼 사용할 수 있다.  
데커레이터에는 **평가**와 **함수 동작**이 나뉜다. 
#### 중첩 합성
여러 데커레이터를 사용할 때는 다음과 같은 단계가 수행됨
1. 각 데커레이터의 표현은 위에서 아래로 **평가**된다.
2. 결과는 아래에서 위로 **함수로 호출**된다.
```ts
function first() {
  console.log("first(): factory evaluated"); // 평가
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("first(): called"); // 함수 호출
  };
}
function second() {
  console.log("second(): factory evaluated"); // 평가
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("second(): called"); // 함수 호출
  };
}

class ExampleClass {
  @first()
  @second()
  method() {
    console.log("method is called");
  }
}
```
실행 결과
```bash
first(): factory evaluated
second(): factory evaluated // 평가
second(): called
first(): called // 함수 호출
```
#### 함수형 합성
여러 데코레이터를 하나로 합쳐 재사용할 수 있다. 동일한 조합을 반복해서 쓰고 싶을 때 사용할 수 있다. (@Log() + @Timing() 조합을 여러 메서드에 붙일 경우)
```ts
function Log() {}
function Timing() {}
function Combined(...decorators: MethodDecorator[]): MethodDecorator {
  return (target, key, descriptor) => {
    for (const deco of decorators.reverse()) {
      deco(target, key, descriptor);
    }
    return descriptor;
  };
}

class MyClass {
  @Combined(Log(), Timing())
  run() {
    console.log('업무 로직');
  }
}
```
### 클래스 데커레이터
클래스 데커레이터는 이름 그대로 클래스 바로 앞에 선언하는 데커레이터이다.
- 클래스 생성자에 적용되어 클래스 정의를 읽거나 수정할 수 있다.
- 선언 파일과 선언 클래스 내에서는 사용될 수 없다.

예제 코드
```ts
function reportableClassDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    reportingURL = "http://www.example.com";
  };
}

@reportableClassDecorator
class BugReport {
  type = "report";
  title: string;
  constructor(t: string) {
    this.title = t;
  }
}

const bug = new BugReport("Needs dark mode");
console.log(bug);
```
실행 결과
```bash
BugReport {
  type: 'report',
  title: 'Needs dark mode',
  reportingURL: 'http://www.example.com'
}
```
생성자를 리턴하는 클래스 데커레이터 reportableClassDecorator를 통해 BugReport 클래스에 선언하지 않았던 새로운 속성이 추가되었다.
### 메서드 데커레이터
메서드 앞에 선언하는 데커레이터이다.  
- 메서드의 속성 설명자(서술자)에 적용된다.
- 메서드의 정의를 읽거나 수정할 수 있다.
- 데커레이터가 값을 반환한다면 해당 메서드의 속성 설명자가 된다
메서드 데커레이터는 다음의 세 개의 인수를 가진다.
- target: 데코레이터가 적용된 클래스의 프로토타입 객체
- propertyKey: 	데코레이터가 붙은 메서드 이름 (문자열)
- descriptor: 	메서드의 정의를 담고 있는 속성 설명 객체 (PropertyDescriptor)

예제 코드드
```ts
function ToUpperCase() {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value; // 메서드 속성 정보
    console.log(propertyKey); // 메서드 이름

    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args); // 메서드 값 추출
      if (typeof result === "string") {
        return result.toUpperCase();
      }
      return result;
    };

    return descriptor;
  };
}

class Greeter {
  @ToUpperCase()
  sayHello() {
    return "hello world";
  }
}

const g = new Greeter();
console.log(g.sayHello());

```
실행 결과
```bash
sayHello
HELLO WORLD
```
@ToUpperCase() 데커레이터를 정의해서 sayHello의 return 값을 대문자로 변환해주는 코드이다. 
### 접근자 데커레이터
접근자 앞에 선언하는 데커레이터이다.
- 접근자의 속성 설명자에 적용되며 접근자의 정의를 읽거나 수정할 수 있다.
- 접근자 데커레이터가 반환하는 값은 해당 맴버의 속성 설명자가 된다.
#### 접근자란?
> 객체 프로퍼티를 객체 외에서 읽고 쓸 수 있는 함수, 게터(getter)와 세터(setter)가 있다.
예제 코드
```ts
function Enumerable(enumerable: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = enumerable;
  };
}

class Person {
  [key: string]: any;
  constructor(private name: string) {}

  @Enumerable(true) // 열거 가능
  get getName() {
    return this.name;
  }
  @Enumerable(false) // 열거 불가능
  set setName(name: string) {
    this.name = name;
  }
}

const person = new Person("Dexter");
for (let key in person) {
  console.log(`${key}: ${person[key]}`);
}
```
실행 결과
```bash
name: Dexter
getName: Dexter
```
접근자 데커레이터를 통해서 enumerable 속성을 지정해줬기 때문에 열거가 가능한 getName 함수를 출력되었고 열거가 불가능한 setName함수는 출력되지 못했다.

### 속성 데커레이터
클래스의 속성 바로 앞에 선언되는 테커레이터이다.
속성 데커레이터는 다음과 같은 인수를 가진다
- 클래스의 프로토타입
- 멤버의 이름

예제 코드
```ts
function LogProperty(target: Object, propertyKey: string | symbol) {
  console.log(
    `[LOG] Property 데코레이터가 ${String(propertyKey)}에 적용되었습니다.`
  );
}

class User {
  @LogProperty
  name: string = "Alice";

  @LogProperty
  age: number = 25;
}
```
실행 결과
```bash
[LOG] Property 데코레이터가 name에 적용되었습니다.
[LOG] Property 데코레이터가 age에 적용되었습니다.
```
따로 콘솔 로그를 작성하지 않았는데 데코레이터가 적용됐다.  
**클래스 정의 시점에 로그가 출력**된 것이다.

> 속성 데코레이터는 인스턴스를 만들기 전, 즉 클래스 자체가 정의되는 시점에 평가된다.

### 매개변수 데커레이터
생성자 또는 메서드의 매개변수에 선언되는 데커레이터이다.
매개변수 데커레이터는 다음과 같은 3가지 인수를 가진다.
- 클래스의 프로토타입
- 멤버의 이름
- 매개변수가의 위치를 나타내는 인덱스
매개변수 데커레이터는 단독으로 사용하는 것보다 함수 데커레이터와 함께 사용할 때 유용하다. 보통 API 요청 매개변수에 대한 유효성 검사를 할 때 사용한다.
예제 코드
```ts
import "reflect-metadata";

function Required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  const existingRequired: number[] =
    Reflect.getOwnMetadata("required:params", target, propertyKey) || [];
  existingRequired.push(parameterIndex);
  Reflect.defineMetadata(
    "required:params",
    existingRequired,
    target,
    propertyKey
  );
}

function Validate(): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const requiredParams: number[] =
        Reflect.getOwnMetadata("required:params", target, propertyKey) || [];
      for (const index of requiredParams) {
        if (args[index] === undefined || args[index] === null) {
          throw new Error(
            `Missing required argument at index ${index} in method "${String(
              propertyKey
            )}"`
          );
        }
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

class UserService {
  @Validate()
  createUser(@Required name?: string, age?: number) {
    console.log(`사용자 생성: ${name}, 나이: ${age}`);
  }
}

const service = new UserService();

service.createUser("Alice", 30); // 정상 실행
service.createUser(undefined);

```  
실행 결과
```bash
사용자 생성: Alice, 나이: 30
Error: Missing required argument at index 0 in method "createUser"
```
@Required() 데커레이터를 파라미터에 붙이면 → 필수 입력값으로 체크만 한다. @Required()는 “이 파라미터는 필수입니다”라는 메타데이터만 저장하고, 실제 동작은 @Validate()가 나중에 실행 시점에 검사하는 구조이다.  
@Required()가 parameterIndex를 통해 저장한 파라미터의 순번(메타데이터)은 @Validate()에서 검사한다.  

## 데커레이터 종류별 정리

| 종류 | 적용 대상 | 전달 인자 | 주요 역할 및 용도 |
|------|------------|------------|--------------------|
| **클래스 데커레이터**<br>`@Controller()`, `@Injectable()` | 클래스 전체 | `target: Function` | 클래스에 메타데이터 추가<br>DI 대상 지정, 라우팅 설정 등 |
| **메서드 데커레이터**<br>`@Get()`, `@Post()`, `@Log()` | 클래스의 메서드 | `target`, `propertyKey`, `descriptor` | 메서드 실행 전/후 로직 추가, 라우팅 처리 등 |
| **접근자 데커레이터**<br>`@LogGetter` | `get`, `set` 접근자 | `target`, `propertyKey`, `descriptor` | getter/setter 감싸서 로그, 캐싱 등 부가기능 적용 |
| **속성 데커레이터**<br>`@Column()`, `@Inject()` | 클래스의 속성 | `target`, `propertyKey` | 메타데이터 저장, ORM 필드 매핑, 의존성 주입용 표시 |
| **매개변수 데커레이터**<br>`@Param()`, `@Required()` | 메서드의 파라미터 | `target`, `propertyKey`, `parameterIndex` | 특정 파라미터에 의미 부여<br>(예: 필수 체크, 매핑 등) |

### 추가
#### 데커레이터는 왜 평가와 실행을 나누는가?
- 평가 : 데코레이터 함수 자체를 호출 ( 예시 - @Log() -> Log()가 호출된다.)
- 적용 : 데코레이터의 리턴값 함수가 대상에 적용됨 ( 예시 - Log()(target, propertyKey, descriptor) 실행된다. )

###### 1. 동일한 데커레이터를 여러 방식으로 유연하게 재사용하기 위해
```ts
class UserService {
  @Log('UserService')
  getUser() {}
}

class OrderService {
  @Log('OrderService')
  getOrder() {}
}
```
위 예시처럼 @Log() 같은 데커레이터를 파라미터화해서 재사용하려면, 평가 시점에 인자를 받고, 그 인자를 바탕으로 나중에 데커레이터를 만들어야 한다.
한 번 감싸야 하기 때문에 평가 → 적용을 나누는 구조가 필요하다는 것

###### 2. 데커레이터의 실제 적용 시점과 실행 시점이 다르기 때문
데커레이터는 클래스 정의 "시점"에 적용되지만 클래스는 나중에 인스턴스를 만들고, 메서드를 호출해야 진짜 동작한다. 
```ts
class Example {
  @Log()
  method() { ... }
}

const ex = new Example(); // 여기까지는 데커레이터 실행 안 됨
ex.method();              // 진짜 실행은 여기서
```
데코레이터는 평가/정의 때 어떤 동작을 하게 할지 "설정만 해두는 느낌"이고 실제 동작은 나중에 호출될 때 실행된다.

###### 3. 메타데이터 조작을 위해
@Inject() 대표적인 의존성 주입(Dependency Injection) 데코레이터로 이러한 속성, 매개변수 데커레이터는 메서드를 실행시키는 게 아니라 정보(메타데이터)를 등록해두는 용도로 쓰인다.
```ts
@inject(SomeService) // 이건 실행되는 게 아니라 '표시'만 하는 역할
```
이 메타데이터 정보는 Nest 내부에서 런타임 시 참조한다고 한다.

##### 정리
> 평가 시점에는 데코레이터의 설정과 준비가 이뤄지고, 적용 시점에는 그 설정이 실제 코드에 반영돼서 실행 전/후 로직, 메타데이터 등록 등을 정확히 제어할 수 있게 하는 구조
