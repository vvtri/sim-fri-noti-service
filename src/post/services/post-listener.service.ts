import { Injectable } from '@nestjs/common';
import {
  EachMessagePayload,
  KafkaListener,
  SubscribeTo,
} from '@vvtri/nestjs-kafka';
import {
  DeleteCommentReactionKafkaPayload,
  KAFKA_TOPIC,
  SavePostReactionKafkaPayload,
} from 'common';
import { NotiSenderType, NotiType, PostReactionType } from 'shared';
import { Transactional } from 'typeorm-transactional';
import { NotiRepository } from '../../noti/repositories/noti.repository';
import { PostReactionNotiParams } from '../../noti/types/noti.type';

@Injectable()
@KafkaListener()
export class PostListenerService {
  constructor(private notiRepo: NotiRepository) {}

  @SubscribeTo(KAFKA_TOPIC.POST_REACTION_SAVED)
  @Transactional()
  async handlePostCreated({
    message,
  }: EachMessagePayload<SavePostReactionKafkaPayload>) {
    const {
      createdAt,
      id,
      postContent,
      postId,
      postOwnerId,
      type,
      updatedAt,
      userId,
    } = message.value;

    if (postOwnerId === userId) return;

    let noti = await this.notiRepo.findOneBy({
      resourceId: id,
      type: NotiType.POST_REACTION,
      userId: postOwnerId,
    });

    const reactValue = this.mapCommentReaction(type);

    noti = this.notiRepo.create({
      ...noti,
      link: `/posts/${postId}`,
      params: {
        react: { value: reactValue, isNeedI18: true },
        content: { isNeedI18: false, value: postContent },
      },
      userId: postOwnerId,
      resourceId: id,
      createdAt,
      updatedAt,
      senderUserId: userId,
      senderType: NotiSenderType.USER,
      type: NotiType.POST_REACTION,
      reactionType: type,
    });

    await this.notiRepo.save(noti);
  }

  @SubscribeTo(KAFKA_TOPIC.POST_REACTION_DELETED)
  @Transactional()
  async handleCommentReactionDeleted({
    message,
  }: EachMessagePayload<DeleteCommentReactionKafkaPayload>) {
    const { id } = message.value;

    await this.notiRepo.softDelete({
      resourceId: id,
      type: NotiType.POST_REACTION,
    });
  }

  private mapCommentReaction(
    type: PostReactionType,
  ): PostReactionNotiParams['react']['value'] {
    switch (type) {
      case PostReactionType.ANGRY:
        return 'angry';
      case PostReactionType.LIKE:
        return 'like';
      case PostReactionType.LOVE:
        return 'love';
      default:
        throw new Error(`Comment reaction type ${type} not implemented`);
    }
  }
}
