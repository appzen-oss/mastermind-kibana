import {
  EuiCollapsibleNav,
  EuiCollapsibleNavGroup,
  EuiFlexItem,
} from '@elastic/eui';
import styled from 'styled-components';
import { i18n } from '@kbn/i18n';
import React, { Fragment } from 'react';
import { CollapsibleNavItem } from './collapsible_nav_item/collapsible_nav_item';
import { CollapsibleNavGroup } from './collapsible_nav_group/collapsible_nav_group';
import { NavigateToUrlFunction, NavigationObject } from '../../common/types/types';
import { navigationRedirectURLMapping } from '@az/common-configs/src/apiEndPointHostNames';

interface Props {
  id: string;
  userNavOptions: NavigationObject[],
  isNavOpen: boolean;
  closeNav: () => void;
  navigateToUrl: NavigateToUrlFunction;
  selectedNavGroup: any;
  setSelectedNavGroup: any;
  selectedNavItem: any;
  setSelectedNavItem: any;
}

const StyledCollapsibleNav = styled(EuiCollapsibleNav)`
  background-color: #ececf1;
  top: 49px !important;
  height: calc(100vh - 49px) !important;
  width: 220px;
  padding: 0px 5px;

  .euiCollapsibleNavGroup:not(:first-child) {
    border-top: none !important;
  }
`;

const StyledCollapsibleNavGroup = styled(EuiCollapsibleNavGroup)`
  .euiCollapsibleNavGroup {
    border: none !important;
  }
  .euiCollapsibleNavGroup__children {
    padding: 0px 0px;
  }
`;
export function CollapsibleNav({
  id,
  isNavOpen,
  closeNav,
  navigateToUrl,
  selectedNavGroup,
  setSelectedNavGroup,
  selectedNavItem,
  setSelectedNavItem,
  userNavOptions
}: Props) {
  const redirectToURL = (url: string) => {
    const redirectionURL = navigationRedirectURLMapping(window.location.hostname, url);
    navigateToUrl(redirectionURL);
    closeNav();
  };

  const renderNavOption = (navOptions: NavigationObject[] = [], navDepth: number = 0) => {
    return navOptions.map((navOption) => {
      return (
        <Fragment>
          <StyledCollapsibleNavGroup data-test-subj={`collapsibleNavGroup-noCategory`}>
            {navOption.isExpandable !== true && (
              <CollapsibleNavItem
                navDepth={navDepth}
                navOption={navOption}
                navigateToUrl={redirectToURL}
                selectedNavItem={selectedNavItem}
                setSelectedNavItem={setSelectedNavItem}
                key={navOption.id}
              />
            )}
            {navOption.isExpandable === true && (
              <CollapsibleNavGroup
                navDepth={navDepth}
                navOption={navOption}
                renderNavOption={renderNavOption}
                selectedNavGroup={selectedNavGroup}
                setSelectedNavGroup={setSelectedNavGroup}
                key={navOption.id}
              />
            )}
          </StyledCollapsibleNavGroup>
        </Fragment>
      );
    });
  };

  return (
    <StyledCollapsibleNav
      data-test-subj="collapsibleNav"
      id={id}
      aria-label={i18n.translate('core.ui.primaryNav.screenReaderLabel', {
        defaultMessage: 'Primary',
      })}
      isOpen={isNavOpen}
      onClose={closeNav}
    >
      <EuiFlexItem className="eui-yScroll">{renderNavOption(userNavOptions)}</EuiFlexItem>
    </StyledCollapsibleNav>
  );
}
