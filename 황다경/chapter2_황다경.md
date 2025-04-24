# 웹 개발 기초 지식

## SSR

> Server Side Rendering

- 서버가 요청을 처리한 다음, HTML과 자바스크립트 응답을 브라우저에 전송
- 브라우저는 서버로부터 전달되는 HTML을 화면에 뿌림
- 동적인 부분은 자바스크립트를 파싱하여 화면 구성

-> 웹 기술이 고도화됨에 따라 기존 방식으로 개발은 비효율적이게 됨.<br>
-> 웹 개발에 필수적인 요소들을 묶어 쉽게 쓸 수 있게 하자! = **Web Framework**

## 웹 프레임워크

> 데이터베이스에 연결을 설정하고, 데이터를 관리하거나 세션을 맺고 유지하는 등의 동작을 정해진 방법과 추상화된 인터페이스로 제공

**프론트 프레임워크는 최근 몇 년간 리액트가 큰 인기를 끌며, 많은 서비스가 SPA 기반으로 구축되었다.**

```
🙄리액트는 라이브러리 아닌가?

리액트가 라이브러리로 간주되는 이유
- 공식문서에서 라이브러리로 정의
- 미니멀한 기능: 프레임워크와 달리 UI 렌더링에 집중된 기능 제공
- 비교적 자유로운 사용 방식: 다른 프레임워크들에 비해 애플리케이션 구조에 대한 제약이 적다.
- 추가 라이브러리 필요: 라우팅, 상태관리, 폼 처리 등을 위해 별도의 라이브러리 필요-react-router, redux, formik 등

리액트가 프레임워크적 특성을 가진다?
- 제어의 역전(IoC): 프레임워크의 특성인 제어의 역전이 리액트에도 존재한다. 개발자가 코드 작성성-리액트가 그 코드를 실행
- 특성 패러다임 강제: JSX, 컴포넌트 기반 구조, 단방향 데이터 흐름 등 리액트만의 개발 방식을 따라야 한다.
- React Server components: 서버 컴포넌트 등 리액트 범위가 UI를 넘어 확장되고 있다.

절충안
리액트는 라이브러리지만 실질적으로 프레임워크처럼 작동한다, UI 런타임이라는 새로운 카테고리로 분류

최근에는 Next.js, Remix 등 메타 프레임워크가 리액트를 기반으로 더 종합적인 개발 환경을 제공하면서, 리액트 자체는 런타임 또는 UI 라이브러리로서의 역할에 집중하는 경향이 있다.

결론적으로, 라이브러리지만 프레임워크적 특성을 가지고 있으며 개발자마다 나름의 견해가 있는 것 같다. 도서에서 프레임워크라고 표기한 이유도 라이브러리와 딱히 구분짖지 않거나 꽤나 오래된 도서이니만큼 당시 개발 커뮤니티의 인식을 반영하였을 수도 있음. 라이브러리 vs 프레임워크 지나친 이분법적 관점보다는 일종의 스펙트럼으로 보는 것도 나쁘진 않을 것 같음.크리티컬한 오류는 아니지만 알아두면 좋은 논쟁거리
```

```
💪메타 프레임워크
메타 프레임워크는 기존 프레임워크나 라이브러리를 기반으로 더 높은 수준의 추상화와 기능을 제공하는 프레임워크이다. 리액트 생태계에서 next.js, remix 등이 대표적인 메타 프레임워크로, 리액트 라이브러리를 기반으로 추가적인 기능과 구조를 제공한다!

특징
- 프레임워크를 위한 프레임워크: 기존 UI 라이브러리를 확장
- 통합된 개발 환경: 라우팅, SSR, SSG, 데이터 페칭, 번들링 등 웹 애플리케이션 개발에 필요한 다양한 기능들을 미리 설정해 제공
- 개발 의사결정 간소화: 라이브러리 선택의 부담이 줄어든다.

Next.js, Remix, Gatsby, Nuxt.js, SvelteKit, Astro 등
```

