// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey} from '@loopback/context';
import {TokenService, UserService} from '@loopback/authentication';
import {User} from './models';
import {Credentials} from './models/credential';

// TODO: maybe in environment variable too ?
export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = '8LepHdW?T=5(#K$h';
  // token expires in seconds
  export const TOKEN_EXPIRES_IN_VALUE = '3600';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service',
  );
}
