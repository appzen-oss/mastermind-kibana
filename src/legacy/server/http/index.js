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

import { format } from 'url';
import Boom from '@hapi/boom';

import { registerHapiPlugins } from './register_hapi_plugins';
import { setupBasePathProvider } from './setup_base_path_provider';

export default async function (kbnServer, server) {
  server = kbnServer.server;

  setupBasePathProvider(kbnServer);

  await registerHapiPlugins(server);

  // For multi-slash root paths (e.g. `//`) we want to break redirect loops
  // caused by upstream proxies that don't merge slashes — sending the user
  // to the configured default landing page instead of looping back to `/`.
  // Read the YAML-configured override at setup time so the destination can
  // be changed by editing kibana.yml (deploy values.yaml) without a code
  // change. Falls back to Kibana's built-in defaultRoute default.
  const uiSettings = kbnServer.config.has('uiSettings') ? kbnServer.config.get('uiSettings') : {};
  const multiSlashRedirectTarget =
    (uiSettings && uiSettings.overrides && uiSettings.overrides.defaultRoute) || '/app/home';

  server.route({
    method: 'GET',
    path: '/{p*}',
    handler: function (req, h) {
      const path = req.path;
      if (path === '/' || path.charAt(path.length - 1) !== '/') {
        throw Boom.notFound();
      }

      // Defensive: some upstream proxies deliver `GET /` to Kibana as `GET //`
      // (observed on AppZen PROD ingress; RCST normalizes). Without this
      // branch, falling through below emits `301 -> /`, which the same proxy
      // re-doubles to `//` and creates an infinite redirect loop. For all-
      // slash root paths (`//`, `///`, ...) redirect to the configured default
      // landing page — that path is not mutated by the ingress, so the cycle
      // breaks on the next hop. Safe to remove once the ingress is configured
      // to merge slashes.
      if (/^\/+$/.test(path)) {
        return h.redirect(multiSlashRedirectTarget).permanent(true);
      }

      const pathPrefix = req.getBasePath() ? `${req.getBasePath()}/` : '';
      return h
        .redirect(
          format({
            search: req.url.search,
            pathname: pathPrefix + path.slice(0, -1),
          })
        )
        .permanent(true);
    },
  });
}
