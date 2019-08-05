import {Entity, model, property} from '@loopback/repository';
import {Geometry} from './geometry.model';
import {Properties} from './properties.model';

@model()
export class Land extends Entity {
  @property({
    type: 'string',
    required: true,
    id: true,
  })
  id: string;

  @property({
    required: true,
  })
  geometry: Geometry;

  @property({
    required: true,
  })
  properties: Properties;

  constructor(data?: Partial<Land>) {
    super(data);
  }
}
