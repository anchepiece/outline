// @flow
import React from 'react';
import { observer } from 'mobx-react';
import styled, { injectGlobal } from 'styled-components';
import ReactModal from 'react-modal';
import { color } from 'shared/styles/constants';
import { fadeAndScaleIn } from 'shared/styles/animations';
import CloseIcon from 'components/Icon/CloseIcon';
import Flex from 'shared/components/Flex';

type Props = {
  children?: React$Element<any>,
  isOpen: boolean,
  title?: string,
  onRequestClose: () => void,
};

injectGlobal`
  .ReactModal__Body--open {
    overflow: hidden;
  }
`;

const Modal = ({
  children,
  isOpen,
  title = 'Untitled',
  onRequestClose,
  ...rest
}: Props) => {
  if (!isOpen) return null;

  return (
    <StyledModal
      contentLabel={title}
      onRequestClose={onRequestClose}
      isOpen={isOpen}
      {...rest}
    >
      <Content column>
        {title && <h1>{title}</h1>}
        <Close onClick={onRequestClose}><CloseIcon size={32} /></Close>
        {children}
      </Content>
    </StyledModal>
  );
};

const Content = styled(Flex)`
  width: 640px;
  max-width: 100%;
  position: relative;
`;

const StyledModal = styled(ReactModal)`
  animation: ${fadeAndScaleIn} 250ms ease;

  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
  background: white;
  padding: 13vh 2rem 2rem;
  outline: none;
`;

const Close = styled.a`
  position: fixed;
  top: 3rem;
  right: 3rem;
  opacity: .5;
  color: ${color.text};

  &:hover {
    opacity: 1;
  }
`;

export default observer(Modal);
