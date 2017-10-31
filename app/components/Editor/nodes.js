// @flow
import React from 'react';
import Code from './components/Code';
import HorizontalRule from './components/HorizontalRule';
import Image from './components/Image';
import Link from './components/Link';
import ListItem from './components/ListItem';
import TodoList from './components/TodoList';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from './components/Heading';
import Paragraph from './components/Paragraph';
import type { props } from 'slate-prop-types';

export default function renderNode(props: props) {
  switch (props.node.type) {
    case 'paragraph':
      return <Paragraph {...props} />;
    case 'block-quote':
      return <blockquote>{props.children}</blockquote>;
    case 'bulleted-list':
      return <ul>{props.children}</ul>;
    case 'ordered-list':
      return <ol>{props.children}</ol>;
    case 'todo-list':
      return <TodoList>{props.children}</TodoList>;
    case 'table':
      return <table>{props.children}</table>;
    case 'table-row':
      return <tr>{props.children}</tr>;
    case 'table-head':
      return <th>{props.children}</th>;
    case 'table-cell':
      return <td>{props.children}</td>;
    case 'list-item':
      return <ListItem {...props} />;
    case 'horizontal-rule':
      return <HorizontalRule {...props} />;
    case 'code':
      return <Code {...props} />;
    case 'image':
      return <Image {...props} />;
    case 'link':
      return <Link {...props} />;
    case 'heading1':
      return <Heading1 placeholder {...props} />;
    case 'heading2':
      return <Heading2 {...props} />;
    case 'heading3':
      return <Heading3 {...props} />;
    case 'heading4':
      return <Heading4 {...props} />;
    case 'heading5':
      return <Heading5 {...props} />;
    case 'heading6':
      return <Heading6 {...props} />;
    default:
  }
}
