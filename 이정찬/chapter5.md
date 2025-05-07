## 모듈 설계
> 모듈은 여러 컴포넌트를 조합하여 좀 더 큰 작업을 수행할 수 있게 하는 단위

Nest는 기본적으로 다른 모듈들로 구성된 루트 모듈이 존재한다. 여러 모듈에 책임을 나눔으로써 모듈의 응집도를 높일 수가 있다.
응집도는 모듈의 독립성을 나타낸다. 응집도가 높을 수록 재사용성이 높고 유지보수가 쉽다.

### 모듈 다시 내보내기
Nest는 모듈을 다시 내보내는 기능을 제공한다. 루트 모듈에서 두 묘듈이 필요한 상황에서, 한 모듈이 다른 공통된 모듈을 import하고 있다면 다시 내보내기를 통해 중복으로 불러오지 않고 사용할 수 있다.

공통 모듈 CommonModule과 그 모듈을 사용하는 CoreModule이 있을 때, 루트 모듈인 AppModule은 CoreModule만 import하면 된다.
##### CommonModule.ts
```ts
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule { }
```

##### CoreModule.ts
```ts
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule { }
```

##### AppModule
```ts
@Module({
  imports: [CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
```

### 전역 모듈
공통 기능이나 DB 연결과 같은 전역적으로 쓸 수 있는 프로바이더가 필요한 경우 전역 모듈을 사용할 수 있다.
모듈에 @Global 데커레이터를 선언하는 방식으로 전역 모듈을 만들 수 있다.
```ts
@Global()
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule { }
```
다만 전역 모듈의 사용은 응집도를 떨어뜨리므로 꼭 필요한 때에만 사용해야한다.
