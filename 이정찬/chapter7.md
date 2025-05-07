## 파이프
> 요청 데이터가 컨트롤러(라우터 핸들러)로 전달되기 전에 가공하거나 검증하는 도구, 미들웨어와 비슷하다.

- 입력 데이터의 변환
- 유효성 검사
등에 활용할 수 있다.

@nest/common는 내장 파이프를 제공한다.
- ValidationPipe : 	DTO 기반 유효성 검사 실행 (class-validator 필요)
- ParseIntPipe : 문자열을 number 타입으로 변환 (parseInt)
- ParseBoolPipe : 문자열 "true" / "false"를 boolean으로 변환
- ParseArrayPipe : 문자열 배열을 Array로 변환 (query=1,2,3 → [1, 2, 3])
- ParseUUIDPipe : 	UUID 형식이 맞는지 검증
- DefaultValuePipe : 값이 undefined일 경우 기본값 설정

ParseIntPipe 예시
```ts
@Get(':id')
getUser(@Param('id', ParseIntPipe) id: number) {
  // '/users/10' → id: 10 (number)
}
```
id에 문자열을 전달한다면 에러가 발생한다. 

### 커스텀 파이프로 내부 구현 이해하기

커스텀 파이프는 PipeTransform를 상속받아 @Injectable 데커레이터를 선언해 구현한다.
```ts
import { ArgumentMetadata,Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(metadata);
    return value;
  }
```

PipeTransform은 다음과 같이 구성되어 있다.  
value : 현재 파이프에 전달된 인수  
metadata : 현재 파이프에 전달된 인수의 메타데이터
```ts
export interface PipeTransform<T = any, R = any> {
    transform(value: T, metadata: ArgumentMetadata): R;
}
```

메타데이터에 해당하는 ArgumentMetadata는 다음과 같이 구성되어 있다.  
type : 전달된 인수가 본문, 쿼리, 매개변수인지 나타냄   
metatype : 라우트 핸들러에 정의된 인수의 타입을 나타냄  
data : 데커레이터에 전달된 매개변수의 이름

```ts
export interface ArgumentMetadata {
    readonly type: Paramtype;
    readonly metatype?: Type<any> | undefined;
    readonly data?: string | undefined;
}
```

id 파라미터를 받아 유저 정보를 가져오는 핸들러를 예로 들면
```ts
@Get(':id')
findOne(@Param('id', validationPipe) id: number) {
  return this.usersService.findOne(id);
}
```
GET /users/1 요청 시
```bash
{ metatype: [Function: Number], type: 'param', data: 'id' }
```
다음과 같은 결과가 나오게 된다.

#### validationpipe 직접 구현하기

유효성 검사를 진행할 class-validator를 사용해서 dto를 구성해준다.
```ts
import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly name: string;

  @IsEmail()
  email: string;
}
```

- toValidate함수를 통해 metatype을 검사  
- plainToClass 함수 => 자바스크립트 객체를 글래스의 객체로 변환  
- 유효성 검사에 통화했다면 값을 전달
```ts
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```
만든 ValidationPipe를 사용해보자
```ts
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
```
잘못된 값 ( name 값 )을 전달하면 오류가 발생한다.
![image](https://github.com/user-attachments/assets/584560e1-fe9b-4e45-b6b4-ed5df743215e)

