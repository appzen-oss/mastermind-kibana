import { EuiIcon } from '@elastic/eui';
import React, { ReactNode, useEffect, useState } from 'react';
import * as NavIcons from '../../common/assets/images/left_nav_icons';

export const useNavIcon = (icon: string | undefined) => {
  const [navIcon, setNavIcon] = useState<ReactNode | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (icon && NavIcons[icon]) {
          const navIconComponent = NavIcons[icon];
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
