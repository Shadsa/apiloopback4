// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {Credentials} from '../models/credential';
import {User} from '../models/user.model';
import {UserService, UserProfile} from '@loopback/authentication';
import {LDAP} from './ldap-service';
const ldap: LDAP = new LDAP();

export class MyUserService implements UserService<User, Credentials> {
  async verifyCredentials(credentials: Credentials): Promise<User> {
    const proms = new Promise<User>((resolve, reject) => {
      ldap
        .authentication(credentials)
        .then(val => {
          let foundUser: User = new User();
          foundUser.email = val.mail;
          foundUser.firstName = val.givenName;
          foundUser.lastName = val.sn;
          foundUser.id = val.uid;
          resolve(foundUser);
        })
        .catch(val => {
          reject(val);
        });
    });
    return proms;
  }

  /**
   * Used to generate the JWT's body
   * @param user Comes from LDAP
   */
  convertToUserProfile(user: User): UserProfile {
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    };
  }
}
