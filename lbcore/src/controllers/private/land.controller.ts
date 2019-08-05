import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  FilterBuilder,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Land} from '../../models';
import {LandRepository} from '../../repositories';
import {authenticate} from '@loopback/authentication';

export class LandController {
  constructor(
    @repository(LandRepository)
    public landRepository: LandRepository,
  ) {}

  @post('/lands', {
    responses: {
      '200': {
        description: 'Land model instance',
        content: {'application/json': {schema: {'x-ts-type': Land}}},
      },
    },
  })
  @authenticate('jwt')
  async create(@requestBody() land: Land): Promise<Land> {
    return await this.landRepository.create(land);
  }

  @get('/lands/count', {
    responses: {
      '200': {
        description: 'Land model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(Land)) where?: Where,
  ): Promise<Count> {
    return await this.landRepository.count(where);
  }

  @get('/lands', {
    responses: {
      '200': {
        description: 'Array of Land model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Land}},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(Land))
    filter?: Filter<Land>,
  ): Promise<Land[]> {
    return await this.landRepository.find(filter);
  }

  @patch('/lands', {
    responses: {
      '200': {
        description: 'Land PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody() land: Land,
    @param.query.object('where', getWhereSchemaFor(Land)) where?: Where,
  ): Promise<Count> {
    return await this.landRepository.updateAll(land, where);
  }

  @get('/lands/{id}', {
    responses: {
      '200': {
        description: 'Land model instance',
        content: {'application/json': {schema: {'x-ts-type': Land}}},
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.string('id') id: string): Promise<Land> {
    return await this.landRepository.findById(id);
  }

  @patch('/lands/{id}', {
    responses: {
      '204': {
        description: 'Land PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() land: Land,
  ): Promise<void> {
    await this.landRepository.updateById(id, land);
  }

  @put('/lands/{id}', {
    responses: {
      '204': {
        description: 'Land PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() land: Land,
  ): Promise<void> {
    await this.landRepository.replaceById(id, land);
  }

  @del('/lands/{id}', {
    responses: {
      '204': {
        description: 'Land DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.landRepository.deleteById(id);
  }

  @get('/lands/nests/atleastone', {
    responses: {
      '200': {
        description:
          'Array of Land model wich contain at least one nest, disregarding the year',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Land}},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findWithOneNest(): // Insert param that could be retrieve in the request.
  // Like : @param.path.number('id') id: string
  Promise<Land[]> {
    const filterBuilder = new FilterBuilder();
    const filter = filterBuilder
      .offset(0)
      .order(['a ASC', 'b DESC'])
      .where({'properties.nests.species': 'Vespa_velutina_nigrithorax'})
      .build();

    return await this.landRepository.find(<Filter<Land>>filter);
  }

  @get('/lands/nests/year/', {
    responses: {
      '200': {
        description:
          'Array of Land model wich contain at least one nest, regarding of the year',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Land}},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findWithOneNestAtAYear(
    // Insert param that could be retrieve in the request.
    @param.query.number('year') year: number,
  ): Promise<Land[]> {
    const filterBuilder = new FilterBuilder();
    const filter = filterBuilder
      .offset(0)
      .order(['a ASC', 'b DESC'])
      .where({'properties.nests.year': year})
      .build();

    return await this.landRepository.find(<Filter<Land>>filter);
  }
}
