// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import type { Document } from 'types';
import DocumentLink from './components/DocumentLink';
import styles from './Collection.scss';

type Data = {
  url: string,
  name: string,
  recentDocuments: Array<Document>,
};

class Collection extends Component {
  props: {
    data: Data,
  };

  render() {
    const { data } = this.props;
    const hasRecentDocuments = data.recentDocuments.length > 0;

    return (
      <div className={styles.container}>
        <h2>
          <Link to={data.url} className={styles.atlasLink}>{data.name}</Link>
        </h2>
        {hasRecentDocuments
          ? data.recentDocuments.map(document => (
              <DocumentLink key={document.id} document={document} />
            ))
          : <div className={styles.description}>
              No documents. Why not
              {' '}
              <Link to={`${data.url}/new`}>create one</Link>
              ?
            </div>}
      </div>
    );
  }
}

export default Collection;
