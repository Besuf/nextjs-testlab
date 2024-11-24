import { IS_MAC } from '@/utils/environment';
import { Fragment } from 'react';
import { RenderElementProps, useFocused, useSelected } from 'slate-react';
import { MentionElement } from './types';
import { BaseElement } from 'slate';

interface CustomElement extends BaseElement {
  type: string;
}

const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  const customElement = element as CustomElement;
  switch (customElement.type) {
    case 'mention':
      return <Mention {...props} />;
    default:
      return <div {...attributes}>{children}</div>;
  }
};

const Mention = ({ attributes, children, element }: RenderElementProps) => {
  const customElement = element as MentionElement;
  const selected = useSelected();
  const focused = useFocused();
  const style: React.CSSProperties = {
    padding: '3px 3px 2px',
    margin: '0 1px',
    verticalAlign: 'baseline',
    display: 'inline-block',
    borderRadius: '4px',
    backgroundColor: '#eee',
    fontSize: '0.9em',
    boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
  };
  //   // See if our empty text child has any styling marks applied and apply those
  //   if (element.children[0].bold) {
  //     style.fontWeight = 'bold';
  //   }
  //   if (element.children[0].italic) {
  //     style.fontStyle = 'italic';
  //   }
  return (
    <div
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${customElement.mention_tag.replace(' ', '-')}`}
      style={style}
    >
      {/* Prevent Chromium from interrupting IME when moving the cursor */}
      {/* 1. span + inline-block 2. div + contenteditable=false */}
      <div contentEditable={false}>
        {IS_MAC ? (
          // Mac OS IME https://github.com/ianstormtaylor/slate/issues/3490
          <Fragment>
            {children}@{customElement.mention_tag}
          </Fragment>
        ) : (
          // Others like Android https://github.com/ianstormtaylor/slate/pull/5360
          <Fragment>
            @{customElement.mention_tag}
            {children}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Element;
