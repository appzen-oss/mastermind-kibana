import { EuiFlexItem, EuiText } from '@elastic/eui';
import React from 'react';
import styled from 'styled-components';
import { IconType, useNavIcon } from '../use_navIcon';

interface Props {
  iconType: IconType | undefined;
  title: string;
  navDepth: number;
  isActive: boolean;
}

const NavGroupTitleWrapper = styled(EuiFlexItem)<{ navDepth: number }>`
  && {
    flex-direction: row;
    align-items: center;
    margin-left: ${(props) => (props.navDepth === 0 ? '5px': '20px')};
  }
  &:hover {
    background-color: white;
    color: #1d25d4;
  }
`;

const NavGroupTitleText = styled(EuiText)<{ isActive: boolean }>`
  margin-left: 5px;
  color: ${(props) => (props.isActive ? '#1d25d4' : 'black')};
`;

export const CollapsibleNavGroupTitle = ({
  iconType,
  title,
  navDepth,
  isActive = false,
}: Props) => {
  const { navIcon } = useNavIcon(iconType);
  return (
    <NavGroupTitleWrapper navDepth={navDepth}>
      {navIcon}
      <NavGroupTitleText size="s" isActive={isActive}>
        {title}
      </NavGroupTitleText>
    </NavGroupTitleWrapper>
  );
};
