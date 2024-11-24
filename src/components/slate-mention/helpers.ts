import { Editor, Transforms } from 'slate';
import { MentionElement } from './types';

export const insertMention = (editor: Editor, mention_tag: string) => {
  const mention: MentionElement = {
    type: 'mention',
    mention_tag,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};
