import {Entity, model, property} from '@loopback/repository';
import {Coordinate} from './coordinate.model';

@model()
export class Geometry extends Entity {
  @property({
    type: 'string',
    required: true,
    default: 'Polygon',
  })
  type: string;

  @property.array(Coordinate)
  coordinates: Coordinate[];

  constructor(data?: Partial<Geometry>) {
    super(data);
  }
}
