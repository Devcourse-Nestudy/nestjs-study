import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  entities: [new URL('./**/*.entity{.ts,.js}', import.meta.url).pathname],
  synchronize: false,
});