### SPA

> 서버로부터 매 요청에 대해 최소한의 데이터만 응답으로 받고 화면 구성 로직을 프론트엔드에서 처리

초기 화면 진입 시 깜빡임 등의 렌더링 문제가 줄어들지만, 첫 화면 진입 시 프런트엔드 애플리케이션을 다운로드해야 하므로 초기 로딩 속도가 오래 걸린다.

### 웹 프레임워크 선택의 기준

- 개발 문서
- 사용자 수
- 활성 커뮤니티
- 깃헙 스타 수

등 종합적인 사항들을 고려하여 선택한다. 빠르게 프로토타이핑 하기 위해서는 자바스크립트, 파이썬, 루비 등 스크립트 언어로도 충분하지만, 대규모 트래픽 처리를 위해 추후 컴파일러 언어로 리뉴얼 작업을 진행하기도 한다.

```
⭐스크립트 언어로 작성된 소스코드를 컴파일러 언어 기반의 프레임워크로 리뉴얼한다

목적
- 성능 향상: 컴파일러 언어는 일반적으로 더 빠른 실행속도(대규모 시스템 또는 고성능 애플리케이션에 적합)
- 확장성
- 타입 안정성
- 엔터프라이즈 환경 적합성: 많은 기업 환경에서는 java와 같은 컴파일 언어가 더 널리 사용되고 지원됨.

```

| 구분          | 스크립트 언어                                  | 컴파일러 언어                                 |
| ------------- | ---------------------------------------------- | --------------------------------------------- |
| 실행 방식     | 인터프리터가 코드를 한 줄씩 해석하며 즉시 실행 | 코드 전체를 기계어로 변환한 후 실행 파일 생성 |
| 실행 속도     | 상대적으로 느림 (실행 시점에 해석)             | 빠름 (최적화된 기계어 코드 실행)              |
| 개발 속도     | 빠름 (수정 후 즉시 결과 확인 가능)             | 상대적으로 느림 (컴파일 과정 필요)            |
| 타입 시스템   | 주로 동적 타입 (런타임에 타입 결정)            | 주로 정적 타입 (컴파일 시점에 타입 검사)      |
| 메모리 관리   | 주로 자동 (가비지 컬렉션)                      | 수동 또는 반자동 (개발자가 더 많은 제어)      |
| 오류 발견     | 실행 시점 (런타임)에 발견                      | 컴파일 시점에 많은 오류 발견 가능             |
| 배포 방식     | 소스 코드 배포 또는 바이트코드                 | 실행 파일 배포                                |
| 플랫폼 독립성 | 높음 (인터프리터만 있으면 실행 가능)           | 낮음 (특정 환경에 맞게 컴파일 필요)           |
| 대표 언어     | JavaScript, Python, PHP, Ruby                  | C, C++, Java, Go, Rust                        |
| 적합한 용도   | 웹 개발, 스크립팅, 프로토타이핑                | 시스템 프로그래밍, 고성능 애플리케이션        |

## Node.js

> 자바스크립트 런타임 환경으로, 브라우저 외부에서 자바스크립트 코드를 실행하게 해주는 플랫폼

NestJS는 TypeScript로 작성된 코드를 Node.js 환경에서 실행 가능한 자바스크립트 소스 코드로 컴파일하며, NestJS 애플리케이션은 내부적으로 Express(기본값) 또는 Fastify와 같은 HTTP 서버 프레임워크 위에서 동작한다.

- Node.js 등장 이전에는 자바스크립트는 프런트엔드 기술, 스크립트 언어라는 인식이 강했다.
- Node.js 등장 이후로 자바스크립트로 서버를 구동할 수 있게 되었고, 당당히 하나의 언어로 인정 받게 되었다.

### Node.js 특징 : 단일 스레드에서 구동되는 논블로킹 I/O 기반 비동기 방식

