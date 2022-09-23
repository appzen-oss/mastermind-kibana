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

import { EuiBreadcrumb, IconType } from '@elastic/eui';
import { IconType as AZIconType } from '../../app_switcher/collapsible_nav/use_navIcon';
export interface NavigationObject {
  id: string;
  title: string;
  icon?: AZIconType;
  isOpen?: boolean;
  isExpandable?: boolean;
  url?: string;
  options?: NavigationObject[];
  groupState?: string[];
}

export type OnIsLockedUpdate = (isLocked: boolean) => void;
export type NavType = 'modern' | 'legacy';

export interface ChromeRecentlyAccessedHistoryItem {
  link: string;
  label: string;
  id: string;
}

export interface AppCategory {
  id: string;
  label: string;
  ariaLabel?: string;
  order?: number;
  euiIconType?: string;
}

export interface ChromeNavLink {
  readonly id: string;
  readonly title: string;
  readonly category?: AppCategory;
  readonly baseUrl: string;
  readonly url?: string;
  readonly order?: number;
  readonly tooltip?: string;
  readonly euiIconType?: string;
  readonly icon?: string;
  readonly href: string;
  readonly disabled?: boolean;
  readonly hidden?: boolean;
}

export type ChromeBreadcrumb = EuiBreadcrumb;

export interface ChromeBadge {
  text: string;
  tooltip: string;
  iconType?: IconType;
}

export interface NavigateToAppOptions {
  path?: string;
  state?: unknown;
  replace?: boolean;
}

export type NavigateToAppFunction = (
  appId: string,
  options?: NavigateToAppOptions
) => Promise<void>;

export type NavigateToUrlFunction = (url: string) => Promise<void>;

export type UnmountCallback = () => void;
export type MountPoint<T extends HTMLElement = HTMLElement> = (element: T) => UnmountCallback;

export interface ChromeBreadcrumbsAppendExtension {
  content: MountPoint<HTMLDivElement>;
}

export interface NavigationObject {
  id: string;
  title: string;
  icon?: AZIconType;
  isOpen?: boolean;
  isExpandable?: boolean;
  url?: string;
  options?: NavigationObject[];
  groupState?: string[];
}
