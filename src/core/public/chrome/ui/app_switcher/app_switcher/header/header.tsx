import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHeader,
  EuiHeaderSectionItemButton,
  EuiIcon,
  EuiPopover,
  EuiSuperSelect,
  EuiSuperSelectOption,
  EuiText,
  htmlIdGenerator,
} from '@elastic/eui';
import { globalConfig, sideNavComputations } from '@az/common-configs';
import classnames from 'classnames';
import React, { createRef, useEffect, useState } from 'react';
import { HeaderBreadcrumbs } from './header_breadcrumbs';
import { HeaderLogo } from './header_logo';
import styled from 'styled-components';
import {
  ChromeBreadcrumb,
  ChromeBreadcrumbsAppendExtension,
  ChromeNavLink,
  NavigateToAppFunction,
  NavigateToUrlFunction,
  NavigationObject,
} from '../../common/types/types';
import { LoadingIndicator } from '../loading_indicator/loading_indicator';
import { UserDetails } from '../../common/types/user';
import { CollapsibleNav } from '../collapsible_nav/collapsible_nav';
import { navigationRedirectURLMapping } from '@az/common-configs/src/apiEndPointHostNames';

export interface HeaderProps {
  switchToAdminAPI: () => Promise<any>;
  switchToUserAPI: (userId: string, customerId: string) => Promise<any>;
  userDetailsAPI: () => Promise<UserDetails>;
  navigateToUrl: NavigateToUrlFunction;
  navigateToApp: NavigateToAppFunction;
  appTitle: string;
  breadcrumbs: ChromeBreadcrumb[];
  breadcrumbsAppendExtension: ChromeBreadcrumbsAppendExtension | undefined;
  homeHref: string;
  isVisible: boolean;
  navLinks: ChromeNavLink[];
  forceAppSwitcherNavigation: boolean;
  loadingCount: number;
}

const Wrapper = styled.div`
  #user-accounts--switcher {
    button.euiSuperSelect--isOpen__button {
      border: 1px solid #abb2b6 !important;
    }

    button.euiSuperSelectControl {
      background-color: #25282f !important;
      color: #fff !important;

      &:hover {
        border: 1px solid #abb2b6;
        border-radius: 5px;
      }

      &:focus {
        border: 1px solid #abb2b6;
        border-radius: 5px;
        text-decoration: none !important;
      }
    }

    div.euiFormControlLayoutIcons.euiFormControlLayoutIcons--right {
      color: #fff;
    }
  }
`;

const StyledUserMenuOption = styled(EuiButtonEmpty)`
  color: black;

  &:hover {
    background-color: #edeeff;
    color: #1d25d4;
    text-decoration: none !important;
  }
`;
const StyledUserMenuButton = styled(EuiButtonEmpty)<{ isRightMost?: boolean }>`
  padding: 0px 19px;
  letter-spacing: 0.5px;
  color: white;
  border: 1px solid white;
  border-radius: 5px;
  margin-right: ${(props) => (props.isRightMost ? '3rem' : '1rem')};
  width: max-content;

  &:hover {
    background-color: white;
    color: black;
    text-decoration: none !important;
  }
  &:focus {
    background-color: #25282f;
    text-decoration: none !important;
  }
`;

