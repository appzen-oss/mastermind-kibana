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

export interface Entity {
  entity_name: string;
  entity_id: string;
}

export interface EntitySetting {
  app_name: string;
  entities: Entity[];
}

export interface UserAccount {
  azUserId: string;
  customerId: string;
  customerName: string;
  defaultLoginAccount: boolean;
  emailAddress: string;
}

export interface UserDetails {
  token: string;
  csrfToken?: string;
  sessionId: string;
  domainName: string;
  customerId: string;
  azUserId: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  customerName: string;
  roles: string[];
  emulatedByAppzenSuperAdmin: boolean;
  emulatedByPartnerAdmin: boolean;
  emulatedByEmulator: boolean;
  entitySettings: EntitySetting[];
  createdBy?: string;
  userAccounts: UserAccount[];
}
