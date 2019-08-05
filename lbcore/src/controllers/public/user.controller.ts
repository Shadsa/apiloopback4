// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {post, requestBody, HttpErrors} from '@loopback/rest';
import {User} from '../../models';
import {inject} from '@loopback/core';
import {TokenService, UserService} from '@loopback/authentication';
import {Credentials} from '../../models/credential';
import {TokenServiceBindings, UserServiceBindings} from '../../keys';
import {CredentialsRequestBody} from '../specs/user-controller.specs';

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
  ) {}

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService
      .verifyCredentials(credentials)
      .catch(val => {
        if(val === undefined){
          throw new HttpErrors.NotFound(
            `Error in authentication : User not found : ${val}`,
          );
        }
        else{
          throw new HttpErrors[401](
            `Error in authentication : Password invalid : ${val}`,
          );
        }
      });

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }
}