```
👥멀티 스레딩
여러 작업 요청이 한꺼번에 들어올 때, 각 작업을 처리하기 위한 스레드를 만들고 할당하는 방식

- 빠르지만, 공유 자원을 관리하는 노력이 많이 들고 동기화를 잘못 작성하면 lock에서 빠져나오지 못하는 경우 발생
- 스레드가 늘어날수록 메모리 소모->메모리 관리 중요
```

Node.js는 하나의 스레드에서 작업을 처리한다! (애플리케이션 단에서는 단일 스레드, 백그라운드에서는 스레드 풀을 구성하여 작업)<br>

-> libuv(Node.js에 포함된 비동기 I/O 라이브러리)가 스레드 풀을 관리하므로 개발자는 **단일 스레드에서 동작하는 것처럼 이해하기 쉬운 코드를 작성**할 수 있다.<br>

-> 들어온 작업을 앞의 작업이 끝날 때까지 기다리지 않고 비동기로 처리하여, **입력은 하나의 스레드에서 받지만 순서대로 처리하지 않고 먼저 처리된 결과를 이벤트로 반환**해준다.

### 이벤트 루프

> 시스템 커널에서 가능한 작업이 있다면 그 작업을 커널에 이관

자바스크립트가 단일 스레드 기반임에도 Node.js가 논블로킹 I/O 작업을 수행할 수 있도록 해주는 핵심 기능이다.

🚦**이벤트 루프의 6단계**

```
👉 타이머 단계, 대기 콜백 단계, 유휴/준비 단계, 폴 단계, 체크 단계, 종료 콜백 단계

┌──────────────────────────────────────────────┐
│            ┌─────────────────┐               │
│            │   타이머 단계    │               │ ← setTimeout, setInterval 콜백 실행
│            └─────────────────┘               │
│                     ↓                        │
│            ┌─────────────────┐               │
│            │  대기 콜백 단계  │               │ ← 지연된 I/O 콜백 실행
│            └─────────────────┘               │
│                     ↓                        │
│            ┌─────────────────┐               │
│            │  유휴/준비 단계  │               │ ← 내부용 (시스템 내부 사용)
│            └─────────────────┘               │
│                     ↓                        │
│            ┌─────────────────┐               │
│            │     폴 단계     │               │ ← I/O 이벤트 수신 및 처리
│            └─────────────────┘               │
│                     ↓                        │
│            ┌─────────────────┐               │
│            │    체크 단계    │               │ ← setImmediate() 콜백 실행
│            └─────────────────┘               │
│                     ↓                        │
│            ┌─────────────────┐               │
│            │  종료 콜백 단계  │               │ ← 소켓 종료 등 close 이벤트 처리
│            └─────────────────┘               │
│                     ↓                        │
└──────────────────────────────────────────────┘
               (다시 처음으로)
```

이벤트 루프 각 단계에는 해당 단계에서 실행되는 작업을 저장하는 큐가 있다. <br>
또한 이벤트 루프의 구성 요소는 아니지만 `nextTickQueue`와 `microTaskQueue`가 존재한다. -> 이 큐에 들어있는 작업은 이벤트 루프가 어느 단계에 있든지 실행될 수 있다.

**자바스크립트 코드는 유휴/준비 단계를 제외한 어느 단계에서나 실행될 수 있다.**

🌊**실행 흐름**

1. 시작: node main.js 명령어 실행
2. 초기화: 이벤트 루프 생성
3. 메인 코드 실행: 동기 코드 즉시 실행, 비동기 작업은 적절한 큐에 등록
4. 콜백 처리: 이벤트 루프가 6단계를 순환하며 각 단계의 큐에 있는 콜백 실행
5. 루프 계속 여부 결정: 큐에 작업이 남아있으면 루프 계속, 없으면 종료
6. 종료: 모든 작업이 완료되면 프로세스 종료

## 패키지 의존성 관리

### package.json

