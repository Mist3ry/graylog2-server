// @flow strict
import * as Immutable from 'immutable';
import AuthenticationBackend from 'logic/authentication/AuthenticationBackend';

const ldapService = AuthenticationBackend
  .builder()
  .id('ldap-service-id')
  .title('LDAP Service')
  .description('LDAP service description')
  .config({
    type: 'ldap',
    serverUri: 'ldap://localhost:389',
    systemUsername: 'uid=admin,out=system',
    encryptedSystemPassword: 'encrypted-password',
    userSearchBase: 'dc=example,dc=com',
    userSearchPattern: '(&(|(objectClass=inetOrgPerson))(uid={0}))',
    displayNameAttribute: 'cn',
  })
  .build();

const activeDirectoryService = AuthenticationBackend
  .builder()
  .id('ad-service-id')
  .title('Active Directory Service')
  .description('Active directory service description')
  .config({
    type: 'active-directory',
    serverUri: 'ldap://localhost:389',
    systemUsername: 'uid=admin,out=system',
    encryptedSystemPassword: 'encrypted-password',
    userSearchBase: 'dc=example,dc=com',
    userSearchPattern: '(&(|(objectClass=inetOrgPerson))(uid={0}))',
    displayNameAttribute: 'cn',
  })
  .build();

const services = Immutable.List<AuthenticationBackend>([ldapService, activeDirectoryService]);

export { ldapService, activeDirectoryService, services };
