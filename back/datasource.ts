import { DataSource } from 'typeorm';
import path from 'path';
import { Product } from 'src/entities/Product';

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '950403',
  database: 'aresa',
  entities: [Product],
  synchronize: false,
  logging: true,
});

export default dataSource;
dataSource
  .initialize()
  .then(() => console.log('Data Source has been initialized'))
  .catch((error) => console.error('Error initializing Data Source', error));
