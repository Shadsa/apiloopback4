import {Entity, model, property} from '@loopback/repository';

@model()
export class Coordinate extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  lng: number;

  @property({
    type: 'number',
    required: true,
  })
  lat: number;

  constructor(data?: Partial<Coordinate>) {
    super(data);
  }
}