- 애플리케이션이 필요로 하는 패키지 목록을 나열
- 각 패키지는 시맨틱 버저닝 규칙으로 필요한 버전 기술
- 다른 개발자와 동일한 빌드 환경 구성 가능

```
🗂️유의적 버전 관리 Semantic Verioning, Semver
패키지의 버전명을 숫자로 관리하는 방법

버저닝 규칙:
[Major].[Minor].[Patch]-[label]
- Major: 이전 버전과 호환이 불가능할 때 숫자 증가
- Minor: 기능이 추가된 경우 숫자 증가
- Patch: 버그 수정 패치 적용 시 사용
- label: 선택 사항(pre, alpha, beta 등등)
```

### package-lock.json

- package.json에 선언된 패키지들의 **정확한 버전**과 의존성 관계를 기록
- 개발 환경과 상관없이 동일한 의존성 트리 보장
- 팀원 간 정확히 동일한 패키지 버전 사용 가능

```
⭐⭐⭐package.json이 "대략적인 요구사항"이라면, package-lock.json은 "정확한 구현 명세서". package.json에서는 ^1.2.3처럼 버전 범위를 지정할 수 있지만, package-lock.json은 정확히 1.2.3 버전을 지정
```

## 데커레이터

데커레이터를 잘 사용하면 횡단 관심사를 분리하여 관점 지향 프로그래밍을 적용한 코드를 작성할 수 있다.

```
🥸횡단 관심사 Cross-cutting
애플리케이션의 여러 부분에 걸쳐 반복적으로 나타나는 공통 기능. 핵심 비즈니스 로직과는 별개지만, 애플리케이션 전반에 필요한 기능들이다.

- 로깅(애플리케이션 실행 정보 기록)
- 보안/인증(사용자 권한 확인, 접근 제어)
- 트랜잭션 관리(데이터베이스 작업의 원자성 보장)
- 에러 처리(일관된 예외 처리 메커니즘)
- 캐싱(자주 사용되는 데이터의 성능 최적화)
- 유효성 검증(입력 데이터 검증증)
```

```
🥸관심사 지향 프로그래밍 Aspect-Oriented Programming, AOP
횡단 관심사를 핵심 비즈니스 로직에서 분리하여 모듈화하는 프로그래밍 패러다임
코드의 중복을 줄이고, 비즈니스 로직의 가독성을 높이며 유지보수성 향상 가능

AOP 핵심 개념
- 관점(Aspect): 여러 클래스나 메서드에 걸쳐 적용되는 기능(로깅, 보안)
- 조인 포인트(Join Point): 프로그램 실행 중 관점이 적용될 수 있는 지점
- 어드바이스(Advice): 특정 조인 포인트에서 실행될 코드
- 포인트컷(Pointcut): 어떤 조인 포인트에서 어드바이스를 적용할지 결정하는 표현식

Nest.js에서의 AOP 구현 요소
- 인터셉터(Interceptors): 요청/응답 처리 전후에 로직 실행
- 가드(Guards): 인증 및 권한 부여 확인
- 파이프(Pipes): 입력 데이터 변환 및 유효성 검사
- 미들웨어(Middleware): 요청 처리 파이프라인에 로직 삽입
- 예외 필터(Exception Filters): 예외 처리 로직 분리
```

클래스, 메서드, 접근자, 프로퍼티, 매개변수에 적용 가능하다. 각 요소의 선언부 앞에 `@`로 시작하는 데커레이터를 선언하면 데커레이터로 구현된 코드를 함께 실행한다.

---

### 데커레이터 예제

```typescript
class CreateUserDto {
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @Isstring()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
```

- 데커레이터를 사용하여 사용자가 보내는 값이 애플리케이션이 요구하는 형식과 일치하는지 검사

```typescript
function deco(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
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

- 메서드 데커레이터로 사용하기 위해서는 `deco`함수의 인자들처럼 정의가 필요

<br>

```
🙄메서드 데커레이터..?🙄

