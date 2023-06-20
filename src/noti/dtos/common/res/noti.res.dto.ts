import {
  CommentReactionType,
  NotiSenderType,
  NotiType,
  PostReactionType,
} from 'shared';
import { UserResDto } from '../../../../auth/dtos/common/res/user.res.dto';
import { Noti } from '../../../entities/noti.entity';

export interface NotiResDtoParams {
  data?: Noti;
  content?: string;
}

export class NotiResDto {
  id: number;
  type: NotiType;
  link: string;
  senderType: NotiSenderType;
  userId: number;
  user: UserResDto;
  senderUserId: number;
  senderUser: UserResDto;
  content: string;
  updatedAt: Date;
  reactionType: PostReactionType | CommentReactionType;
  readAt: Date

  static mapProperty(dto: NotiResDto, { data, content }: NotiResDtoParams) {
    dto.id = data.id;
    dto.type = data.type;
    dto.senderType = data.senderType;
    dto.link = data.link;
    dto.userId = data.userId;
    dto.senderUserId = data.senderUserId;
    dto.updatedAt = data.updatedAt;
    dto.content = content;
    dto.reactionType = data.reactionType;
    dto.readAt  = data.readAt
  }

  static forUser(params: NotiResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new NotiResDto();

    this.mapProperty(result, params);

    result.user = UserResDto.forUser({ data: data.user });
    result.senderUser = UserResDto.forUser({ data: data.senderUser });

    return result;
  }
}
