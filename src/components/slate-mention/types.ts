export type MentionElement = {
  type: 'mention';
  mention_tag: string;
  children: CustomText[];
};

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  text: string;
};

export type EmptyText = {
  text: string;
};
