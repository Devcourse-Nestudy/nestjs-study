## 동적 모듈
> 동적 모듈은 모듈이 생성될 때 동적으로 어떠한 변수의 값이 정해진다.

호스트모듈(컴포넌트를 제공하는 모듈)을 가져다 쓰는 소비 모듈에서 호스트 모듈을 생성할 때 동적으로 값을 설정하는 방식으로 동작한다.
모듈 인스턴스가 생성될 때 결정되어 코드가 간결해진다.

Node.js에서는 일반적으로 dotenv 라이브러리를 사용해 환경 변수를 구성한다. ( nodemail 실습에 dotenv를 사용했다.)
Nest는 실행 환경에 따라 서버에 설정되는 환경변수를 관리하는 Config모듈을 사용해 동적 모듈을 구성한다. 

### 환경변수 구성

Nest에서는 dotenv를 내부적으로 활용하는 @nestjs/config 패키지를 제공한다.
```bash
npm i --save @nestjs/config
```
루트 모듈의 .env가 존재할 경우
```ts
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forRoot(})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
```

개발 환경이 다음과 같은 경우
로컬(개발, 단위 테스트) -> 스테이지(통합 테스트) -> 프로덕션(배포)
- 로컬 환경 : localhost
- 스테이지 환경 : stage-reader.dextto.com
- 프로덕션 환경 : prod-reader.dextto.com

```ts
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: (process.env.NODE_ENV === 'production') ? '.production.env'
      : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
```
NODE_ENV의 값에 따라서 동적으로 환경변수를 구성할 수 있다.
