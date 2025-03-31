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

let tracer;

module.exports = function (serviceName = 'kibana') {
  try {
    tracer = require('dd-trace').init({
      service: process.env.DD_SERVICE || serviceName,
      env: process.env.NODE_ENV || 'enft',
      logInjection: false,
      runtimeMetrics: true,
      profiling: true,
      // Configure the agent to send traces to the Datadog cluster agent
      agent: {
        host: process.env.DD_AGENT_HOST || 'localhost',
        port: process.env.DD_TRACE_AGENT_PORT || 8126
      },
      // Add debug logging to help troubleshoot connection issues
      debug: true,
      // Add tags for better identification in Datadog UI
      tags: {
        'service.version': process.env.npm_package_version || 'unknown'
      },
      // Disable automatic instrumentation to prevent conflicts with Kibana
      plugins: false,
      // Configure trace propagation for Node.js 12 compatibility
      experimental: {
        traceId128bit: false,
        tracePropagationStyle: 'datadog'
      }
    });

    console.log('Datadog APM tracer initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Datadog APM tracer:', error);
    // Export a dummy tracer to prevent application crashes
    tracer = {
      trace: () => {},
      wrap: (fn) => fn
    };
  }
  return tracer;
};
