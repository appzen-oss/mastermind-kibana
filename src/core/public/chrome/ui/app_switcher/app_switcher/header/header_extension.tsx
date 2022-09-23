import React from 'react';
import { MountPoint } from '../../common/types/types';

interface Props {
  extension?: MountPoint<HTMLDivElement>;
  display?: 'block' | 'inlineBlock';
}

export class HeaderExtension extends React.Component<Props> {
  private readonly ref = React.createRef<HTMLDivElement>();
  private unrender?: () => void;

  public componentDidMount() {
    this.renderExtension();
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.extension === prevProps.extension) {
      return;
    }

    this.unrenderExtension();
    this.renderExtension();
  }

  public componentWillUnmount() {
    this.unrenderExtension();
  }

  public render() {
    return (
      <div
        ref={this.ref}
        style={{ display: this.props.display === 'inlineBlock' ? 'inline-block' : undefined }}
      />
    );
  }

  private renderExtension() {
    if (!this.ref.current) {
      throw new Error('<HeaderExtension /> mounted without ref');
    }

    if (this.props.extension) {
      this.unrender = this.props.extension(this.ref.current);
    }
  }

  private unrenderExtension() {
    if (this.unrender) {
      this.unrender();
      this.unrender = undefined;
    }
  }
}