const { sideNavOptions } = globalConfig;
export function Header({
  navigateToApp,
  navigateToUrl,
  switchToAdminAPI,
  switchToUserAPI,
  homeHref,
  isVisible,
  forceAppSwitcherNavigation,
  navLinks,
  appTitle,
  breadcrumbs,
  breadcrumbsAppendExtension,
  loadingCount,
  userDetailsAPI
}: HeaderProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedNavGroup, setSelectedNavGroup] = useState<string[]>([]);
  const [selectedNavItem, setSelectedNavItem] = useState<string | null>(null);
  const [userNavOptions, setuserNavOptions] = useState<NavigationObject[]>([]);
  const [userAccountSelected, setUserAccountSelected] = useState<string | null>(null);
  const toggleCollapsibleNavRef = createRef<HTMLButtonElement>();
  const navId = htmlIdGenerator()();
  const className = classnames('hide-for-sharing', 'headerGlobalNav');

  const userAccountOptions: Array<EuiSuperSelectOption<string>> = userDetails
    ? userDetails.userAccounts.map((userAccount) => ({
        value: userAccount.customerId,
        inputDisplay: userAccount.customerName,
        dropdownDisplay: (
          <div style={{ width: 'max-content' }}>
            <span>{userAccount.customerName}</span>
          </div>
        ),
      }))
    : [];

  const initializeNav = (navOptions: NavigationObject[] = []) => {
    let parentNavGroup: NavigationObject | undefined;
    navOptions.some(function checkSelectedNavOption(navOption: NavigationObject): undefined {
      if (navOption?.url) {
        if (navOption?.url.replace('/mastermind', '').split('?')[0] === window.location.pathname) {
          setSelectedNavItem(navOption.id);
          setSelectedNavGroup(
            navOption?.groupState
              ? navOption.groupState
              : parentNavGroup?.id
              ? [parentNavGroup.id]
              : []
          );
          return;
        }
        return;
      }
      if (navOption?.options?.length) {
        parentNavGroup = navOption;
        navOption.options.some(checkSelectedNavOption);
      }
      return;
    });
  };

  const switchToAdmin = async () => {
    try {
      await switchToAdminAPI();
      navigateToUrl(navigationRedirectURLMapping(window.location.hostname, '/console/index.html'));
    } catch (e) {}
  };

  const switchUserAccount = async (selectedAccountOptionValue: string) => {
    try {
      setUserAccountSelected(selectedAccountOptionValue);
      const selectedUserAccount = userDetails?.userAccounts.find(
        (userAccount) => userAccount.customerId === selectedAccountOptionValue
      );
      if (selectedUserAccount) {
        await switchToUserAPI(selectedUserAccount.azUserId, selectedUserAccount.customerId);
        navigateToUrl(
          navigationRedirectURLMapping(window.location.hostname, '/console/index.html')
        );
      }
    } catch (e) {}
  };

  useEffect(() => {
    async function fetchUserDetails() {
      const userData: UserDetails = await userDetailsAPI();
      setUserDetails(userData);
      setUserAccountSelected(userData.customerId);

      const userDataFormatted = {
        customer_id: userData.customerId,
        az_user_id: userData.azUserId,
        email_address: userData.emailAddress,
        first_name: userData.firstName,
        last_name: userData.lastName,
        customer_name: userData.customerName,
        user_roles: userData.roles.map((role) => ({ authority: role })),
        emulated_by_appzen_super_admin: userData.emulatedByAppzenSuperAdmin,
        emulated_by_concur_partner_admin: userData.emulatedByPartnerAdmin,
        emulated_by_emulator: userData.emulatedByEmulator,
        created_by: userData.createdBy,
        user_accounts: userData.userAccounts,
      };

      const navOptions: NavigationObject[] = sideNavComputations.prepareSideNavObject({
        sideNavOptions,
        isAppZenSuperAdminLogin: userData?.emulatedByAppzenSuperAdmin,
        isConcurPartnerAdmin: false,
        isEmulatedByEmulator: false,
        customerConfigValues: [],
        userData: userDataFormatted,
      });
      setuserNavOptions(navOptions);
      initializeNav(sideNavOptions);
    }

    fetchUserDetails();
    return () => {};
  }, []);

  if (!isVisible) {
    return <LoadingIndicator loadingCount={loadingCount} showAsBar />;
  }

  const userMenuOptions = [
    {
      value: 'user_settings',
      inputDisplay: 'User Settings',
      onClick() {
        navigateToUrl('/mastermind/app/approval/settings');
      },
      dropdownDisplay: (
        <div className="user-account--dropdown-wrapper">
          <span style={{ letterSpacing: '0.5px' }}>User Settings</span>
        </div>
      ),
    },
    {
      value: 'log_out',
      inputDisplay: 'Log Out',
      onClick() {
        navigateToUrl(navigationRedirectURLMapping(window.location.hostname, '/console/home.html'));
      },
      dropdownDisplay: (
        <div className="user-account--dropdown-wrapper">
          <span style={{ letterSpacing: '0.5px' }}>Log Out</span>
        </div>
      ),
    },
  ];

  const renderUserCustomer = () => {
    return (
      <EuiText style={{ width: 'max-content' }}  size="s" color="ghost">
        {userDetails ? `${userDetails.customerName}` : ''}
      </EuiText>
    );
  };

  const renderUserMenuPopover = () => {
    const button = (
      <>
        {userDetails && (
          <StyledUserMenuButton isRightMost onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
            <EuiText size="s">
              {userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : ''}
            </EuiText>
          </StyledUserMenuButton>
        )}
      </>
    );

    return (
      <EuiPopover
        button={button}
        isOpen={isUserMenuOpen}
        closePopover={() => setIsUserMenuOpen(false)}
        hasArrow={false}
        panelStyle={{ width: '11rem', left: '1453.41px' }}
        panelPaddingSize="m"
        attachToAnchor
      >
        <EuiFlexGroup direction="column">
          {userMenuOptions.map((userMenuOption) => (
            <EuiFlexItem style={{ margin: '0px' }}>
              <StyledUserMenuOption
                onClick={() => {
                  userMenuOption.onClick();
                  setIsUserMenuOpen(false);
                }}
                color="text"
              >
                <EuiText size="s">{userMenuOption.dropdownDisplay}</EuiText>
              </StyledUserMenuOption>
            </EuiFlexItem>
          ))}
        </EuiFlexGroup>
      </EuiPopover>
    );
  };

  const renderUserMenuHeaders = () => (
    <EuiFlexGroup direction="row" style={{ alignItems: 'center' }}>
      <EuiFlexItem style={{ width: 'max-content', marginRight: '8.5rem' }}>
        {userDetails && userDetails.userAccounts.length > 1 ? (
          <div id="user-accounts--switcher" style={{ width: 'max-content', borderRadius: '5px' }}>
            <EuiSuperSelect
              options={userAccountOptions}
              valueOfSelected={userAccountSelected || ''}
              onChange={switchUserAccount}
              fullWidth
              itemLayoutAlign="center"
            />
          </div>
        ) : (
          renderUserCustomer()
        )}
      </EuiFlexItem>
      <EuiFlexItem>
        <>
          {userDetails?.emulatedByAppzenSuperAdmin && (
            <StyledUserMenuButton onClick={switchToAdmin}>
              <EuiText size="s">Switch User</EuiText>
            </StyledUserMenuButton>
          )}
        </>
      </EuiFlexItem>
      <EuiFlexItem>{renderUserMenuPopover()}</EuiFlexItem>
    </EuiFlexGroup>
  );

  return (
    <Wrapper>
      <header className={className} data-test-subj="headerGlobalNav">
        <div id="globalHeaderBars">
          <EuiHeader
            theme="dark"
            position="fixed"
            sections={[
              {
                items: [
                  <EuiHeaderSectionItemButton
                    data-test-subj="toggleNavButton"
                    aria-label="Toggle primary navigation"
                    onClick={() => setIsNavOpen(!isNavOpen)}
                    aria-expanded={isNavOpen}
                    aria-pressed={isNavOpen}
                    aria-controls={navId}
                    ref={toggleCollapsibleNavRef}
                  >
                    <EuiIcon type="menu" size="m" />
                  </EuiHeaderSectionItemButton>,
                  <HeaderLogo
                    href={homeHref}
                    forceNavigation={forceAppSwitcherNavigation}
                    navLinks={navLinks}
                    navigateToApp={navigateToApp}
                    loadingCount={loadingCount}
                  />,
                ],
                borders: 'none',
              },
              {
                items: [<>{renderUserMenuHeaders()}</>],
                borders: 'none',
              },
            ]}
          />

          <EuiHeader position="fixed">
            <HeaderBreadcrumbs
              appTitle={appTitle}
              breadcrumbs={breadcrumbs}
              breadcrumbsAppendExtension={breadcrumbsAppendExtension}
            />
          </EuiHeader>
        </div>

        <CollapsibleNav
          id={navId}
          userNavOptions={userNavOptions}
          isNavOpen={isNavOpen}
          selectedNavGroup={selectedNavGroup}
          setSelectedNavGroup={setSelectedNavGroup}
          selectedNavItem={selectedNavItem}
          setSelectedNavItem={setSelectedNavItem}
          navigateToUrl={navigateToUrl}
          navigationRedirectURLMapping={navigationRedirectURLMapping}
          closeNav={() => {
            setIsNavOpen(false);
            if (toggleCollapsibleNavRef.current) {
              toggleCollapsibleNavRef.current.focus();
            }
          }}
        />
      </header>
    </Wrapper>
  );
}
