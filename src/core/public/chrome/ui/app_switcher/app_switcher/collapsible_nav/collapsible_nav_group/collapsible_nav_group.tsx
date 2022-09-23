import { EuiAccordion } from '@elastic/eui';
import React, { Fragment, ReactNode } from 'react';
import styled from 'styled-components';
import { NavigationObject } from '../../../common/types/types';
import { CollapsibleNavGroupTitle } from '../collapsible_nav_option_title/collapsible_nav_option_title';

interface Props {
  navOption: NavigationObject;
  selectedNavGroup: string[];
  setSelectedNavGroup: (selectedNavGroup: string[]) => void;
  navDepth: number;
  renderNavOption: (options: NavigationObject[], navDepth: number) => ReactNode;
}

const NavGroupWrapper = styled(EuiAccordion)<{ isActive: boolean }>`
  .euiAccordion__triggerWrapper {
    padding: 0px 0px;

    .euiAccordion__button {
      padding-right: 5px;
      height: 50px;
      text-decoration: none !important;
      border-radius: 5px;
      margin-bottom: 10px;

      &:hover {
        background-color: white;
        color: #1d25d4;
      }
    }

    .euiAccordion__icon-isOpen {
      color: #1d25d4;
    }
  }
`;

export const CollapsibleNavGroup = ({
  navOption,
  selectedNavGroup = [],
  navDepth,
  renderNavOption,
  setSelectedNavGroup,
}: Props) => {
  const isActive =
    selectedNavGroup?.length > navDepth ? selectedNavGroup[navDepth] === navOption.id : false;

  const onToggle = (isOpen: boolean) => {
    if (isOpen) {
      if (selectedNavGroup.length > navDepth) {
        setSelectedNavGroup([...selectedNavGroup.slice(0, navDepth), navOption.id]);
        return;
      }
      setSelectedNavGroup([...selectedNavGroup, navOption.id]);
      return;
    }
    setSelectedNavGroup(selectedNavGroup.slice(0, navDepth));
  };

  return (
    <NavGroupWrapper
      isActive={isActive}
      forceState={isActive ? 'open' : 'closed'}
      id={navOption.id}
      arrowDisplay="right"
      onToggle={onToggle}
      buttonContent={
        <CollapsibleNavGroupTitle
          navDepth={navDepth}
          iconType={navOption.icon || undefined}
          title={navOption.title}
          isActive={isActive}
        />
      }
    >
      <Fragment>{renderNavOption(navOption.options || [], navDepth + 1)}</Fragment>
    </NavGroupWrapper>
  );
};
