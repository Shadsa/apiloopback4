import {DefaultCrudRepository} from '@loopback/repository';
import {Land} from '../models';
import {MongoDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LandRepository extends DefaultCrudRepository<
  Land,
  typeof Land.prototype.id
> {
  constructor(@inject('datasources.MongoDB') dataSource: MongoDbDataSource) {
    super(Land, dataSource);
  }
}
