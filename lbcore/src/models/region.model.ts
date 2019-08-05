import {Entity, model, property} from '@loopback/repository';

@model()
export class Region extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  code: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  constructor(data?: Partial<Region>) {
    super(data);
  }
}
