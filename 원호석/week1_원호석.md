# Weak1

## 1. Structure of NestJs

```` mermaid
flowchart TB

User((User))

subgraph NestJs App
    direction LR
    
    subgraph Module1
        direction TB
        Controller1
        Service1
        Repository1
    end
    subgraph Module2
        direction TB
        Controller2
        Service2
        Repository2
    end
    subgraph Module3
        direction TB
        Controller3
        Service3
        Repository3
    end
end

DB[(Database)]

User<-->Controller1<-->Service1<-->Repository1<-->DB
User<-->Controller2<-->Service2<-->Repository2<-->DB
User<-->Controller3<-->Service3<-->Repository3<-->DB

````
* Controller: Entry point to nest.js app. It handles user's request and, returns response to user.
* Service: Classes which execute business logic. The controllers handle 
user's request by pass request data to specific method of service. <br>
* Repository: Handle to database, 
<br>
* Module: Bind controllers, services, repositories  serving same domain together.
<br>

## 2. Make NestJs Project with Nest CLI

We can create new NestJS project with following command. 

```
  npx --package @nestjs/cli nest new <project name>
```

We can also create components like module controller, service... etc. as following.

```
  npx nest g <component name> <domain name>
```
## 3. Main Function

```
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from "./app.module";

    async function bootstrap() {
        const app = await NestFactory.create(AppModule);
        await app.listen(process.env.PORT ?? 3000);
    }
    
    bootstrap();
```

AppModule is a root module of the project.
Every module should be registered at AppModule as following:

```
    @Module({
        imports: [AModule, BModule,...],
    })
    export class AppModule {}
```

## 4. Module

Module is a class with annotation @Module.
Classes registered at module are managed by Nest Container.
You can share service with other modules by registering at exports field.

```
    @Module({
        controllers: [AController....],
        providers: [AModule....]
        exports: [....]
    })
    export class AModule {}
```

## 5. Controller

Controller is a class with annotation @Controller()

```
    @Controller('A') // common route to api
    export class AController {

        constructor(
            private readonly _aService: AService // injected by container
        ) {}

        @Get("/") // Path: /A
        async method1(): Response1 {...}
        
        @Post("/foo") // Path: /A/foo
        async method2(): Reponse2 {...}
}
```



















