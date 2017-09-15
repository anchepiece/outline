// @flow
import { Editor } from 'slate-react';
import type { change } from 'slate-prop-types';
import uuid from 'uuid';
import uploadFile from 'utils/uploadFile';

export default async function insertImageFile(
  change: change,
  file: window.File,
  editor: Editor,
  onImageUploadStart: () => void,
  onImageUploadStop: () => void
) {
  onImageUploadStart();

  try {
    // load the file as a data URL
    const id = uuid.v4();
    const alt = file.name;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const src = reader.result;

      // insert into document as uploading placeholder
      editor.onChange(
        change.insertBlock({
          type: 'image',
          isVoid: true,
          data: { src, alt, id, loading: true },
        })
      );
    });
    reader.readAsDataURL(file);

    // now we have a placeholder, start the upload
    const asset = await uploadFile(file);
    const src = asset.url;

    // we dont use the original transform provided to the callback here
    // as the state may have changed significantly in the time it took to
    // upload the file.
    const state = editor.getState();
    const finalChange = state.change();
    const placeholder = state.document.findDescendant(
      node => node.data && node.data.get('id') === id
    );

    return finalChange.setNodeByKey(placeholder.key, {
      data: { src, alt, loading: false },
    });
  } catch (err) {
    throw err;
  } finally {
    onImageUploadStop();
  }
}
