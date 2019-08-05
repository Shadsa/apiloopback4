import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';

export class MongoDbDataSource extends juggler.DataSource {
  static dataSourceName = 'MongoDB';

  constructor(
    @inject('datasources.config.MongoDB', {optional: true})
    dsConfig: object = {
      name: 'mongo',
      connector: 'mongodb',
      url: '',
      host: process.env.DB_HOST ? process.env.DB_HOST : '127.0.0.1',
      port: process.env.DB_PORT ? process.env.DB_PORT : 27017,
      user: process.env.DB_USER ? process.env.DB_USER : 'admin',
      password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'admin',
      database: process.env.DB_NAME ? process.env.DB_NAME : 'mmwdb',
    },
  ) {
    super(dsConfig);
  }
}
