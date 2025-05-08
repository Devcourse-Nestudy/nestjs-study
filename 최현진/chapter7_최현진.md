### Pipe

요청이 라우터 핸들러로 전달되기 전에 요청 객체를 변환할 수 있는 기회를 제공함

미들웨어의 역할과 비슷하나 미들웨어는 해당 요청의 실행 콘텍스트를 모르기 때문에 애플리케이션의 모든 컨텍스트에서 실행할 수는 없음

### 내장 파이프

```
- ValidationPipe
- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe
```

### 전달된 인수 타입 검사 (Parse\*Pipe)

클래스로 전달

```ts
@Get(":id")
findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
}
```

직접 생성한 파이프 객체 전달

```ts
@Get(":id")
findOne(@Param("id", new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number) {
    return this.usersService.findOne(id);
}
```

### DefaultValuePipe

- 인수에 기본값 설정

유저 목록 조회에 오프셋 기반 페이징을 사용하는 경우

```ts
@Get()
findAll(
    @Query("offset", new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
) {
    return this.usersService.findAll();
}
```

### PipeTransform

```ts
export interface PipeTransform<T = any, R = any> {
  transform(value: T, metadata: ArgumentMetadata): R;
}
```

- value: 현재 파이프에 전달된 인수
- metadata: 현재 파이프에 전달된 인수의 메타데이터

### 커스텀 파이프

PipeTransform 인터페이스를 상속받은 클래스에 @Injectable 데커레이터를 사용하여 구현
