// @flow strict
import Reflux from 'reflux';

// import * as Immutable from 'immutable';
import type { Store } from 'stores/StoreTypes';
import { qualifyUrl } from 'util/URLUtils';
import fetch from 'logic/rest/FetchProvider';
import UserNotification from 'util/UserNotification';
import { singletonStore } from 'views/logic/singleton';
import ActionsProvider from 'injection/ActionsProvider';
// import PaginationURL from 'util/PaginationURL';
import type { PaginatedServices, PaginatedAuthUsers, AuthenticationServiceCreate, ConnectionTestPayload, ConnectionTestResult, LoginTestPayload, LoginTestResult } from 'actions/authentication/AuthenticationActions';
// import type { PaginatedResponseType } from 'stores/PaginationTypes';
import AuthenticationService from 'logic/authentication/AuthenticationService';
// import type { AuthenticationServiceJson } from 'logic/authentication/AuthenticationService';
import ApiRoutes from 'routing/ApiRoutes';
// import AuthenticationUser from 'logic/authentication/AuthenticationUser';

import { services } from '../../../test/fixtures/authentication';
import { userList as authUsers } from '../../../test/fixtures/authenticaionUsers';

const TMP_SOURCE_URL = '/system/authentication/config';

const AuthenticationActions = ActionsProvider.getActions('Authentication');
// type PaginatedResponse = PaginatedResponseType & {
//   global_config: {
//     active_backend: string,
//   },
//   backends: Array<AuthenticationServiceJson>,
// };

const AuthenticationStore: Store<{ authenticators: any }> = singletonStore(
  'Authentication',
  () => Reflux.createStore({
    listenables: [AuthenticationActions],

    getInitialState() {
      return {
        authenticators: null,
      };
    },

    create(authService: AuthenticationServiceCreate): Promise<void> {
      const url = qualifyUrl(ApiRoutes.Authentication.create().url);
      const promise = fetch('POST', url, authService).then;
      AuthenticationActions.create.promise(promise);

      return promise;
    },

    load(id: string): Promise<?AuthenticationService> {
      // const url = qualifyUrl(ApiRoutes.Authentication.load(encodeURIComponent(id)).url);
      // const promise = fetch('GET', url).then(AuthenticationService.fromJSON);
      const promise = Promise.resolve(services.first());

      AuthenticationActions.load.promise(promise);

      return promise;
    },

    testConnection(payload: ConnectionTestPayload): ConnectionTestResult {
      const url = qualifyUrl(ApiRoutes.Authentication.testConnection().url);
      const promise = fetch('POST', url, payload).then;
      AuthenticationActions.testConnection.promise(promise);

      return promise;
    },

    testLogin(payload: LoginTestPayload): LoginTestResult {
      const url = qualifyUrl(ApiRoutes.Authentication.testLogin().url);
      const promise = fetch('POST', url, payload).then;
      AuthenticationActions.testLogin.promise(promise);

      return promise;
    },

    loadServicesPaginated(page: number, perPage: number, query: string): Promise<?PaginatedServices> {
      // const url = PaginationURL(ApiRoutes.Authentication.servicesPaginated().url, page, perPage, query);
      // const promise = fetch('GET', qualifyUrl(url))
      //   .then((response: PaginatedResponse) => ({
      //     globalConfig: {
      //       activeBackend: response.global_config.active_backend,
      //     },
      //     list: Immutable.List(response.backends.map((backend) => AuthenticationService.fromJSON(backend))),
      //     pagination: {
      //       count: response.count,
      //       total: response.total,
      //       page: response.page,
      //       perPage: response.per_page,
      //       query: response.query,
      //     },
      //   }));

      const promise = Promise.resolve({
        globalConfig: {
          activeBackend: services.first().id,
        },
        list: services,
        pagination: {
          count: services.size,
          total: services.size,
          page: page || 1,
          perPage: perPage || 10,
          query: query || '',
        },
      });

      AuthenticationActions.loadServicesPaginated.promise(promise);

      return promise;
    },

    loadUsersPaginated(page: number, perPage: number, query: string): Promise<?PaginatedAuthUsers> {
      // const url = PaginationURL(ApiRoutes.Authentication.loadUsersPaginated().url, page, perPage, query);

      // const promise = fetch('GET', qualifyUrl(url))
      //   .then((response: PaginatedResponse) => ({
      //     list: Immutable.List(response.users.map((user) => AuthenticationUser.fromJSON(user))),
      //     pagination: {
      //       count: response.count,
      //       total: response.total,
      //       page: response.page,
      //       perPage: response.per_page,
      //       query: response.query,
      //     },
      //   }));

      const promise = Promise.resolve({
        list: authUsers,
        pagination: {
          count: authUsers.size,
          total: authUsers.size,
          page: page || 1,
          perPage: perPage || 10,
          query: query || '',
        },
      });

      AuthenticationActions.loadUsersPaginated.promise(promise);

      return promise;
    },

    enableUser(userId: string): Promise<void> {
      const url = qualifyUrl(ApiRoutes.Authentication.enableUser(userId).url);
      const promise = fetch('POST', url).then;
      AuthenticationActions.enableUser.promise(promise);

      return promise;
    },

    disableUser(userId: string): Promise<void> {
      const url = qualifyUrl(ApiRoutes.Authentication.disableUser(userId).url);
      const promise = fetch('POST', url).then;
      AuthenticationActions.disableUser.promise(promise);

      return promise;
    },

    legacyLoad() {
      const url = qualifyUrl(TMP_SOURCE_URL);
      const promise = fetch('GET', url)
        .then(
          (response) => {
            this.trigger({ authenticators: response });

            return response;
          },
          (error) => UserNotification.error(`Unable to load authentication configuration: ${error}`, 'Could not load authenticators'),
        );

      AuthenticationActions.legacyLoad.promise(promise);
    },

    legacyUpdate(type, config) {
      const url = qualifyUrl(TMP_SOURCE_URL);

      if (type === 'providers') {
        const promise = fetch('PUT', url, config)
          .then(
            (response) => {
              this.trigger({ authenticators: response });
              UserNotification.success('Configuration updated successfully');

              return response;
            },
            (error) => UserNotification.error(`Unable to save authentication provider configuration: ${error}`, 'Could not save configuration'),
          );

        AuthenticationActions.legacyUpdate.promise(promise);
      }
    },
  }),
);

export default AuthenticationStore;
