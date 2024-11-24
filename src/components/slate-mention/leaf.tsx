import { RenderLeafProps } from 'slate-react';

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children }) => {
  return <span {...attributes}>{children}</span>;
};

export default Leaf;
