import {Entity, model, property} from '@loopback/repository';
import {Nest} from './nest.model';
import {Region} from './region.model';
import {Coordinate} from './coordinate.model';

@model()
export class Properties extends Entity {
  @property({
    type: 'string',
    required: true,
    default: 'France',
  })
  country: string;

  @property({
    type: 'number',
    required: true,
    default: '',
  })
  dep: number;

  @property({
    type: Region,
    required: true,
    default: '',
  })
  region: Region;

  @property({
    type: 'number',
    required: true,
  })
  geoType: number;

  @property({
    type: 'number',
    required: true,
  })
  family: number;

  @property.array(Nest)
  nests: Nest[];

  @property.array(Coordinate)
  neighbours: Coordinate[];

  constructor(data?: Partial<Properties>) {
    super(data);
  }
}
