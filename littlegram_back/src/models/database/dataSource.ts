import { DataSource } from 'typeorm';

const connectionSource = new DataSource({
  type: 'sqlite',
  database: 'src/models/database/db.sqlite',
  migrations: ['src/models/database/migrations/*.ts'],
  entities: ['src/models/entities/*.ts'],
});

connectionSource.initialize().then(() => {
  console.log('database connection established');
});

export { connectionSource };
