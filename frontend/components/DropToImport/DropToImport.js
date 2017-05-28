// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Dropzone from 'react-dropzone';
import DocumentStore from 'stores/DocumentStore';

type Props = {
  history: Object,
  children?: any,
};

const style = {
  width: '100%',
};

class DropToImport extends Component {
  store: DocumentStore;
  props: Props;

  constructor(props: Props) {
    super(props);

    this.store = new DocumentStore({ history: this.props.history });
  }

  onDrop = (files: Array<File>) => {
    // TODO
    if (files.length) {
      const reader = new FileReader();
      reader.readAsText(files[0], 'UTF-8');
      reader.onload = ev => {
        const text = ev.target.result;
        this.store.updateText(text);
        this.store.saveDocument({ redirect: true });
      };
    }
  };

  render() {
    const { children } = this.props;

    return (
      <Dropzone
        disableClick
        accept="text/plain, text/markdown"
        onDrop={this.onDrop}
        style={style}
      >
        {({ isDragActive, isDragReject }) => {
          if (isDragActive) {
            return 'This file is authorized';
          }
          if (isDragReject) {
            return 'Drop a Markdown file to import.';
          }
          return children;
        }}
      </Dropzone>
    );
  }
}

export default withRouter(DropToImport);
