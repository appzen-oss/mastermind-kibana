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
import { EuiIcon } from '@elastic/eui';
import React, { ReactNode, useEffect, useState } from 'react';
import Analytic from '../header/images/svg/analytic.svg';
import Report from '../header/images/svg/report.svg';
import Wrench from '../header/images/svg/wrench.svg';
import Help from '../header/images/svg/help.svg';
import Timeline from '../header/images/svg/timeline.svg';
import Expense from '../header/images/svg/expense.svg';
import Integrations from '../header/images/svg/integrations.svg';
import Aaa from '../header/images/svg/aaa.svg';

const navIconObject = {
  Analytic,
  Report,
  Wrench,
  Help,
  Timeline,
  Expense,
  Integrations,
  Aaa
};

export const useNavIcon = (icon: string | undefined) => {
  const [navIcon, setNavIcon] = useState<ReactNode | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (icon && navIconObject[icon]) {
          const navIconComponent = navIconObject[icon];
          setNavIcon(<EuiIcon type={navIconComponent} />);
        } else {
          setNavIcon(null);
        }
      } catch (err) {}
    };
    fetchImage();
  }, []);

  return {
    navIcon,
  };
};
