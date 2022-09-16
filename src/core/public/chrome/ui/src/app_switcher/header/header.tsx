import { EuiButtonEmpty, EuiFlexGroup, EuiFlexItem, EuiHeader, EuiHeaderSectionItemButton, EuiIcon, EuiPopover, EuiSuperSelect, EuiSuperSelectOption, EuiText, htmlIdGenerator } from "@elastic/eui";
import { globalConfig, sideNavComputations } from "@az/common-configs";
import { i18n } from "@kbn/i18n";
import classnames from "classnames";
import React, { createRef, useEffect, useState } from "react";
import { HeaderBreadcrumbs } from "./header_breadcrumbs";
import { HeaderLogo } from "./header_logo";
import styled from "styled-components";
import { ChromeBreadcrumb, ChromeBreadcrumbsAppendExtension, ChromeNavLink, NavigateToAppFunction, NavigateToUrlFunction, NavigationObject } from "../../common/types/types";
import { HttpStart } from "../../../packages/http/types";
import { LoadingIndicator } from "../loading_indicator/loading_indicator";
import { UserDetails } from "../../common/types/user";
import { CollapsibleNav } from "../collapsible_nav/collapsible_nav";

export interface HeaderProps {
  switchToAdminAPI: () => Promise<any>;
  switchToUserAPI: (userId: string, customerId: string) => Promise<any>;
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
  button.euiSuperSelect--isOpen__button {
    border: 1px solid #ABB2B6 !important;
  }

  button.euiSuperSelectControl {
    background-color: #25282F !important;
    color: #fff !important;

    &:hover {
      border: 1px solid #ABB2B6;
      border-radius: 5px;
    }
  }

