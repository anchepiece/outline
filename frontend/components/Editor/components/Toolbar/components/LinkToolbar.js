// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import type { state, change } from 'slate-prop-types';
import ToolbarButton from './ToolbarButton';
import keydown from 'react-keydown';
import Icon from 'components/Icon';
import Flex from 'components/Flex';

@keydown
export default class LinkToolbar extends Component {
  input: HTMLElement;
  props: {
    state: state,
    link: Object,
    onBlur: () => void,
    onChange: change => void,
  };

  onKeyDown = (ev: SyntheticKeyboardEvent & SyntheticInputEvent) => {
    switch (ev.keyCode) {
      case 13: // enter
        ev.preventDefault();
        return this.save(ev.target.value);
      case 27: // escape
        return this.input.blur();
      default:
    }
  };

  removeLink = () => {
    this.save('');
  };

  save = (href: string) => {
    href = href.trim();
    const change = this.props.state.change();
    change.unwrapInline('link');

    if (href) {
      const data = { href };
      change.wrapInline({ type: 'link', data });
    }

    this.props.onChange(change);
    this.input.blur();
  };

  render() {
    const href = this.props.link.data.get('href');
    return (
      <LinkEditor>
        <Input
          innerRef={ref => (this.input = ref)}
          defaultValue={href}
          placeholder="http://"
          onBlur={this.props.onBlur}
          onKeyDown={this.onKeyDown}
          autoFocus
        />
        <ToolbarButton onMouseDown={this.removeLink}>
          <Icon type="X" light />
        </ToolbarButton>
      </LinkEditor>
    );
  }
}

const LinkEditor = styled(Flex)`
  margin-left: -8px;
  margin-right: -8px;
`;

const Input = styled.input`
  background: rgba(255,255,255,.1);
  border-radius: 2px;
  padding: 5px 8px;
  border: 0;
  margin: 0;
  outline: none;
  color: #fff;
  flex-grow: 1;
`;
