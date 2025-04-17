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

import React, { FunctionComponent, createElement } from 'react';

import { RenderingMetadata } from '../types';
import { Fonts } from './fonts';
import { Styles } from './styles';

interface Props {
  metadata: RenderingMetadata;
}

export const Template: FunctionComponent<Props> = ({
  metadata: {
    uiPublicUrl,
    locale,
    darkMode,
    injectedMetadata,
    i18n,
    bootstrapScriptUrl,
    strictCsp,
  },
}) => {
  const logo = (
    <svg xmlns="http://www.w3.org/2000/svg" width="95" height="45" viewBox="0 0 95 45">
      <path
        fill="#006D9A"
        d="M81.9,26.9l-9.4,9.4L67,41.9c0,0-0.1,0.1-0.1,0.1c-3.8,3.6-9.8,3.6-13.5-0.1c-1.9-1.9-2.8-4.3-2.8-6.8
	c0-2.5,0.9-4.9,2.8-6.8l5.5-5.5l9.4-9.4c3.8-3.8,9.8-3.8,13.6,0C85.7,17.1,85.7,23.2,81.9,26.9z"
      />
      <circle fill="#CE118B" cx="37.5" cy="37.6" r="7.2" />
      <circle fill="#00A0E3" cx="88" cy="37.6" r="7.2" />
      <circle fill="#00A0E3" cx="57.8" cy="7.2" r="7.2" />
      <path
        fill="#00A0E3"
        d="M92.4,16.4L83,25.8l-5.5,5.6c0,0-0.1,0.1-0.1,0.1c-3.8,3.6-9.8,3.6-13.5-0.1c-1.9-1.9-2.8-4.3-2.8-6.8
	s0.9-4.9,2.8-6.8l5.5-5.5l9.4-9.4c3.8-3.8,9.8-3.8,13.6,0C96.2,6.6,96.2,12.7,92.4,16.4z"
      />
      <path
        fill="#79317F"
        d="M41.9,16.4l-9.4,9.4l-5.5,5.6c0,0-0.1,0.1-0.1,0.1c-3.8,3.6-9.8,3.6-13.5-0.1c-1.9-1.9-2.8-4.3-2.8-6.8
	s0.9-4.9,2.8-6.8l5.5-5.5l9.4-9.4c3.8-3.8,9.8-3.8,13.6,0C45.6,6.6,45.6,12.7,41.9,16.4z"
      />
      <path
        fill="#CE118B"
        d="M31.3,27l-9.4,9.4l-5.5,5.6c0,0-0.1,0.1-0.1,0.1c-3.8,3.6-9.8,3.6-13.5-0.1C0.9,40,0,37.5,0,35.1
	c0-2.5,0.9-4.9,2.8-6.8l5.5-5.5l9.4-9.4c3.8-3.8,9.8-3.8,13.6,0C35.1,17.1,35.1,23.2,31.3,27z"
      />
    </svg>
  );
  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width" />
        <title>AppZen</title>
        <Fonts url={uiPublicUrl} />
        {/* Favicons (generated from http://realfavicongenerator.net/) */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${uiPublicUrl}/favicons/apple-touch-icon.png`}
        />
        <link rel="manifest" href={`${uiPublicUrl}/favicons/manifest.json`} />
        <link
          rel="mask-icon"
          color="#e8488b"
          href={`${uiPublicUrl}/favicons/safari-pinned-tab.svg`}
        />
        <link rel="shortcut icon" href={`${uiPublicUrl}/favicons/favicon.ico`} />
        <meta name="msapplication-config" content={`${uiPublicUrl}/favicons/browserconfig.xml`} />
        <meta name="theme-color" content="#ffffff" />
        <Styles darkMode={darkMode} />

        {/* Inject stylesheets into the <head> before scripts so that KP plugins with bundled styles will override them */}
        <meta name="add-styles-here" />
        <meta name="add-scripts-here" />
      </head>
      <body>
        {createElement('kbn-csp', {
          data: JSON.stringify({ strictCsp }),
        })}
        {createElement('kbn-injected-metadata', { data: JSON.stringify(injectedMetadata) })}
        <div
          className="kbnWelcomeView"
          id="kbn_loading_message"
          style={{ display: 'none' }}
          data-test-subj="kbnLoadingMessage"
        >
          <div className="kbnLoaderWrap">
            {logo}
            <div
              className="kbnWelcomeText"
              data-error-message={i18n('core.ui.welcomeErrorMessage', {
                defaultMessage:
                  'Elastic did not load properly. Check the server output for more information.',
              })}
            >
              {i18n('core.ui.welcomeMessage', { defaultMessage: 'Please wait while loading...' })}
            </div>
            <div className="kbnProgress" />
          </div>
        </div>

        <div className="kbnWelcomeView" id="kbn_legacy_browser_error" style={{ display: 'none' }}>
          {logo}

          <h2 className="kbnWelcomeTitle">
            {i18n('core.ui.legacyBrowserTitle', {
              defaultMessage: 'Please upgrade your browser',
            })}
          </h2>
          <div className="kbnWelcomeText">
            {i18n('core.ui.legacyBrowserMessage', {
              defaultMessage:
                'This Elastic installation has strict security requirements enabled that your current browser does not meet.',
            })}
          </div>
        </div>

        <script>
          {`
            // Since this is an unsafe inline script, this code will not run
            // in browsers that support content security policy(CSP). This is
            // intentional as we check for the existence of __kbnCspNotEnforced__ in
            // bootstrap.
            window.__kbnCspNotEnforced__ = true;
          `}
        </script>
        <script src={bootstrapScriptUrl} />
      </body>
    </html>
  );
};
