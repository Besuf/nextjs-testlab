export type MentionElement = {
  type: 'mention';
  character: string;
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
