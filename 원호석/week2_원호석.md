# Week2

## Decorator?
-> 객체의 정보를 런타임에 조회 및 수정 가능 (reflection)
-> `@` 기호를 사용하여 정의하며, **함수**로 구현.
-> 데코레이터에 각 모듈마다 공통적으로 필요한 로직의 처리를 맡겨, 반복작업을 줄일 수 있다.

> 데코레이터는 tsconfig.json 파일에서 `experimentalDecorators` 컴파일러 옵션을 활성화해야 사용 가능.
```tsconfig.json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
``` 

## Types of Decorator

### 1. Class Decorator
-> 클래스 선언 앞에 위치하여 클래스 생성자를 조작

```ts
function Logger(constructor: Function) {
  console.log(`클래스 생성자: ${constructor.name}`);
}

@Logger
class Person {
  constructor() {
    console.log("Person 객체 생성");
  }
}
```

### 2. Property Decorator

```ts
function LogProperty(target: any, propertyKey: string) {
  console.log(`프로퍼티: ${propertyKey}`);
}

class Car {
  @LogProperty
  model: string;
}
```

### 3. Method Decorator
메서드에 추가적인 기능을 주입

```ts
function LogMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`메서드 호출: ${propertyKey}(${args.join(", ")})`);
    return originalMethod.apply(this, args);
  };
}

class Calculator {
  @LogMethod
  add(a: number, b: number) {
    return a + b;
  }
}
```

### 4. Accessor Decorator (getter/setter)
getter 또는 setter에 적용 -> 이를 이용하면, 값을 읽을 떄와 쓸 때 각각 서로 다른 로직을 적용 가능

```ts
function LogAccessor(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log(`액세서: ${propertyKey}`);
}

class User {
  private _age: number = 0;

  @LogAccessor
  get age() {
    return this._age;
  }

  set age(value: number) {
    this._age = value;
  }
}
```

### 5. Parameter Decorator
**메서드** 파라미터에 정보나 제약조건을 주입

```ts
function IsString(target: any, methodName: string, parameterIndex: number) {
    const originalMethod = target[methodName];

    Object.defineProperty(target, methodName, {
        value: function (...args: any[]) {
            
            return originalMethod.apply(this, args);
        },
    });
}

class Service {
    greet(@IsString message: string) {
        console.log(message);
    }
}

const s = new Service();

s.greet(1);

```

## Decorator Factory
아래와 같은 고차함수 형태를 이용하면 데코레이터에 인자를 전달할 수 있다.

```ts
interface DecoratorConfig {
    name: string;
}

function DecoratorFactory({ name }: DecoratorConfig) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            console.log(`Hello, My name is ${name}!`);
            return originalMethod.apply(this, args);
        };
    }
}

class Service {
    @DecoratorFactory({ name: "foo" })
    hello() {
        console.log("Nice to meet you!");
    }
}

const service = new Service();
service.hello();
//Hello, My name is foo!
//Nice to meet you!

```