데커레이터와 메서드 데커레이트는 다르다.
- 클래스 데커레이터: 클래스 선언에 사용
- 메서드 데커레이터: 클래스 내 메서드에 적용
- 속성 데커레이터: 클래스 속성에 적용
- 매개변수 데커레이터: 메서드 매개변수에 적용
- 접근자 데커레이터: getter/setter에 적용

각 데커레이터는 서로 다른 매개변수를 받는다.
```

```
🙄메서드 데커레이터로 사용하기 위해서는 deco함수의 인자들처럼 정의가 필요
-> 메서드 데커레이터를 만들 때는 반드시 3개의 매개변수가 필요하다는 뜻!!

- target: 데커레이트 되는 메서드가 속한 클래스의 프로토타입
- propertyKey: 데커레이트 되는 메서드의 이름
- descriptor: 메서드의 속성 설명자

```

<br>

```typescript
function deco(value: string) {
  console.log("데커레이터가 평가됨");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
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

//데커레이터가 평가됨
//Hello
//함수 호출됨
```

- 데커레이터에 인수를 넘겨 데커레이터 동작을 변경하고 싶다면 `데커레이터 팩토리`를 만들어준다.
- "Hello"가 deco 함수에 전달됨
- "데커레이터가 평가됨"이 출력됨
- deco가 반환한 데코레이터 함수가 메서드에 적용됨
- 그 데코레이터 내에서 console.log(value)가 실행되어 "테스트 값"이 출력

```
⭐데커레이터 팩토리
데커레이터를 반환하는 함수
```

---

### 데커레이터 합성

> 함수 합성과 같이 데커레이터를 합성하여 여러 개의 데커레이터를 사용할 수 있다.

```typescript
@f
@g
test

//f(g(x))와 같다..
```

1. 각 데커레이터 표현은 위에서 아래로 `평가`된다.
2. 결과는 아래에서 위로 함수로 `호출`된다.

```
【평가 단계】(위에서 아래로)
┌────────────────────┐
│ @f 데코레이터 평가  │ → 먼저 실행
└────────────────────┘
          ↓
┌────────────────────┐
│ @g 데코레이터 평가  │ → 다음 실행
└────────────────────┘

【호출 단계】(아래서 위로)
┌────────────────────┐
│ @f 데코레이터 적용  │ → 나중에 실행
└────────────────────┘
          ↑
┌────────────────────┐
│ @g 데코레이터 적용  │ → 먼저 실행
└────────────────────┘


// 평가 단계 (클래스 정의 시)
f 데코레이터 평가 중
g 데코레이터 평가 중

// 호출 단계 (실제 적용 시)
g 데코레이터 적용됨
f 데코레이터 적용됨
```

---

### 1. 클래스 데코레이터

**특징:**

- 클래스 생성자에 적용되어 클래스 정의를 읽거나 수정할 수 있다.
- 생성자 함수를 인수로 받는다.

```typescript
function Logger(logString: string) {
  console.log("1. 클래스 데코레이터 팩토리 평가됨");

  return function (constructor: Function) {
    console.log("3. 클래스 데코레이터 함수 실행됨");
    console.log(`4. 로그 메시지: ${logString}`);
    console.log(`5. 클래스 이름: ${constructor.name}`);

    // 클래스 확장 예시
    return class extends constructor {
      newProperty = "새 속성";

      constructor(...args: any[]) {
        super(...args);
        console.log("7. 확장된 생성자 실행됨");
        console.log("8. 새 속성 추가됨:", this.newProperty);
      }
    };
  };
}

@Logger("Person 클래스 로깅")
class Person {
  name = "기본이름";

  constructor() {
    console.log("2. 원본 클래스 정의됨");
    console.log("6. 원본 생성자 실행됨");
  }
}

console.log("9. 인스턴스 생성 전");
const person = new Person();
console.log("10. 인스턴스 생성 후");
```

**실행 흐름:**

1. 클래스 데코레이터 팩토리가 먼저 평가된다.
2. 원본 클래스가 정의된다.
3. 클래스 데코레이터 함수가 실행되어 클래스를 수정한다.
4. 데코레이터 내부에서 로그 메시지가 출력된다.
5. 클래스 이름이 출력된다.
6. 인스턴스 생성 시 원본 생성자가 실행된다.
7. 확장된 생성자 코드가 실행된다.
8. 새 속성이 추가되었음을 알린다.
9. 인스턴스 생성 전 메시지가 출력된다.
10. 인스턴스가 생성된 후 메시지가 출력된다.

### 2. 메서드 데코레이터

**특징:**

- 메서드의 속성 설명자에 적용되어 메서드 정의를 읽거나 수정한다.
- 3개의 인수(target, propertyKey, propertyDescriptor)를 받는다.

```typescript
function LogMethod(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  console.log("1. 메서드 데코레이터 실행됨");
  console.log(`2. 메서드 이름: ${methodName}`);

  // 원래 메서드 참조 저장
  const originalMethod = descriptor.value;

  // 메서드 기능 확장
  descriptor.value = function (...args: any[]) {
    console.log(`4. ${methodName} 호출 전 로깅, 인자:`, args);

    // 원래 메서드 호출
    const result = originalMethod.apply(this, args);

    console.log(`6. ${methodName} 호출 후 로깅, 결과:`, result);
    return result;
  };

  console.log("3. 메서드 데코레이터 완료");

  return descriptor;
}

class Calculator {
  @LogMethod
  add(a: number, b: number) {
    console.log("5. 원래 add 메서드 실행 중");
    return a + b;
  }
}

const calc = new Calculator();
console.log("7. 메서드 호출 전");
const result = calc.add(5, 3);
console.log(`8. 최종 결과: ${result}`);
```

**실행 흐름:**

1. 클래스 정의 시 메서드 데코레이터가 실행된다.
2. 데코레이터에서 메서드 이름이 출력된다.
3. 메서드 데코레이터 실행이 완료된다.
4. 메서드 호출 시 확장된 로직이 먼저 실행되어 호출 전 로깅이 이루어진다.
5. 원래 메서드 코드가 실행된다.
6. 메서드 실행 후 로깅이 이루어진다.
7. 메서드 호출 전 메시지가 출력된다.
8. 최종 결과가 출력된다.

### 3. 접근자 데코레이터

**특징:**

- getter/setter 접근자의 속성 설명자에 적용된다.
- 메서드 데코레이터와 동일한 3개 인수를 받는다.
- 반환값이 새 속성 설명자가 된다.

```typescript
function ValidateAge(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log("1. 접근자 데코레이터 실행됨");

  const originalSetter = descriptor.set;

  // setter 수정
  descriptor.set = function (value: number) {
    console.log(`3. 새 setter 실행, 값: ${value}`);

    if (value < 0) {
      console.log("4. 유효하지 않은 나이 감지됨");
      throw new Error("나이는 음수가 될 수 없습니다");
    }

    if (value > 200) {
      console.log("4. 비현실적인 나이 감지됨");
      throw new Error("나이가 너무 높습니다");
    }

    console.log("5. 원래 setter 호출");
    originalSetter.call(this, value);
  };

  console.log("2. 접근자 데코레이터 완료");

  return descriptor;
}

class Person {
  private _age: number = 0;

  get age() {
    console.log("7. getter 호출됨");
    return this._age;
  }

  @ValidateAge
  set age(value: number) {
    console.log("6. 원래 setter 내부 코드 실행");
    this._age = value;
  }
}

const person = new Person();
console.log("8. 유효한 나이 설정 시도");
person.age = 30;
console.log(`9. 현재 나이: ${person.age}`);

try {
  console.log("10. 유효하지 않은 나이 설정 시도");
  person.age = -5;
} catch (error) {
  console.log(`11. 오류 발생: ${error.message}`);
}
```

**실행 흐름:**

1. 클래스 정의 시 접근자 데코레이터가 실행된다.
2. 접근자 데코레이터 실행이 완료된다.
3. setter 호출 시 수정된 setter가 먼저 실행된다.
4. 유효성 검사가 이루어진다.
5. 유효한 값이면 원래 setter가 호출된다.
6. 원래 setter 코드가 실행된다.
7. getter 호출 시 getter 코드가 실행된다.
8. 유효한 나이 설정 시도 메시지가 출력된다.
9. 현재 나이가 출력된다.
10. 유효하지 않은 나이 설정 시도 메시지가 출력된다.
11. 오류 메시지가 출력된다.

### 4. 속성 데코레이터

**특징:**

- 클래스 속성에 적용된다.
- 2개의 인수(target, propertyKey)만 받는다.
- 속성 설명자가 없어 속성 값을 직접 수정할 수 없다.

```typescript
function MinLength(min: number) {
  console.log("1. 속성 데코레이터 팩토리 실행됨");

  return function (target: any, propertyKey: string) {
    console.log(`2. 속성 데코레이터 실행됨: ${propertyKey}`);

    // 비공개 속성 키 생성
    const privateKey = Symbol();

    // 속성 정의 재설정
    Object.defineProperty(target, propertyKey, {
      get() {
        console.log("5. getter 호출됨");
        return this[privateKey];
      },
      set(value: string) {
        console.log(`4. setter 호출됨, 값: ${value}`);

        if (value.length < min) {
          console.log(`6. 유효성 검사 실패: 최소 ${min}자 필요`);
          throw new Error(`${propertyKey}는 최소 ${min}자 이상이어야 합니다`);
        }

        console.log("7. 유효성 검사 통과, 값 설정");
        this[privateKey] = value;
      },
    });

    console.log("3. 속성 데코레이터 완료");
  };
}

class User {
  @MinLength(3)
  username: string;

  constructor(username: string) {
    console.log("8. 생성자 실행됨");
    this.username = username;
  }
}

console.log("9. 유효한 사용자 생성 시도");
const user1 = new User("admin");
console.log(`10. 사용자 이름: ${user1.username}`);

try {
  console.log("11. 유효하지 않은 사용자 생성 시도");
  const user2 = new User("a");
} catch (error) {
  console.log(`12. 오류 발생: ${error.message}`);
}
```

**실행 흐름:**

1. 속성 데코레이터 팩토리가 실행된다.
2. 속성 데코레이터가 실행되어 속성 이름이 출력된다.
3. 속성 데코레이터 실행이 완료된다.
4. 값 설정 시 커스텀 setter가 호출된다.
5. 값 조회 시 커스텀 getter가 호출된다.
6. 유효성 검사 실패 시 메시지가 출력된다.
7. 유효성 검사 통과 시 값이 설정된다.
8. 생성자가 실행된다.
9. 유효한 사용자 생성 시도 메시지가 출력된다.
10. 사용자 이름이 출력된다.
11. 유효하지 않은 사용자 생성 시도 메시지가 출력된다.
12. 오류 메시지가 출력된다.

### 5. 매개변수 데코레이터

**특징:**

- 메서드의 매개변수에 적용된다.
- 3개의 인수(target, propertyKey, parameterIndex)를 받는다.
- 주로 메타데이터 기록에 사용된다.

```typescript
// reflect-metadata 라이브러리 가정
import "reflect-metadata";

const REQUIRED_META_KEY = Symbol("required");

function Required(target: any, methodName: string, paramIndex: number) {
  console.log("1. 매개변수 데코레이터 실행됨");
  console.log(`2. 메서드: ${methodName}, 매개변수 인덱스: ${paramIndex}`);

  // 메타데이터 저장
  const requiredParams: number[] =
    Reflect.getOwnMetadata(REQUIRED_META_KEY, target, methodName) || [];
  requiredParams.push(paramIndex);
  Reflect.defineMetadata(REQUIRED_META_KEY, requiredParams, target, methodName);

  console.log("3. 매개변수 데코레이터 완료");
}

function ValidateParams(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  console.log("4. 메서드 데코레이터 실행됨");

  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log("7. 검증 래퍼 함수 실행됨");

    // 필수 매개변수 가져오기
    const requiredParams: number[] =
      Reflect.getOwnMetadata(REQUIRED_META_KEY, target, methodName) || [];

    // 필수 매개변수 확인
    for (const index of requiredParams) {
      if (args[index] === undefined || args[index] === null) {
        console.log(`8. 필수 매개변수 누락: 인덱스 ${index}`);
        throw new Error(
          `${methodName} 메서드의 ${index} 번째 매개변수는 필수입니다`
        );
      }
    }

    console.log("9. 모든 필수 매개변수 확인됨");
    console.log("10. 원래 메서드 호출");
    return originalMethod.apply(this, args);
  };

  console.log("5. 메서드 데코레이터 완료");

  return descriptor;
}

