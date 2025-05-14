## 영속화 : 데이터베이스 다루기
Nest는 다양한 데이터베이스와 연결할 수 있다. 보통은 상황에 따라 TypeORM, Prisma, Sequelize 등을 사용한다.
typeORM은 가장 많이 쓰이는 ORM으로 Nest에서는 typeORM을 주로 사용한다. 최근에는 Prisma가 대체안으로 떠오르고 있다.

### ORM(object-relational mapping) 이란?
ORM은 단어 그대로 객체 관계 매핑이라는 뜻으로 데이터베이스의 관계를 객체로 바꾸어 개발자가 OOP로 데이터베이스를 쉽게 다룰 수 있도록 해주는 도구이다.
개발자는 ORM에서 제공하는 인터페이스를 통해 일반적인 라이브러리를 호출하듯이 DB에 데이터를 업데이트하고 조회할 수 있다.

### typeORM 사용해보기
typeORM을 통해 데이터베이스를 연동하는 방식은 mysql을 연동하는 방식과 유사하다.
다음과 같이 TypeOrmModule을 이용하여 DB를 연결할 수 있다.
```ts
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'test',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 엔티티 참조
      synchronize: true,
    })
```
mysql을 연동하는 방식과 다른 점은 entities를 사용한다는 것이다.
typeORM은 엔티티를 기반으로 데이터를 다룬다.

synchronize 옵션은 서비스 구동 시에 소스 코드 기반으로 데이터베이스 스키마를 동기화할지 여부이다.

#### 엔티티를 사용해서 유저정보 저장

