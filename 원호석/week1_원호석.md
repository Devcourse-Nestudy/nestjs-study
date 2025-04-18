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

We can also create components like module controller, service... etc as follow.

```
  npx nest g <component name> <domain name>
```

















