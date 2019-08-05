# Services

## What are services ?

Services are Third-Party providers libraries and/or utilities tools. They are not linked to Loopback itself, but still can use any of Loopback functionality such as decorator, direct DB access, etc... It also has to mach the expected class patern in Typescript. 

## How to use it ?

You don't have to do anything special : once a Services is fully functional, you can include it in any Loopback component and use it exactly as a Library in Java or any other language.

## Tips and tricks

* If you need to use an object in a Promise or a function, then you should create it in the "hard" way, and don't put in the constructor. For example :

```js
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
```
Here, we have to declare the ldap Object with a const before typing our class. It the opposite of the foolowing :

```js
 constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {}

```

The inject here stand for a dynamical construction. It mean that we don't know when a specific object will be avaible, and so it's forbiden in Promise (it could cause a Promise never ended).

* You can also send Promise as a response from a function like that : ` async verifyCredentials(credentials: Credentials): Promise<User>`. It's handled pretty well and it simplify a lot the code.