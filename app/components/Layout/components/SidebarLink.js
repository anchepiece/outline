// @flow
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { NavLink } from 'react-router-dom';
import { color, fontWeight } from 'shared/styles/constants';
import styled from 'styled-components';
import Flex from 'shared/components/Flex';
import CollapsedIcon from 'components/Icon/CollapsedIcon';

const activeStyle = {
  color: color.black,
  fontWeight: fontWeight.semiBold,
};

// This is a hack for `styleComponent()` as NavLink fails to render without `to` prop
const StyleableDiv = props => <div {...props} />;

const StyledGoTo = styled(CollapsedIcon)`
  margin-bottom: -4px;
  margin-right: 0;
  ${({ expanded }) => !expanded && 'transform: rotate(-90deg);'}
`;

const IconWrapper = styled.span`
  margin-left: -4px;
  margin-right: 4px;
  height: 24px;
`;

const styleComponent = component => styled(component)`
  display: flex;
  width: 100%;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 4px 0;
  margin-left: ${({ hasChildren }) => (hasChildren ? '-20px;' : '0')};
  color: ${color.slateDark};
  font-size: 15px;
  cursor: pointer;

  &:hover {
    color: ${color.text};
  }

  &.active {
    svg {
      fill: ${activeStyle.color}
    }
  }
`;

type Props = {
  to?: string,
  onClick?: SyntheticEvent => *,
  children?: React$Element<*>,
  icon?: React$Element<*>,
  expand?: boolean,
  expandedContent?: React$Element<*>,
};

@observer class SidebarLink extends Component {
  props: Props;

  componentDidMount() {
    if (this.props.expand) this.handleExpand();
  }

  componentDidReceiveProps(nextProps: Props) {
    if (nextProps.expand) this.handleExpand();
  }

  @observable expanded: boolean = false;

  @action handleClick = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    this.expanded = !this.expanded;
  };

  @action handleExpand = () => {
    this.expanded = true;
  };

  render() {
    const { icon, children, expandedContent, ...rest } = this.props;
    const Component = styleComponent(rest.to ? NavLink : StyleableDiv);

    return (
      <Flex column>
        <Component
          exact
          activeStyle={activeStyle}
          hasChildren={expandedContent}
          {...rest}
        >
          {icon && <IconWrapper>{icon}</IconWrapper>}
          {expandedContent &&
            <StyledGoTo expanded={this.expanded} onClick={this.handleClick} />}
          <Content onClick={this.handleExpand}>{children}</Content>
        </Component>
        {this.expanded && expandedContent}
      </Flex>
    );
  }
}

const Content = styled.div`
  width: 100%;
`;

export default SidebarLink;
