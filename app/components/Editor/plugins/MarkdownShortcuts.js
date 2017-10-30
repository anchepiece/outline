// @flow
import type { change } from 'slate-prop-types';

type KeyData = {
  isMeta: boolean,
  key: string,
};

const inlineShortcuts = [
  { mark: 'bold', shortcut: '**' },
  { mark: 'bold', shortcut: '__' },
  { mark: 'italic', shortcut: '*' },
  { mark: 'italic', shortcut: '_' },
  { mark: 'code', shortcut: '`' },
  { mark: 'added', shortcut: '++' },
  { mark: 'deleted', shortcut: '~~' },
];

export default function MarkdownShortcuts() {
  return {
    /**
     * On key down, check for our specific key shortcuts.
     */
    onKeyDown(ev: SyntheticEvent, data: KeyData, change: change) {
      switch (data.key) {
        case '-':
          return this.onDash(ev, change);
        case '`':
          return this.onBacktick(ev, change);
        case 'tab':
          return this.onTab(ev, change);
        case 'space':
          return this.onSpace(ev, change);
        case 'backspace':
          return this.onBackspace(ev, change);
        case 'enter':
          return this.onEnter(ev, change);
        default:
          return null;
      }
    },

    /**
     * On space, if it was after an auto-markdown shortcut, convert the current
     * node into the shortcut's corresponding type.
     */
    onSpace(ev: SyntheticEvent, change: change) {
      const { state } = change;
      if (state.isExpanded) return;
      const { startBlock, startOffset } = state;
      const chars = startBlock.text.slice(0, startOffset).trim();
      const type = this.getType(chars);

      if (type) {
        if (type === 'list-item' && startBlock.type === 'list-item') return;
        ev.preventDefault();

        let checked;
        if (chars === '[x]') checked = true;
        if (chars === '[ ]') checked = false;
        const transform = state.change().setBlock({ type, data: { checked } });

        if (type === 'list-item') {
          if (checked !== undefined) {
            transform.wrapBlock('todo-list');
          } else if (chars === '1.') {
            transform.wrapBlock('ordered-list');
          } else {
            change.wrapBlock('bulleted-list');
          }
        }

        return change.extendToStartOf(startBlock).delete();
      }

      for (const key of inlineShortcuts) {
        // find all inline characters
        let { mark, shortcut } = key;
        let inlineTags = [];

        // only add tags if they have spaces around them or the tag is beginning or the end of the block
        for (let i = 0; i < startBlock.text.length; i++) {
          const { text } = startBlock;
          const start = i;
          const end = i + shortcut.length;
          const beginningOfBlock = start === 0;
          const endOfBlock = end === text.length;
          const surroundedByWhitespaces = [
            text.slice(start - 1, start),
            text.slice(end, end + 1),
          ].includes(' ');

          if (
            text.slice(start, end) === shortcut &&
            (beginningOfBlock || endOfBlock || surroundedByWhitespaces)
          )
            inlineTags.push(i);
        }

        // if we have multiple tags then mark the text between as inline code
        if (inlineTags.length > 1) {
          const change = state.change();
          const firstText = startBlock.getFirstText();
          const firstCodeTagIndex = inlineTags[0];
          const lastCodeTagIndex = inlineTags[inlineTags.length - 1];
          change.removeTextByKey(
            firstText.key,
            lastCodeTagIndex,
            shortcut.length
          );
          change.removeTextByKey(
            firstText.key,
            firstCodeTagIndex,
            shortcut.length
          );
          change.moveOffsetsTo(
            firstCodeTagIndex,
            lastCodeTagIndex - shortcut.length
          );
          change.addMark(mark);
          change.collapseToEnd().removeMark(mark);
          return change;
        }
      }
    },

    onDash(ev: SyntheticEvent, change: change) {
      const { state } = change;
      if (state.isExpanded) return;
      const { startBlock, startOffset } = state;
      const chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '');

      if (chars === '--') {
        ev.preventDefault();
        return state
          .change()
          .extendToStartOf(startBlock)
          .delete()
          .setBlock({
            type: 'horizontal-rule',
            isVoid: true,
          })
          .collapseToStartOfNextBlock()
          .insertBlock('paragraph')
          .apply();
      }
    },

    onBacktick(ev: SyntheticEvent, change: change) {
      const { state } = change;
      if (state.isExpanded) return;
      const { startBlock, startOffset } = state;
      const chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '');

      if (chars === '``') {
        ev.preventDefault();
        return state.change().extendToStartOf(startBlock).delete().setBlock({
          type: 'code',
        });
      }
    },

    onBackspace(ev: SyntheticEvent, change: change) {
      const { state } = change;
      if (state.isExpanded) return;
      const { startBlock, selection, startOffset } = state;

      // If at the start of a non-paragraph, convert it back into a paragraph
      if (startOffset === 0) {
        if (startBlock.type === 'paragraph') return;
        ev.preventDefault();

        const change = state.change().setBlock('paragraph');

        if (startBlock.type === 'list-item') {
          return change.unwrapBlock('bulleted-list');
        }

        return change;
      }

      // If at the end of a code mark hitting backspace should remove the mark
      if (selection.isCollapsed) {
        const marksAtCursor = startBlock.getMarksAtRange(selection);
        const codeMarksAtCursor = marksAtCursor.filter(
          mark => mark.type === 'code'
        );

        if (codeMarksAtCursor.size > 0) {
          ev.preventDefault();

          const textNode = startBlock.getTextAtOffset(startOffset);
          const charsInCodeBlock = textNode.characters
            .takeUntil((v, k) => k === startOffset)
            .reverse()
            .takeUntil((v, k) => !v.marks.some(mark => mark.type === 'code'));

          return state
            .change()
            .removeMarkByKey(
              textNode.key,
              state.startOffset - charsInCodeBlock.size,
              state.startOffset,
              'code'
            );
        }
      }
    },

    /**
     * On tab, if at the end of the heading jump to the main body content
     * as if it is another input field (act the same as enter).
     */
    onTab(ev: SyntheticEvent, change: change) {
      const { state } = change;
      if (state.startBlock.type === 'heading1') {
        ev.preventDefault();
        return state.change().splitBlock().setBlock('paragraph');
      }
    },

    /**
     * On return, if at the end of a node type that should not be extended,
     * create a new paragraph below it.
     */
    onEnter(ev: SyntheticEvent, change: change) {
      const { state } = change;
      if (state.isExpanded) return;
      const { startBlock, startOffset, endOffset } = state;
      if (startOffset === 0 && startBlock.length === 0)
        return this.onBackspace(ev, change);
      if (endOffset !== startBlock.length) return;

      // Hitting enter while an image is selected should jump caret below and
      // insert a new paragraph
      if (startBlock.type === 'image') {
        ev.preventDefault();
        return state.transform().collapseToEnd().insertBlock('paragraph');
      }

      // Hitting enter in a heading or blockquote will split the node at that
      // point and make the new node a paragraph
      if (
        startBlock.type !== 'heading1' &&
        startBlock.type !== 'heading2' &&
        startBlock.type !== 'heading3' &&
        startBlock.type !== 'heading4' &&
        startBlock.type !== 'heading5' &&
        startBlock.type !== 'heading6' &&
        startBlock.type !== 'block-quote'
      ) {
        return;
      }

      ev.preventDefault();
      return state.change().splitBlock().setBlock('paragraph');
    },

    /**
     * Get the block type for a series of auto-markdown shortcut `chars`.
     */
    getType(chars: string) {
      switch (chars) {
        case '*':
        case '-':
        case '+':
        case '1.':
        case '[ ]':
        case '[x]':
          return 'list-item';
        case '>':
          return 'block-quote';
        case '#':
          return 'heading1';
        case '##':
          return 'heading2';
        case '###':
          return 'heading3';
        case '####':
          return 'heading4';
        case '#####':
          return 'heading5';
        case '######':
          return 'heading6';
        default:
          return null;
      }
    },
  };
}
