# Week5

## 설치

```bash
npm install typeorm reflect-metadata
npm install @nestjs/typeorm typeorm mysql2 # NestJS + MySQL 예시
```

> `reflect-metadata` -> 데코레이터 사용 위해 필요

---

## 기본 설정

### 1. Standalone
```ts
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'test_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
});
```

### 2. NestJS 
```ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'test_db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

---

## Entity 정의

```ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: "integer" }) // 타입지정가능
  id: number;
  
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true }) //default false
  age?: number;
  
  @Column({ name: "profile_picture" }) // 손쉽게 cammel case & snake case 호환 가능
  profilePicture: string;
}
```

---

## Table 연관

### 1. OneToOne
```ts
@OneToOne(() => Profile)
@JoinColumn()
profile: Profile;
```

### 2. OneToMany & ManyToOne
```ts
@OneToMany(() => Post, post => post.user)
posts: Post[];

@ManyToOne(() => User, user => user.posts)
user: User;
```

### 3. ManyToMany
```ts
@ManyToMany(() => Category)
@JoinTable()
categories: Category[];
```

---

## Repository 사용법

### 1. 기본 Repository 사용
```ts
const userRepo = dataSource.getRepository(User);
const users = await userRepo.find();
```

### 2. NestJS에서 Repository 주입
```ts
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepo.find();
  }
}
```

---

## QueryBuilder 예제
```ts
const users = await dataSource
  .getRepository(User)
  .createQueryBuilder('user')
  .where('user.age > :age', { age: 20 })
  .getMany();
```

---

## 기타 기능

- `@CreateDateColumn()` / `@UpdateDateColumn()` 자동 타임스탬프
- `@BeforeInsert()` / `@AfterLoad()` 훅 지원
- Soft Delete (`softRemove`, `@DeleteDateColumn()`)

---

## 트랜잭션
```ts
await dataSource.transaction(async (manager) => {
  const user = manager.create(User, { name: 'Tom' });
  await manager.save(user);
});
```

---

## 고급 쿼리 & 최적화

### 1. `select`, `leftJoinAndSelect`으로 필요한 데이터만 가져오기
```ts
await userRepo
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.profile', 'profile')
  .select(['user.id', 'user.name', 'profile.bio'])
  .getMany();
```

### 2. Pagination (페이지네이션)
```ts
const [users, total] = await userRepo.findAndCount({
  skip: (page - 1) * limit,
  take: limit,
});
```

### 3. Index 설정
```ts
@Entity()
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
}
```

### 4. Lazy Loading (지연 로딩)
```ts
@ManyToOne(() => Profile, { lazy: true })
profile: Promise<Profile>;

const user = await userRepo.findOneBy({ id: 1 });
const profile = await user.profile; // 접근 시점에 로딩됨
```

### 5. Raw SQL 사용
```ts
const result = await dataSource.query('SELECT * FROM user WHERE age > ?', [20]);
```

### 6. 서브쿼리
```ts
const users = await userRepo
  .createQueryBuilder('user')
  .where(qb => {
    const subQuery = qb.subQuery()
      .select('sub.id')
      .from(User, 'sub')
      .where('sub.age > :minAge', { minAge: 30 })
      .getQuery();
    return 'user.id IN ' + subQuery;
  })
  .getMany();
```

### 7. 쿼리 캐싱
```ts
const users = await userRepo
  .createQueryBuilder('user')
  .cache(true) // 기본 TTL 적용 (default: 1000ms)
  .getMany();

// TTL 설정 및 식별자 지정
const result = await userRepo
  .createQueryBuilder('user')
  .cache('users_above_30', 5000)
  .where('user.age > :age', { age: 30 })
  .getMany();
```

---

## 참고 링크
- 공식문서: [https://typeorm.io](https://typeorm.io)
- GitHub: [https://github.com/typeorm/typeorm)
