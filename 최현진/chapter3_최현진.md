## Chap3. 인터페이스

### 3.1 컨트롤러

클라이언트 요청을 처리하고 적절한 서비스 로직을 호출하여 응답을 반환

### 3.1.1 라우팅

@Controller, @Get, @Post 등의 인수를 통해 정의

### 3.1.2 와일드 카드 사용

와일드 카드는 라우트 경로에 유연성을 부여

```ts
@Get('docs/*')
getDocsWildcard() {
  return '와일드 카드로 매칭되는 문서';
}
```

### 3.1.3 요청 객체

NestJS는 기본적으로 Express의 Request 객체를 사용 가능하나 직접 다루는 경우는 드물고 보통 @Query(), @Param(), @Body() 등의 데커레이터를 이용

```ts
@Get()
getUser(@Req() req: Request) {
  return req.headers;
}
```

### 3.1.4 응답

string, number, boolean과 같이 원시 타입을 리턴하면 직렬화 없이 바로 보내지만, 객체를 리턴하는 경우 직렬화를 통해 JSON으로 자동 변환함

### 3.1.5 헤더

응답 헤더를 자동으로 구성해주며, 만약 커스텀 헤더를 추가하고 싶으면 @Header 데커레이터 사용(인수로는 헤더 이름과 값을 받음)

```ts
@Header("Custom", "test header")
@Get()
...
```

### 3.1.6 리디렉션

요청 처리 후 클라이언트를 다른 페이지로 이동시키는 경우 @Redirect 데커레이터 사용

```ts
@Redirect("https://nestjs.com", 301)
@Get()
...
```

만약 동적으로 처리하려면 응답으로 다음과 같은 객체를 리턴

```ts
{
    url: string,
    statusCode: number
}
```

쿼리 매개변수로 버전 숫자를 전달받아 해당 버전 페이지로 이동하는 예시

```ts
@Get("redirect/docs")
@Redirect("https://docs/nestjs.com",302)
getDocs(@Query("version") version) {
    if (version && version === "5") {
        return {url: "https://docs.nestjs/com/v5/"};
    }
}
```

### 3.1.7 라우트 매개변수

경로 변수는 @Param() 데코레이터를 통해 접근

```ts
@Get(':id')
getUserById(@Param('id') id: string) {
  return `User ID: ${id}`;
}
```

### 3.1.8 하위 도메인 라우팅

@Controller 데커레이터는 ControllerOptions 객체를 인수로 받으며, host 속성에 하위 도메인을 작성하면 응답을 다르게 줄 수 있음

```ts
@Controller({host: 'api.example.com'})
export clas ApiController {
    @Get()  // 같은 루트 경로
    index(): string {
        return "test"  // 다른 응답
    }
}
```

### 3.1.9 페이로드 다루기

POST, PUT 등의 요청에서 본문 데이터를 다룰 땐 @Body()를 사용

```ts
@Post()
createUser(@Body() body: CreateUserDto) {
  ...
}
```
