# Controllers

## Controllers Loopback Doc

> This directory contains source files for the controllers exported by this app.
> To add a new empty controller, type in `lb4 controller [<name>]` from the command-line of your application's root directory.

For more information, please visit [Controller generator](http://loopback.io/doc/en/lb4/Controller-generator.html).

## Routes Documentation

### Add a route :

Decorators allow you to annotate your Controller methods with routing metadata, so LoopBack can call the app.route() function for you.

```js
import {get} from '@loopback/rest';

class MyController {
  @get('/greet', spec)
  greet(name: string) {
    return `hello ${name}`;
  }
}

// ... in your application constructor
this.controller(MyController);
```

Want to add a route ? Go to `land.controller` and add your `decorator` followed by your function (no matter its name).

### Write a `where` request

Loopback filter definition :

```js
export interface Filter<MT extends object = AnyObject> {
    /**
     * The matching criteria
     */
    where?: Where<MT>;
    /**
     * To include/exclude fields
     */
    fields?: Fields<MT>;
    /**
     * Sorting order for matched entities. Each item should be formatted as
     * `fieldName ASC` or `fieldName DESC`.
     * For example: `['f1 ASC', 'f2 DESC', 'f3 ASC']`.
     *
     * We might want to use `Order` in the future. Keep it as `string[]` for now
     * for compatibility with LoopBack 3.x.
     */
    order?: string[];
    /**
     * Maximum number of entities
     */
    limit?: number;
    /**
     * Skip N number of entities
     */
    skip?: number;
    /**
     * Offset N number of entities. An alias for `skip`
     */
    offset?: number;
    /**
     * To include related objects
     */
    include?: Inclusion<MT>[];
}
```

If it isn't existing at this point, you have to create the `filter` object and call `find()` method (exposed in `land.controller`) in order to access some lands (or other objects depending on filter).
`Where` conditions are syntactically identical than the ones in classic Mongo.

Note : In order to access nested object, see the following example : `.where({'properties.nests.year': year})`

Example : 

```js
// An example of a dynamique construction of filter.
  @get('/tests', {
    responses: {
      '200': {
        description: 'Example : Array of Land model instances matching the where condition',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Land}},
          },
        },
      },
    },
  })
  async findtest(
    // Insert param that could be retrieve in the request.
  ): Promise<Land[]> {
    const filterBuilder = new FilterBuilder<Land>();
    const filter = filterBuilder
      .limit(10)
      .offset(0)
      .order(['a ASC', 'b DESC'])
      .where({ID: "5cd001ee95bb0b432d17fb7b"})
      .build();
      console.log(filter);
    return await this.landRepository.find(filter);
  }
```


### How to test routes without authentication ?

You can create a folder named `test` in `lbcore\src`. Once done, create both `index.ts` and `[thecontrolleryouwanttotest].ts`. Then, just copy-paste the code of your controller in the .ts file, remove all ` @authenticate('jwt')` decorator in the file, and prefix every route in by `/test`. Finally, just rename the class of you controller by whatever-you-want, in order to avoid loopback confusing both classes. As example, for Land.controller.ts, you can rename the class Land by LandTest.
Dont forget to expose the controller in the `index.ts` you have created ! 
You can now access API without authentication via test routes.

As example, here is the code of test version of Land controller :

```js
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

export class LandController {
  constructor(
    @repository(LandRepository)
    public landRepository: LandRepository,
  ) {}

  @post('/test/lands', {
    responses: {
      '200': {
        description: 'Land model instance',
        content: {'application/json': {schema: {'x-ts-type': Land}}},
      },
    },
  })
  async create(@requestBody() land: Land): Promise<Land> {
    return await this.landRepository.create(land);
  }

  @get('/test/lands/count', {
    responses: {
      '200': {
        description: 'Land model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })

  async count(
    @param.query.object('where', getWhereSchemaFor(Land)) where?: Where,
  ): Promise<Count> {
    return await this.landRepository.count(where);
  }

  @get('/test/lands', {
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
  async find(
    @param.query.object('filter', getFilterSchemaFor(Land))
    filter?: Filter<Land>,
  ): Promise<Land[]> {
    return await this.landRepository.find(filter);
  }

  @patch('/test/lands', {
    responses: {
      '200': {
        description: 'Land PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })

  async updateAll(
    @requestBody() land: Land,
    @param.query.object('where', getWhereSchemaFor(Land)) where?: Where,
  ): Promise<Count> {
    return await this.landRepository.updateAll(land, where);
  }

  @get('/test/lands/{id}', {
    responses: {
      '200': {
        description: 'Land model instance',
        content: {'application/json': {schema: {'x-ts-type': Land}}},
      },
    },
  })

  async findById(@param.path.string('id') id: string): Promise<Land> {
    return await this.landRepository.findById(id);
  }

  @patch('/test/lands/{id}', {
    responses: {
      '204': {
        description: 'Land PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() land: Land,
  ): Promise<void> {
    await this.landRepository.updateById(id, land);
  }

  @put('/test/lands/{id}', {
    responses: {
      '204': {
        description: 'Land PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() land: Land,
  ): Promise<void> {
    await this.landRepository.replaceById(id, land);
  }

  @del('/test/lands/{id}', {
    responses: {
      '204': {
        description: 'Land DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.landRepository.deleteById(id);
  }
  
  @get('/test/lands/nests/atleastone', {
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

  @get('/test/lands/nests/year/', {
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
```




## Database set

CF => [data/Readme.md](/data/Readme.md)

## Application routes

CF => OpenAPI, when the server is running, try http://localhost:3000/explorer

## Various Tips

- The specs folder is used to store Schema, that is used to describe the form of an entry parameter and/or result. It's used by OpenAPI, please refer to their documentation.
