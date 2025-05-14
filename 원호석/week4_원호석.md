# Week4

## 환경 변수 관리 
- api key 같은 민감한 정보는 .env 파일에 저장한다.
- .env 파일을 .gitignore 파일에 추가하여, 민감한 정보가 github repository에 공개되지 안도록 한다.

```env
#.env
PORT=3000
DB_HOST=localhost
```
`dotenv`를 이용하면 .env에 저장한 환경변수를 쉽게 읽어올 수 있다.

```bash
# 설치
npm i dotenv
```

```ts
// app.module.ts
import { config } from "dotenv";
import Module from "@nestjs/common";
import * as process from "node:process";

config({path: "path_to_.env"}); // path -> .env 파일 경로, 미설정시 os 환경변수 읽어옴

console.log(process.env.PORT) // 읽어온 환경변수의 타입은 string | undefined이다. 
// number 값이 필요하면 Number()로 감싸주거나 parseInt 함수를 사용하면 된다.

// 루트 모듈에 하위 모듈이 등록되기 전에 읽어주어야 오류가 없다.
@Module({})
export class AppModule {
}
```

---

## Dynamic Module
- 런타임 시 모듈의 설정을 동적으로 구성. 
- 이는 라이브러리 형태로 제공되는 모듈에서 유용.

### 기본 구조

```ts
// my.module.ts
import { Module, DynamicModule } from '@nestjs/common';

@Module({})
export class MyModule {
  static register(options: MyModuleOptions): DynamicModule {
    return {
      module: MyModule,
      providers: [
        {
          provide: 'OPTIONS',
          useValue: options,
        },
      ],
      exports: ['OPTIONS'],
    };
  }
}
```

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { MyModule } from './my.module';

@Module({
  imports: [
    MyModule.register({
      apiKey: '123456',
    }),
  ],
})
export class AppModule {}
```

외부 모듈 및 라이브러리는 대부분 Dynamic Module의 형태로 제공된다.

### TypeOrmModule

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from "dotenv";
import * as process from "node:process";

config({path: "path_to_.env"});

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: ["/**/*.model{.js,.ts}"] // 엔티티 클래스 경로
            }),
        }),
    ],
})
export class AppModule {}
```

하위 모듈에서 사용하고 싶을 시 아래와 같이 등록한다.

```ts
// users.module.ts
import { Module } from '@nestjs/common';
import { User } from "./user.model";
import { UsersService } from './users.service';
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}

```

`@InjectRepository` 데코레이터를 이용하여 의존성을 주입할 수 았다.

```ts
// users.service.ts
import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.model";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) // parameter로 엔티티 클래스를 넣어준다.
        private readonly _usersRepos: Repository<User>,
    ) {}
}

```

---

## Pipe 
- 입력 데이터의 변환 및 유효성 검사를 담당. 
- 대부분의 경우 , 직접 구현하지 않고 nest.js 에서 기본적으로 제공하는 `ValidationPipe` class를 이용  

```ts
import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return createUserDto;
  }
}
```

**Warning**
`@Res()` 데코레이터 사용시 등록한 파이프를 전부 우회한다.

---

## Global Validation Pipe

`main.ts`에서 전역 파이프 설정 가능

```ts
// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
```

---

## Custom Pipe

```ts
// parse-int.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed (numeric string is expected)');
    }
    return val;
  }
}
```

```ts
// controller.ts
@Get(':id')
getUser(@Param('id', ParseIntPipe) id: number) {
  return `User ID: ${id}`;
}
```

---

## class-validator & class-transformer

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   

### 설치

```bash
npm i class-validator class-transformer
```

아래 옵션을 활성화 해야 한다.

```tsconfig.json
{
   "emitDecoratorMetadata": true
}
```

### 유효성 검사 데코레이터 (class-validator)
- `@IsString()` : 문자열 여부 확인
- `@IsInt()` : 정수 여부 확인
- `@IsEmail()` : 이메일 형식 검사
- `@MinLength(n)` / `@MaxLength(n)` : 문자열 길이 제한
- `@IsOptional()` : 적용시 다른 validator 전부 무시
- `@Matches(/regex/)` : 정규식 검사 등
- `@ValidateNested({ each: boolean  })` : 중첩객체 검사, 중첩객체의 배열 검사시 each 옵션을 true로 설정 (default: false)

### 변환 기능 (class-transformer)
- `@Expose({ name: "property_name_for_plain" })`: 프로퍼티 이름을 변환할 수 있다.
- `@Type(() => Type)` : 문자열을 숫자, Date 등으로 자동 변환
- `@Transform(({ value }) => ...)` : 커스텀 변환

```ts
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Expose, Type, plainToInstance } from "class-transformer";

export class Genre {
    @IsNumber()
    id: number;
    @IsString()
    name: string;
}

export class Content {
    @IsNumber()
    id: number;
    
    @IsString()
    @Transform(s => s.toLowerCase()) // @Transform를 이용하여 대문자를 모두 소문자로 변경
    title: string;

    @IsString()
    @IsOptional()
    overview: string | null;

    @IsString()
    @IsOptional()
    @Expose({ name: "poster_path" }) // @Expose 데코레이터를 이용하여 snake case 키값을 camel case로 변한
    posterPath: string | null;

    @ValidateNested({ each: true })
    @Type(() => Genre)
    genres: Genre[];
}

async function example(data: any) {
    const content = plainToInstance(Content, data); // dto class로 변환
    await validateOrReject(content); // 유효성 검사 실패시 예외 던짐
    const errs: Error[] = await validate(content); // 유효성 검사 통과시 errs.length === 0
}

```
---

## 참고
