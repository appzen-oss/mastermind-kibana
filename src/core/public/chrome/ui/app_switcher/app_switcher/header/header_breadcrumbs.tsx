import { EuiFlexGroup, EuiHeaderBreadcrumbs } from '@elastic/eui';
import classNames from 'classnames';
import React from 'react';
import { ChromeBreadcrumb, ChromeBreadcrumbsAppendExtension } from '../../common/types/types';
import { HeaderExtension } from './header_extension';

interface Props {
  appTitle: string;
  breadcrumbs: ChromeBreadcrumb[];
  breadcrumbsAppendExtension: ChromeBreadcrumbsAppendExtension | undefined;
}

export function HeaderBreadcrumbs({ appTitle, breadcrumbs, breadcrumbsAppendExtension }: Props) {
  let crumbs = breadcrumbs;

  if (breadcrumbs.length === 0 && appTitle) {
    crumbs = [{ text: appTitle }];
  }

  crumbs = crumbs.map((breadcrumb, i) => ({
    ...breadcrumb,
    'data-test-subj': classNames(
      'breadcrumb',
      breadcrumb['data-test-subj'],
      i === 0 && 'first',
      i === breadcrumbs.length - 1 && 'last'
    ),
  }));

  if (breadcrumbsAppendExtension && crumbs[crumbs.length - 1]) {
    const lastCrumb = crumbs[crumbs.length - 1];
    lastCrumb.text = (
      <EuiFlexGroup responsive={false} gutterSize={'none'} alignItems={'baseline'}>
        <div className="eui-textTruncate">{lastCrumb.text}</div>
        <HeaderExtension extension={breadcrumbsAppendExtension.content} />
      </EuiFlexGroup>
    );
  }
  return <EuiHeaderBreadcrumbs breadcrumbs={crumbs} max={10} data-test-subj="breadcrumbs" />;
}
