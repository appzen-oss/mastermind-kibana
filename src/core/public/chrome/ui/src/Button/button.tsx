import React from 'react'
import styled from 'styled-components';

interface Props {
  type: 'Primary' | 'Secondary'
}

interface ButtonProps {
  buttonType: 'Primary' | 'Secondary'
}
const StyledButton = styled.button<ButtonProps>`
  color: ${((props) => (props.buttonType === 'Primary' ? 'blue' : 'green'))};
`;

const Button = ({ type }: Props) => {
  return (
    <StyledButton buttonType={type}>Click Me!</StyledButton>
  )
}

export default Button;