  div.euiFormControlLayoutIcons.euiFormControlLayoutIcons--right {
    color: #fff;
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
const StyledUserMenuButton = styled(EuiButtonEmpty)`
  color: white;
  border: 1px solid white;
  border-radius: 5px;
  margin-right: 1rem;

  &:hover {
    background-color: white;
    color: black;
    text-decoration: none !important;
  }
`;

const { sideNavOptions } = globalConfig;
export function Header({ navigateToApp, navigateToUrl, switchToAdminAPI, switchToUserAPI, homeHref, isVisible, forceAppSwitcherNavigation, navLinks, appTitle, breadcrumbs, breadcrumbsAppendExtension, loadingCount }: HeaderProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedNavGroup, setSelectedNavGroup] = useState<string[]>([]);
  const [selectedNavItem, setSelectedNavItem] = useState<string | null>(null);
  const [userNavOptions, setuserNavOptions] = useState<NavigationObject[]>([]);
  const [userAccountSelected, setUserAccountSelected] = useState<string | null>(null);
  const toggleCollapsibleNavRef = createRef<HTMLButtonElement>();
  const navId = htmlIdGenerator()();
  const className = classnames("hide-for-sharing", "headerGlobalNav");

  const userAccountOptions: Array<EuiSuperSelectOption<string>> = userDetails
    ? userDetails.userAccounts.map((userAccount) => ({
        value: userAccount.customerId,
        inputDisplay: userAccount.customerName,
        dropdownDisplay: (
          <div style={{ width: "max-content" }}>
            <span>{userAccount.customerName}</span>
          </div>
        ),
      }))
    : [];

  const initializeNav = (navOptions: NavigationObject[] = []) => {
    let parentNavGroup: NavigationObject | undefined;
    navOptions.some(function checkSelectedNavOption(navOption: NavigationObject): undefined {
      if (navOption?.url) {
        if (navOption?.url.replace("/mastermind", "").split("?")[0] === window.location.pathname) {
          setSelectedNavItem(navOption.id);
          setSelectedNavGroup(navOption?.groupState ? navOption.groupState : parentNavGroup?.id ? [parentNavGroup.id] : []);
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
      const res = await switchToAdminAPI();
      navigateToUrl(navigationRedirectURLMapping(window.location.hostname, "/console/index.html"));
    } catch (e) {}
  };

  const switchUserAccount = async (selectedAccountOptionValue: string) => {
    try {
      setUserAccountSelected(selectedAccountOptionValue);
      const selectedUserAccount = userDetails?.userAccounts.find((userAccount) => userAccount.customerId === selectedAccountOptionValue);
      if (selectedUserAccount) {
        const res = await switchToUserAPI(selectedUserAccount.azUserId, selectedUserAccount.customerId);
        navigateToUrl(navigationRedirectURLMapping(window.location.hostname, "/console/index.html"));
      }
    } catch (e) {}
  };

  useEffect(() => {
    async function fetchUserDetails() {
      const res = await fetch(`/api/mastermind_security/user?param=true`);
      const userData = await res.json();
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

  function navigationRedirectURLMapping(hostname, targetURL) {
    const consoleMastermindHostnameMapping = {
      "mastermind.enft.dev.appzen.com": "console.enft.dev.appzen.com",
      "mastermind.us.sandbox.appzen.com": "console.us.sandbox.appzen.com",
      "mastermind.appzen.com": "audit.appzen.com",
      "eu-mastermind.appzen.com": "eu.appzen.com",
      "a-mastermind.appzen.com": "a.appzen.com",
    };

    if (hostname.includes("mastermind")) {
      if (targetURL.includes("/mastermind")) {
        if (hostname === "localhost") {
          return `http://localhost:5601${targetURL.replace("/mastermind", "")}`;
        }
        return `https://${hostname}${targetURL.replace("/mastermind", "")}`;
      }
      return `https://${consoleMastermindHostnameMapping[hostname]}${targetURL}`;
    }
    return `${window.location.origin}${targetURL.replace("/mastermind", "")}`;
  }

  const userMenuOptions = [
    {
      value: "user_settings",
      inputDisplay: "User Settings",
      onClick() {
        navigateToUrl("/app/approval/settings");
      },
      dropdownDisplay: (
        <div className="user-account--dropdown-wrapper">
          <strong>User Settings</strong>
        </div>
      ),
    },
    {
      value: "log_out",
      inputDisplay: "Log Out",
      onClick() {
        navigateToUrl(navigationRedirectURLMapping(window.location.hostname, '/console/home.html'));
      },
      dropdownDisplay: (
        <div className="user-account--dropdown-wrapper">
          <strong>Log Out</strong>
        </div>
      ),
    },
  ];

  const renderUserCustomer = () => {
    return (
      <EuiText size="s" color="ghost">
        {userDetails ? `${userDetails.customerName}` : ""}
      </EuiText>
    );
  };

  const renderUserMenuPopover = () => {
    const button = (
      <>
        {userDetails && (
          <StyledUserMenuButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
            <EuiText size="s">{userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : ""}</EuiText>
          </StyledUserMenuButton>
        )}
      </>
    );

    return (
      <EuiPopover button={button} isOpen={isUserMenuOpen} closePopover={() => setIsUserMenuOpen(false)} hasArrow={false}>
        <EuiFlexGroup direction="column">
          {userMenuOptions.map((userMenuOption) => (
            <EuiFlexItem style={{ margin: "0px" }}>
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
    <EuiFlexGroup direction="row" style={{ alignItems: "center" }}>
      <EuiFlexItem style={{ width: "max-content" }}>{renderUserCustomer()}</EuiFlexItem>
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
                    aria-label={i18n.translate("core.ui.primaryNav.toggleNavAriaLabel", {
                      defaultMessage: "Toggle primary navigation",
                    })}
                    onClick={() => setIsNavOpen(!isNavOpen)}
                    aria-expanded={isNavOpen}
                    aria-pressed={isNavOpen}
                    aria-controls={navId}
                    ref={toggleCollapsibleNavRef}
                  >
                    <EuiIcon type="menu" size="m" />
                  </EuiHeaderSectionItemButton>,
                  <HeaderLogo href={homeHref} forceNavigation={forceAppSwitcherNavigation} navLinks={navLinks} navigateToApp={navigateToApp} loadingCount={loadingCount} />,
                ],
                borders: "none",
              },
              {
                items: [
                  <>
                    {userDetails && userDetails.userAccounts.length > 1 && (
                      <div style={{ width: "max-content", borderRadius: "5px" }}>
                        <EuiSuperSelect options={userAccountOptions} valueOfSelected={userAccountSelected || ''} onChange={switchUserAccount} fullWidth itemLayoutAlign="center" />
                      </div>
                    )}
                  </>,
                ],
                borders: "none",
              },
              {
                items: [
                  <>{renderUserMenuHeaders()}</>,
                  <>
                    {userDetails?.emulatedByAppzenSuperAdmin && (
                      <StyledUserMenuButton onClick={switchToAdmin}>
                        <EuiText size="s">Switch User</EuiText>
                      </StyledUserMenuButton>
                    )}
                  </>,
                ],
                borders: "none",
              },
            ]}
          />

          <EuiHeader position="fixed">
            <HeaderBreadcrumbs appTitle={appTitle} breadcrumbs={breadcrumbs} breadcrumbsAppendExtension={breadcrumbsAppendExtension} />
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
