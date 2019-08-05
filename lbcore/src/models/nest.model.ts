import {Entity, model, property} from '@loopback/repository';

@model()
export class Nest extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  year: number;

  @property({
    type: 'string',
    require: true,
  })
  species: string;

  @property({
    type: 'number',
    required: true,
  })
  count: number;

  constructor(data?: Partial<Nest>) {
    super(data);
  }
}
