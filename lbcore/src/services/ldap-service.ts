const LdapAuth = require('ldapauth-fork');
import {Credentials} from '../models/credential';
import {Error} from 'ldapjs';

const options = {
  url: 'ldap://innovation-factory.io:389/',
  bindDN: 'cn=reader,dc=innovation-factory,dc=io',
  bindCredentials: 'S@geti34!',
  searchBase: 'dc=innovation-factory,dc=io',
  searchFilter: '(uid={{username}})',
};

/* TODO:
- Use environement variables instead of hard coded credentials
- Example :
const options = {
  url: process.env.LDAP_URL,
  bindDN: process.env.LDAP_BINDDN,
  bindCredentials: process.env.LDAP_BINDCREDENTIALS,
  searchBase: process.env.LDAP_SEARCHBASE,
  searchFilter: process.env.LDAP_SEARCHFILTER,
};
*/
const ldap = new LdapAuth(options);

export type userLDAPSogeti = {
  dn: string;
  controls: [];
  objectClass: [];
  sn: string;
  givenName: string;
  mail: string;
  uid: string;
  cn: string;
  userPassword: string;
};

export class LDAP {
  constructor() {}

  public async authentication(credentials: Credentials) {
    return new Promise<userLDAPSogeti>((resolve, reject) => {
      ldap.authenticate(
        credentials.username,
        credentials.password,
        (err: Error, user: userLDAPSogeti) => {
          if (err != null) {
            reject(err.code);
          } else {
            resolve(user);
          }
        },
      );
    });
  }
}
