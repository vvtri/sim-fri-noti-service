import { Injectable } from '@nestjs/common';
import {
  EachMessagePayload,
  KafkaListener,
  SubscribeTo,
} from '@vvtri/nestjs-kafka';
import {
  DeleteCommentKafkaPayload,
  DeleteCommentReactionKafkaPayload,
  KAFKA_TOPIC,
  SaveCommentKafkaPayload,
  SaveCommentReactionKafkaPayload,
} from 'common';
import { CommentReactionType, NotiSenderType, NotiType, PostReactionType } from 'shared';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Noti } from '../../noti/entities/noti.entity';
import { NotiRepository } from '../../noti/repositories/noti.repository';
import { CommentReactionNotiParams } from '../../noti/types/noti.type';

@Injectable()
@KafkaListener()
export class CommentListenerService {
  constructor(private notiRepo: NotiRepository) {}

  @SubscribeTo(KAFKA_TOPIC.COMMENT_SAVED)
  @Transactional()
  async handleCommentCreated({
    message,
  }: EachMessagePayload<SaveCommentKafkaPayload>) {
    const {
      content,
      createdAt,
      id,
      userId,
      updatedAt,
      postId,
      postOwnerId,
      replyUserIds,
    } = message.value;

    const noties: Noti[] = [];

    if (postOwnerId !== userId) {
      let noti = await this.notiRepo.findOneBy({
        resourceId: id,
        type: NotiType.COMMENT_POST,
        userId: postOwnerId,
      });

      noti = this.notiRepo.create({
        ...noti,
        link: `/posts/${postId}?commentId=${id}`,
        params: {},
        userId: postOwnerId,
        resourceId: id,
        createdAt,
        updatedAt,
        senderUserId: userId,
        senderType: NotiSenderType.USER,
        type: NotiType.COMMENT_POST,
      });

      noties.push(noti);
    }

    await Promise.all(
      replyUserIds
        .filter((item) => item !== userId)
        .map(async (item) => {
          let noti = await this.notiRepo.findOneBy({
            resourceId: id,
            type: NotiType.COMMENT_POST,
            userId: item,
          });

          noti = this.notiRepo.create({
            ...noti,
            link: `/posts/${postId}?commentId=${id}`,
            params: {},
            userId: item,
            resourceId: id,
            createdAt,
            updatedAt,
            senderUserId: userId,
            senderType: NotiSenderType.USER,
            type: NotiType.REPLY_COMMENT,
          });

          noties.push(noti);
        }),
    );

    await this.notiRepo.save(noties, { chunk: 500 });
  }

  @SubscribeTo(KAFKA_TOPIC.COMMENT_DELETED)
  @Transactional()
  async handleCommentDeleted({
    message,
  }: EachMessagePayload<DeleteCommentKafkaPayload>) {
    const { id } = message.value;

    await this.notiRepo.softDelete({
      resourceId: id,
      type: In([NotiType.COMMENT_POST, NotiType.REPLY_COMMENT]),
    });
  }

  @SubscribeTo(KAFKA_TOPIC.COMMENT_REACTION_SAVED)
  @Transactional()
  async handleCommentReactionSaved({
    message,
  }: EachMessagePayload<SaveCommentReactionKafkaPayload>) {
    const {
      id,
      commentContent,
      commentId,
      commentOwnerId,
      createdAt,
      type,
      updatedAt,
      userId,
      postId,
    } = message.value;

    if (commentOwnerId === userId) return;

    let noti = await this.notiRepo.findOneBy({
      resourceId: id,
      type: NotiType.COMMENT_REACTION,
      userId: commentOwnerId,
    });

    const reactValue = this.mapCommentReaction(type);

    noti = this.notiRepo.create({
      ...noti,
      link: `/posts/${postId}?commentId=${commentId}`,
      params: {
        react: { value: reactValue, isNeedI18: true },
        content: { isNeedI18: false, value: commentContent },
      },
      userId: commentOwnerId,
      resourceId: id,
      createdAt,
      updatedAt,
      senderUserId: userId,
      senderType: NotiSenderType.USER,
      type: NotiType.COMMENT_REACTION,
      reactionType: type
    });

    await this.notiRepo.save(noti);
  }

  @SubscribeTo(KAFKA_TOPIC.COMMENT_REACTION_DELETED)
  @Transactional()
  async handleCommentReactionDeleted({
    message,
  }: EachMessagePayload<DeleteCommentReactionKafkaPayload>) {
    const { id } = message.value;

    await this.notiRepo.softDelete({
      resourceId: id,
      type: NotiType.COMMENT_REACTION,
    });
  }

  private mapCommentReaction(
    type: CommentReactionType,
  ): CommentReactionNotiParams['react']['value'] {
    switch (type) {
      case CommentReactionType.ANGRY:
        return 'angry';
      case CommentReactionType.LIKE:
        return 'like';
      case CommentReactionType.LOVE:
        return 'love';
      default:
        throw new Error(`Comment reaction type ${type} not implemented`);
    }
  }
}
