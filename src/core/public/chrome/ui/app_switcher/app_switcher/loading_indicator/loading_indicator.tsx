import { EuiLoadingSpinner, EuiProgress, EuiIcon } from '@elastic/eui';
import React from 'react';
import classNames from 'classnames';

export interface LoadingIndicatorProps {
  loadingCount: number;
  showAsBar?: boolean;
}

export class LoadingIndicator extends React.Component<LoadingIndicatorProps, { visible: boolean }> {
  public static defaultProps = { showAsBar: false };

  render() {
    const className = classNames(!(this.props.loadingCount > 0) && 'kbnLoadingIndicator-hidden');

    const testSubj = (this.props.loadingCount > 0)
      ? 'globalLoadingIndicator'
      : 'globalLoadingIndicator-hidden';

    const ariaHidden = (this.props.loadingCount > 0) ? false : true;

    const ariaLabel = 'Loading content';

    const logo = (this.props.loadingCount > 0) ? (
      <EuiLoadingSpinner
        size="l"
        data-test-subj={testSubj}
        aria-hidden={false}
        aria-label={ariaLabel}
      />
    ) : (
      <></>
    );

    return !this.props.showAsBar ? (
      logo
    ) : (
      <EuiProgress
        className={className}
        data-test-subj={testSubj}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        position="fixed"
        color="accent"
        size="xs"
      />
    );
  }
}
