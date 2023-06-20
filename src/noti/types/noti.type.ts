export class BaseNotiParamProperty {
  value: string;
  isNeedI18: boolean;
}

export class PostReactionNotiParams {
  content: BaseNotiParamProperty;
  react: BaseNotiParamProperty & {
    value: 'like' | 'love' | 'angry';
  };
}

export class CommentReactionNotiParams {
  content: BaseNotiParamProperty;
  react: BaseNotiParamProperty & {
    value: 'like' | 'love' | 'angry';
  };
}
