# Weak1

### 1. Structure of Nest.js

```` mermaid
flowchart TB

User((User))

subgraph Nest.js App
    direction LR
    
    subgraph Module1
        direction TB
        Controller1<-->Service1<-->Repository1
    end
    subgraph Module2
        direction TB
        Controller2<-->Service2<-->Repository2
    end
    subgraph Module3
        direction TB
        Controller3<-->Service3<-->Repository3
    end
end

subgraph DB Server
    DB[(Database)]
end

User<-->Controller1
User<-->Controller2
User<-->Controller3

DB<-->Repository1
DB<-->Repository2
DB<-->Repository3

````
### 2. Components of Nest.js

* Controller: Entry point to nest.js app. It handles user's request and, returns response to user.
<br>
* Provider
  - Service: Classes, which manipulate data. The controllers handle user's request by pass request data to specific method of service.
  - Repository: Classes manipulate database.
<br>
* Module: Bind controllers and providers serving same domain.
<br>
++ One can create each component by following nestjs cli: 
````
    nest g <component name> <domain name>
````











