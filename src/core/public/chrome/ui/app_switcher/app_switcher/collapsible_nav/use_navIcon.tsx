import { EuiIcon } from '@elastic/eui';
import React, { ReactNode, useEffect, useState } from 'react';
import * as NavIcons from '../../common/assets/images/left_nav_icons';

const iconMap = {
  Analytic: NavIcons.Analytic,
  Report: NavIcons.Report,
  Wrench: NavIcons.Wrench,
  Help: NavIcons.Help,
  Timeline: NavIcons.Timeline,
  Expense: NavIcons.Expense,
  Integrations: NavIcons.Integrations,
  Aaa: NavIcons.Aaa,
  Vat: NavIcons.Vat,
  AppStore: NavIcons.AppStore,
};

export type IconType = keyof typeof iconMap;

export const useNavIcon = (icon: IconType | undefined) => {
  const [navIcon, setNavIcon] = useState<ReactNode | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        console.log('icon', icon);
        if (icon !== undefined) {
          if (Boolean(icon && iconMap[icon])) {
            const navIconComponent = iconMap[icon];
            setNavIcon(<EuiIcon type={navIconComponent} />);
          } else {
            setNavIcon(null);
          }
        }
      } catch (err) {}
    };
    fetchImage();
  }, []);

  return {
    navIcon,
  };
};
