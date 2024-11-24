import { BaseElement, Editor } from 'slate';

interface CustomElement extends BaseElement {
  type: string;
}

const withMentions = (editor: Editor) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element) => {
    const customElement = element as CustomElement;
    return customElement.type === 'mention' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    const customElement = element as CustomElement;
    return customElement.type === 'mention' ? true : isVoid(element);
  };

  editor.markableVoid = (element) => {
    const customElement = element as CustomElement;
    return customElement.type === 'mention' || markableVoid(element);
  };

  return editor;
};

export default withMentions;