class OrderService {
  @ValidateParams
  processOrder(
    orderId: string,
    @Required productId: string,
    @Required quantity: number
  ) {
    console.log("11. 원래 메서드 내부 코드 실행");
    console.log(
      `12. 주문 처리: 주문 ${orderId}, 상품 ${productId}, 수량 ${quantity}`
    );
    return true;
  }
}

console.log("6. 서비스 인스턴스 생성");
const service = new OrderService();

try {
  console.log("13. 유효한 주문 처리 시도");
  service.processOrder("order123", "product456", 2);
  console.log("14. 주문 처리 성공");

  console.log("15. 누락된 매개변수로 주문 처리 시도");
  // @ts-ignore - 의도적으로 오류 발생
  service.processOrder("order123", null, 2);
} catch (error) {
  console.log(`16. 오류 발생: ${error.message}`);
}
```

**실행 흐름:**

1. 매개변수 데코레이터가 실행된다.
2. 메서드와 매개변수 인덱스 정보가 출력된다.
3. 매개변수 데코레이터 실행이 완료된다.
4. 메서드 데코레이터가 실행된다.
5. 메서드 데코레이터 실행이 완료된다.
6. 서비스 인스턴스가 생성된다.
7. 메서드 호출 시 검증 래퍼 함수가 실행된다.
8. 필수 매개변수 누락 시 오류 메시지가 출력된다.
9. 모든 필수 매개변수가 확인되었음을 알린다.
10. 원래 메서드가 호출된다.
11. 원래 메서드 내부 코드가 실행된다.
12. 주문 처리 정보가 출력된다.
13. 유효한 주문 처리 시도 메시지가 출력된다.
14. 주문 처리 성공 메시지가 출력된다.
15. 누락된 매개변수로 주문 처리 시도 메시지가 출력된다.
16. 오류 메시지가 출력된다.

<br>

| 데커레이터          | 역할                        | 호출 시 전달되는 인수                   | 선언 불가능한 위치                        |
| ------------------- | --------------------------- | --------------------------------------- | ----------------------------------------- |
| 클래스 데커레이터   | 클래스의 정의를 읽거나 수정 | constructor                             | d.ts 파일, declare 클래스                 |
| 메서드 데커레이터   | 메서드의 정의를 읽거나 수정 | target, propertyKey, propertyDescriptor | d.ts파일, declare 클래스, 오버로드 메서드 |
| 접근자 데커레이터   | 접근자의 정의를 읽거나 수정 | target, propertyKey, propertyDescriptor | d.ts 파일, declare 클래스                 |
| 속성 데커레이터     | 속성의 정의를 읽음          | target, propertyKey                     | d.ts파일, declare 클래스                  |
| 매개변수 데커레이터 | 매개변수의 정의를 읽음      | target, propertyKey, parameterIndex     | d.ts 파일, declare 클래스                 |
