/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import useObservable from 'react-use/lib/useObservable';
import { Observable } from 'rxjs';
import { AppSwitcher } from '@az/app-switcher';
import { InternalApplicationStart } from '../../application';
import { HttpStart } from '../../http';
import {
  ChromeBadge,
  ChromeBreadcrumb,
  ChromeBreadcrumbsAppendExtension,
  ChromeHelpExtension,
} from '../chrome_service';
import { ChromeNavControl } from '../nav_controls';
import { ChromeNavLink } from '../nav_links';
import { ChromeRecentlyAccessedHistoryItem } from '../recently_accessed';
import { OnIsLockedUpdate } from './header';

export interface Props {
  http: HttpStart;
  kibanaVersion: string;
  application: InternalApplicationStart;
  appTitle$: Observable<string>;
  badge$: Observable<ChromeBadge | undefined>;
  breadcrumbs$: Observable<ChromeBreadcrumb[]>;
  breadcrumbsAppendExtension$: Observable<ChromeBreadcrumbsAppendExtension | undefined>;
  customNavLink$: Observable<ChromeNavLink | undefined>;
  homeHref: string;
  isVisible$: Observable<boolean>;
  kibanaDocLink: string;
  navLinks$: Observable<ChromeNavLink[]>;
  recentlyAccessed$: Observable<ChromeRecentlyAccessedHistoryItem[]>;
  forceAppSwitcherNavigation$: Observable<boolean>;
  helpExtension$: Observable<ChromeHelpExtension | undefined>;
  helpSupportUrl$: Observable<string>;
  navControlsLeft$: Observable<readonly ChromeNavControl[]>;
  navControlsCenter$: Observable<readonly ChromeNavControl[]>;
  navControlsRight$: Observable<readonly ChromeNavControl[]>;
  basePath: HttpStart['basePath'];
  isLocked$: Observable<boolean>;
  loadingCount$: ReturnType<HttpStart['getLoadingCount$']>;
  onIsLockedUpdate: OnIsLockedUpdate;
}

export const TopNavigation = ({
  appTitle$,
  breadcrumbs$,
  breadcrumbsAppendExtension$,
  forceAppSwitcherNavigation$,
  navLinks$,
  isVisible$,
  isLocked$,
  application,
  homeHref,
  loadingCount$,
  http,
}: Props) => {
  const appTitle = useObservable(appTitle$, 'Kibana');
  const breadcrumbs = useObservable(breadcrumbs$, []);
  const breadcrumbsAppendExtension = useObservable(breadcrumbsAppendExtension$);
  const forceNavigation = useObservable(forceAppSwitcherNavigation$, false);
  const navLinks = useObservable(navLinks$, []);
  const isVisible = useObservable(isVisible$, false);
  const loadingCount = useObservable(loadingCount$, 0);

  const switchToAdminAPI = () => http.get(`/api/mastermind_security/switchadmin`);
  const userDetailsAPI = () => http.get(`/api/mastermind_security/user`);
  const zendeskTokenAPI = () => http.get('/api/mastermind_security/zendeskToken');
  const switchToUserAPI = (userId: string, customerId: string) =>
    http.get(`/api/mastermind_security/switchuser`, {
      query: {
        userId,
        customerId,
      },
    });
  const logoutAPI = () => http.get(`/api/mastermind_security/logout`);
  const customerConfigAPI = () => http.get(`/api/mastermind_security/customer_config`);
  const appConfigAPI = () => http.get('/api/mastermind_security/app_config');
  const productsAPI = () => http.get('/api/mastermind_security/products');
  const notificationsAPI = () => http.get('/api/mastermind_approver/notifications');
  const changePasswordAPI = (currentPassword: string, newPassword: string) =>
    http.post('/api/mastermind_security/change_password', {
      query: {
        currentPassword,
        newPassword,
      },
    });

  return (
    <AppSwitcher
      userDetailsAPI={userDetailsAPI}
      switchToAdminAPI={switchToAdminAPI}
      switchToUserAPI={switchToUserAPI}
      zendeskTokenAPI={zendeskTokenAPI}
      logOutAPI={logoutAPI}
      appConfigAPI={appConfigAPI}
      customerConfigAPI={customerConfigAPI}
      navigateToUrl={application.navigateToUrl}
      navigateToApp={application.navigateToApp}
      appTitle={appTitle}
      breadcrumbs={breadcrumbs}
      breadcrumbsAppendExtension={breadcrumbsAppendExtension}
      homeHref={homeHref}
      isVisible={isVisible}
      navLinks={navLinks}
      forceAppSwitcherNavigation={forceNavigation}
      loadingCount={loadingCount}
      productsAPI={productsAPI}
      notificationsAPI={notificationsAPI}
      changePasswordAPI={changePasswordAPI}
      forceHideOrganizationsDropdown
    />
  );
};
