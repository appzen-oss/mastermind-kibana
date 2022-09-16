import React from 'react';
import { EuiButtonEmpty, EuiFlexItem } from '@elastic/eui';
import styled from 'styled-components';
import { NavigationObject } from '../../../common/types/types';
import { CollapsibleNavGroupTitle } from '../collapsible_nav_option_title/collapsible_nav_option_title';

interface Props {
  navOption: NavigationObject;
  navigateToUrl: (url: string) => void;
  selectedNavItem: string | null;
  setSelectedNavItem: (selectedNavItem: string) => void;
  navDepth: number;
}

const StyledLeftNavButton = styled(EuiButtonEmpty)<{ isInnerNav: boolean; isActive: boolean }>`
  text-decoration: none;
  border-radius: 9px;
  height: 40px;
  background-color: ${(props) => props.isActive && 'white'};

  &:hover {
    background-color: white;
    color: #1d25d4;
    text-decoration: none !important;
  }

  .euiButtonEmpty__content {
    justify-content: flex-start;
    margin-left: 0px;
    padding: 0px;
  }
`;
export const CollapsibleNavItem = ({
  navOption,
  navigateToUrl,
  selectedNavItem,
  setSelectedNavItem,
  navDepth,
}: Props) => {
  const onNavItemClick = () => {
    setSelectedNavItem(navOption.id);
    navigateToUrl(navOption.url || '');
  };

  return (
    <EuiFlexItem>
      <StyledLeftNavButton
        isActive={navOption.id === selectedNavItem}
        isInnerNav={navDepth > 1}
        color="text"
        onClick={onNavItemClick}
      >
        <CollapsibleNavGroupTitle
          navDepth={navDepth}
          iconType={navOption.icon}
          title={navOption.title}
          isActive={navOption.id === selectedNavItem}
        />
      </StyledLeftNavButton>
    </EuiFlexItem>
  );
};
