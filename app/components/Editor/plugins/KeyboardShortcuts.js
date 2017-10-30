// @flow
import { change } from 'slate-prop-types';

type KeyData = {
  isMeta: boolean,
  key: string,
};

export default function KeyboardShortcuts() {
  return {
    /**
     * On key down, check for our specific key shortcuts.
     *
     * @param {Event} e
     * @param {Data} data
     * @param {State} state
     * @return {State or Null} state
     */
    onKeyDown(ev: SyntheticEvent, data: KeyData, change: change) {
      if (!data.isMeta) return null;

      switch (data.key) {
        case 'b':
          return this.toggleMark(change, 'bold');
        case 'i':
          return this.toggleMark(change, 'italic');
        case 'u':
          return this.toggleMark(change, 'underlined');
        case 'd':
          return this.toggleMark(change, 'deleted');
        default:
          return null;
      }
    },

    toggleMark(change: change, type: string) {
      // don't allow formatting of document title
      const { state } = change;
      const firstNode = state.document.nodes.first();
      if (firstNode === state.startBlock) return;

      return change.toggleMark(type);
    },
  };
}
