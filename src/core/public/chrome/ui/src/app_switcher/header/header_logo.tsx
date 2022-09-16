import { i18n } from '@kbn/i18n';
import React from 'react';
import useObservable from 'react-use/lib/useObservable';
import { Observable } from 'rxjs';
import Url from 'url';
import { EuiIcon, EuiText, EuiTextColor } from '@elastic/eui';
import { ChromeNavLink } from '../../common/types/types';
import { LoadingIndicator } from '../loading_indicator/loading_indicator';
import { HttpStart } from '../../../packages/http/types';
import AppzenLogoDark from '../../common/assets/images/appzen-logo-dark.svg';

function findClosestAnchor(element: HTMLElement): HTMLAnchorElement | void {
  let current = element;
  while (current) {
    if (current.tagName === 'A') {
      return current as HTMLAnchorElement;
    }

    if (!current.parentElement || current.parentElement === document.body) {
      return undefined;
    }

    current = current.parentElement;
  }
}

function onClick(
  event: React.MouseEvent<HTMLAnchorElement>,
  forceNavigation: boolean,
  navLinks: ChromeNavLink[],
  navigateToApp: (appId: string) => void
) {
  const anchor = findClosestAnchor((event as any).nativeEvent.target);
  if (!anchor) {
    return;
  }

  const navLink = navLinks.find((item) => item.href === anchor.href);
  if (navLink && navLink.disabled) {
    event.preventDefault();
    return;
  }

  if (event.isDefaultPrevented() || event.altKey || event.metaKey || event.ctrlKey) {
    return;
  }

  if (forceNavigation) {
    const toParsed = Url.parse(anchor.href);
    const fromParsed = Url.parse(document.location.href);
    const sameProto = toParsed.protocol === fromParsed.protocol;
    const sameHost = toParsed.host === fromParsed.host;
    const samePath = toParsed.path === fromParsed.path;

    if (sameProto && sameHost && samePath) {
      if (toParsed.hash) {
        document.location.reload();
      }

      // event.preventDefault() keeps the browser from seeing the new url as an update
      // and even setting window.location does not mimic that behavior, so instead
      // we use stopPropagation() to prevent angular from seeing the click and
      // starting a digest cycle/attempting to handle it in the router.
      event.stopPropagation();
    }
  } else {
    navigateToApp('invoice');
    event.preventDefault();
  }
}

interface Props {
  href: string;
  navLinks: ChromeNavLink[];
  forceNavigation: boolean;
  navigateToApp: (appId: string) => void;
  loadingCount: number;
}

export function HeaderLogo({ href, navigateToApp, loadingCount, forceNavigation, navLinks }: Props) {
  return (
    <a
      onClick={(e) => onClick(e, forceNavigation, navLinks, navigateToApp)}
      className="euiHeaderLogo"
      href={href}
      data-test-subj="logo"
      aria-label={i18n.translate('core.ui.chrome.headerGlobalNav.goHomePageIconAriaLabel', {
        defaultMessage: 'AppZen home',
      })}
    >
      <LoadingIndicator loadingCount={loadingCount} />
      <EuiText size="s" style={{ paddingLeft:"8px" }}>
        <EuiIcon type={AppzenLogoDark} size="m"/>
      </EuiText>
    </a>
  );
}
