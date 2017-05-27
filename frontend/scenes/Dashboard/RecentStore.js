// @flow
import { observable, action, runInAction } from 'mobx';
import invariant from 'invariant';
import { client } from 'utils/ApiClient';
import type { Pagination, Document } from 'types';

class RecentStore {
  team: Object;

  @observable documents: Array<Document>;
  @observable pagination: Pagination;
  @observable isFetching: boolean = true;

  /* Actions */

  @action fetchDocuments = async () => {
    this.isFetching = true;

    try {
      const res = await client.get('/documents.recent');
      invariant(
        res && res.data && res.pagination,
        'API response should be available'
      );
      const { data, pagination } = res;
      runInAction('fetchDocuments', () => {
        this.documents = data;
        this.pagination = pagination;
      });
    } catch (e) {
      console.error('Something went wrong');
    }
    this.isFetching = false;
  };

  constructor() {
    this.fetchDocuments();
  }
}

export default RecentStore;
