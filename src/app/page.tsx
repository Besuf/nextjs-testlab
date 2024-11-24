'use client';
import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
} from 'react';
import { Editor, Transforms, Range, createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  RenderLeafProps,
  RenderElementProps,
} from 'slate-react';

import Portal from '@/components/Portal';
import withMentions from '@/components/slate-mention/withMentions';
import { insertMention } from '@/components/slate-mention/helpers';
import Leaf from '@/components/slate-mention/leaf';
import Element from '@/components/slate-mention/element';
import { MENTIONS } from '@/components/slate-mention/dummy-data';

const MentionExample = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<Range | undefined>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(
    () => withMentions(withReact(withHistory(createEditor()))) as ReactEditor,
    []
  );

  const mentions = MENTIONS.filter((c) =>
    c.toLowerCase().startsWith(search.toLowerCase())
  ).slice(0, 10);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement> | undefined) => {
      if (event && target && mentions.length > 0) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            const prevIndex = index >= mentions.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case 'ArrowUp':
            event.preventDefault();
            const nextIndex = index <= 0 ? mentions.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, mentions[index]);
            setTarget(undefined);
            break;
          case 'Escape':
            event.preventDefault();
            setTarget(undefined);
            break;
        }
      }
    },
    [mentions, editor, index, target]
  );

  useEffect(() => {
    if (target && mentions.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor as ReactEditor, target);
      const rect = domRange.getBoundingClientRect();
      if (!el) return;
      el.style.top = `${rect.top + window.scrollY + 24}px`;
      el.style.left = `${rect.left + window.scrollX}px`;
    }
  }, [mentions.length, editor, index, search, target]);

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={() => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const wordBefore = Editor.before(editor, start, { unit: 'word' });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);
          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);

          if (beforeMatch && afterMatch) {
            setTarget(beforeRange);
            setSearch(beforeMatch[1]);
            setIndex(0);
            return;
          }
        }

        setTarget(undefined);
      }}
    >
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
        placeholder='Write your post...'
      />
      {target && mentions.length > 0 && (
        <Portal>
          <div
            ref={ref}
            style={{
              top: '-9999px',
              left: '-9999px',
              position: 'absolute',
              zIndex: 1,
              padding: '3px',
              background: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 5px rgba(0,0,0,.2)',
            }}
            data-cy='mentions-portal'
          >
            {mentions.map((mention, i) => (
              <div
                key={mention}
                onClick={() => {
                  Transforms.select(editor, target);
                  insertMention(editor, mention);
                  setTarget(undefined);
                }}
                style={{
                  padding: '1px 3px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  background: i === index ? '#B4D5FF' : 'transparent',
                }}
              >
                {mention}
              </div>
            ))}
          </div>
        </Portal>
      )}
    </Slate>
  );
};

const initialValue: Descendant[] = [
  {
    children: [{ text: '' }],
  },
];

export default MentionExample;
