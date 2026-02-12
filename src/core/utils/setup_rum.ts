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

import { datadogRum } from '@datadog/browser-rum';

interface DatadogRumConfig {
  applicationId?: string;
  clientToken?: string;
  site?: string;
  enabled?: boolean;
}

const THIRD_PARTY_SERVICES = ['logrocket', 'heapanalytics', 'intercom', 'zendesk'];

function shouldTraceUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (!hostname.includes('appzen.com')) {
      return false;
    }

    for (const service of THIRD_PARTY_SERVICES) {
      if (hostname.includes(service)) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

export function initializeDatadogRUM(rumConfig?: DatadogRumConfig) {
  if (!rumConfig?.enabled || !rumConfig?.applicationId || !rumConfig?.clientToken) {
    return;
  }

  datadogRum.init({
    applicationId: rumConfig.applicationId,
    clientToken: rumConfig.clientToken,
    site: rumConfig.site || 'datadoghq.com',
    service: 'kibana',
    env: process.env.NODE_ENV || 'development',
    version: '8.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
    allowedTracingUrls: [
      {
        match: shouldTraceUrl,
        propagatorTypes: ['datadog'],
      },
    ],
    enableExperimentalFeatures: ['feature_flags'],
  });

  datadogRum.startSessionReplayRecording();
}