유저 엔티티 정의
```ts
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  password: string;

  @Column({ length: 60 })
  signupVerifyToken: string;
}
```
위 엔티티를 구성하고 코드를 실행하면 User테이블이 생성된다.
![image](https://github.com/user-attachments/assets/3ba3db6a-29d8-4f1a-a6ab-fe37492ac3f2)

#### 유저생성 API 구성
우선 UserModule에서 엔티티에 대한 저장소를 등록해준다.
```ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]), // 저장소 등록
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
```

UserService의 생성자에 @InjectRepository 데커레이터로 유저 저장소를 주입한다.
usersRepository를 통해 DB에 접근 가능하다.
```ts
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>, //
    private dataSource: DataSource,
  )
```

다음과 같이 유저 생성 메서드를 구성할 수 있다.
```ts
  private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }
```

### 트랜잭션 적용
> 트랜잭션은 요청을 처리하는 과정에서 데이터베이스에 변경이 일어나는 요청을 독립적으로 분리하고
에러가 발생하면 이전 상태로 되돌리기 위해 **데이터베이스**에서 제공하는 기능이다. 원자성을 가지며 전부 성공하거나 전부 실패하게 만든다.

typeORM에서는 2가지 방법으로 트랜잭션을 사용한다.

#### QueryRunner
DataSource 객체를 이용한 수동 트랜잭션 처리 방식으로 Nest에서 권장하는 방법이다.

DataSource 객체 주입
```ts
export class UsersService {
  constructor(
    private dataSource: DataSource,
  )
```

트랜잭션 구성하기
```ts
constructor(private dataSource: DataSource) {}

async registerUser() {
  const queryRunner = this.dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 1. 사용자 저장
    await queryRunner.manager.save(User, userData);

    // 2. 토큰 저장
    await queryRunner.manager.save(VerifyToken, tokenData);

    // 3. 성공하면 커밋
    await queryRunner.commitTransaction();
  } catch (e) {
    // 실패하면 롤백
    await queryRunner.rollbackTransaction();
    throw e;
  } finally {
    await queryRunner.release(); // 반드시 연결 해제
  }
}
```
사용자 저장 -> 토큰 저장 과정을 가지는 registerUser가 있을 때 다음과 같이 try catch문을 사용해서 트랜잭션을 구성할 수 있다.

#### transaction 함수 사용하기
dataSource 객체 내의 transaction 함수를 사용하는 방법이다.  
transaction 함수는 주어진 함수 실행을 트랜잭션으로 래핑하는 역할을 한다. 모든 데이터베이스 연산은 제공된 엔티티 매니저를 실행해야 한다는 제한사항이 있고
transaction 함수는 엔티티 매니저를 콜백으로 받아서 함수를 작성한다.

```ts
  private async saveUserUsingTransaction(name: string, email: string, password: string, signupVerifyToken: string) {
    await this.dataSource.transaction(async manager => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);

      // throw new InternalServerErrorException();
    })
  }
```
다음과 같이 함수를 수행한 뒤 manager를 통해 트랜잭션을 구성한다.

### 마이그레이션
넓은 의미에서 마이그레이션은 인프라를 교체하는 것을 말한다. 데이터베이스를 다룰 때에도 자주 마이그레이션을 하게 되는데, 서비스 개발 시 데이터베이스
스키마를 변경할 일이 빈번하게 발생하는 것이 그 경우 중 하나이다. 이 과정 역시 마이그레이션이라고 부른다.  
  
TypeORM은 직접 SQL문을 작성하거나 스키마에 관여하지 않아도 마이그레이션을 쉽고 안전하게 하는 방법을 제공한다.

먼저 package.json의 script의 다음을 추가한다
```ts
"typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js"
```
> -d 옵션은 typeORM의 0.3.x 버전부터는 사용하지 않는다.
ormconfig.ts를 다음과 같이 구성한다.
```ts
import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/**/migrations/*.js'],
  migrationsTableName: 'migrations',
});

export default AppDataSource;
```
전에 생성했던 User를 Drop하고 실험해보았다. ( typeORM의 버전 차이 때문에 CLI를 직접 실행했음)

다음 명령어를 실행
```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./src/migrations/CreateUserTable -d ./ormconfig.ts
```

src/migrations에 다음과 같은 내용을 가진 파일이 생성되었다.
```ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1747232979332 implements MigrationInterface {
    name = 'CreateUserTable1747232979332'

    // 테이블 생성 코드
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`User\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(30) NOT NULL, \`email\` varchar(60) NOT NULL, \`password\` varchar(30) NOT NULL, \`signupVerifyToken\` varchar(60) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }
    // 테이블 삭제 코드
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`User\``);
    }

}
```

마이그레이션을 수행하기 위해 테이블을 생성
```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./ormconfig.ts
```
테이블이 생성된 모습
User 테이블과 마이그레이션 이력이 기록된 migrations 테이블이 생성되었다.
![image](https://github.com/user-attachments/assets/22a699f2-18b1-4793-982d-8f33f54fd3fe)
![image](https://github.com/user-attachments/assets/42c5f123-bf3f-4269-8c34-eba524c67e72)


마이그레이션 되돌리기
```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert -d ./ormconfig.ts
```

User테이블과 migration 이력이 삭제된 모습
![image](https://github.com/user-attachments/assets/79ede991-e95c-43ff-955a-6392b66bd15d)
![image](https://github.com/user-attachments/assets/41a5b402-ef96-4fb1-992a-41aef90085cf)

## 추가 : 저장소 패턴
> 저장소 패턴은 데이터베이스와 같은 저장소를 다루는 로직을 분리하여 핵심 비즈니스 로직에 집중할 수 있도록 한다.

저장소는 보통 인터페이스를 통해서 데이터를 처리하도록 **추상화**되어 있어 데이터 저장소를 변경하기 쉽다는 장점이 있다.

비즈니스 로직을 처리하는 클라이언트는 직접 데이터 소스를 다루지 않고 저장소를 활용하여 엔티티를 영속화하고 데이터를 전달받는다.  
즉, 데이터를 데이터베이스에 저장하기 쉽게 매핑하고 쿼리 결과를 클라이언트가 원하는 방식으로 가공해준다.
MySQL -> PostgreSQL로 변경하고자 한다면 클라이언트와 인터페이스는 그대로 두고 데이터베이스 구현부만 적합하게 변경하면 된다.
