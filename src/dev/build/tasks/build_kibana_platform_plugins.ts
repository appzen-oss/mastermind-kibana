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

import { REPO_ROOT } from '@kbn/utils';
import { CiStatsReporter } from '@kbn/dev-utils';
import {
  runOptimizer,
  OptimizerConfig,
  logOptimizerState,
  reportOptimizerStats,
} from '@kbn/optimizer';

import { Task } from '../lib';

export const BuildKibanaPlatformPlugins: Task = {
  description: 'Building distributable versions of Kibana platform plugins',
  async run(_, log, build) {
    const config = OptimizerConfig.create({
      repoRoot: REPO_ROOT,
      outputRoot: build.resolvePath(),
      cache: false,
      oss: build.isOss(),
      examples: false,
      watch: false,
      dist: true,
      includeCoreBundle: true,
      filter: _.getBuildKibanaPlugins() ? [] : ['core'],
    });

    const reporter = CiStatsReporter.fromEnv(log);

    await runOptimizer(config)
      .pipe(reportOptimizerStats(reporter, config, log), logOptimizerState(log, config))
      .toPromise();

    await Promise.all(config.bundles.map((b) => b.cache.clear()));
  },
};
