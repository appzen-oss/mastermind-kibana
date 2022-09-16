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
import { EuiBreadcrumb, IconType } from "@elastic/eui";
export interface NavigationObject {
  id: string;
  title: string;
  icon?: string;
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
  /**
   * Unique identifier for the categories
   */
  id: string;

  /**
   * Label used for category name.
   * Also used as aria-label if one isn't set.
   */
  label: string;

  /**
   * If the visual label isn't appropriate for screen readers,
   * can override it here
   */
  ariaLabel?: string;

  /**
   * The order that categories will be sorted in
   * Prefer large steps between categories to allow for further editing
   * (Default categories are in steps of 1000)
   */
  order?: number;

  /**
   * Define an icon to be used for the category
   * If the category is only 1 item, and no icon is defined, will default to the product icon
   * Defaults to initials if no icon is defined
   */
  euiIconType?: string;
}


export interface ChromeNavLink {
  /**
   * A unique identifier for looking up links.
   */
  readonly id: string;

  /**
   * The title of the application.
   */
  readonly title: string;

  /**
   * The category the app lives in
   */
  readonly category?: AppCategory;

  /**
   * The base route used to open the root of an application.
   */
  readonly baseUrl: string;

  /**
   * The route used to open the {@link AppBase.defaultPath | default path } of an application.
   * If unset, `baseUrl` will be used instead.
   */
  readonly url?: string;

  /**
   * An ordinal used to sort nav links relative to one another for display.
   */
  readonly order?: number;

  /**
   * A tooltip shown when hovering over an app link.
   */
  readonly tooltip?: string;

  /**
   * A EUI iconType that will be used for the app's icon. This icon
   * takes precedence over the `icon` property.
   */
  readonly euiIconType?: string;

  /**
   * A URL to an image file used as an icon. Used as a fallback
   * if `euiIconType` is not provided.
   */
  readonly icon?: string;

  /**
   * Settled state between `url`, `baseUrl`, and `active`
   */
  readonly href: string;

  /**
   * Disables a link from being clickable.
   *
   * @internalRemarks
   * This is only used by the ML and Graph plugins currently. They use this field
   * to disable the nav link when the license is expired.
   */
  readonly disabled?: boolean;

  /**
   * Hides a link from the navigation.
   */
  readonly hidden?: boolean;
}

export type ChromeBreadcrumb = EuiBreadcrumb;

export interface ChromeBadge {
  text: string;
  tooltip: string;
  iconType?: IconType;
}

export interface NavigateToAppOptions {
  /**
   * optional path inside application to deep link to.
   * If undefined, will use {@link App.defaultPath | the app's default path}` as default.
   */
  path?: string;
  /**
   * optional state to forward to the application
   */
  state?: unknown;
  /**
   * if true, will not create a new history entry when navigating (using `replace` instead of `push`)
   */
  replace?: boolean;
}

export type NavigateToAppFunction = (appId: string, options?: NavigateToAppOptions) => Promise<void>;

export type NavigateToUrlFunction = (url: string) => Promise<void>;

export type UnmountCallback = () => void;
export type MountPoint<T extends HTMLElement = HTMLElement> = (element: T) => UnmountCallback;


export interface ChromeBreadcrumbsAppendExtension {
  content: MountPoint<HTMLDivElement>;
}

export interface NavigationObject {
  id: string;
  title: string;
  icon?: string;
  isOpen?: boolean;
  isExpandable?: boolean;
  url?: string;
  options?: NavigationObject[];
  groupState?: string[];
}