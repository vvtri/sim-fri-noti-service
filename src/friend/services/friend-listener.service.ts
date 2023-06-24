import { Injectable } from '@nestjs/common';
import {
  EachMessagePayload,
  KafkaListener,
  SubscribeTo,
} from '@vvtri/nestjs-kafka';
import {
  FriendRequestCreatedKafkaPayload,
  FriendRequestDeletedKafkaPayload,
  FriendRequestUpdatedKafkaPayload,
  KAFKA_TOPIC,
} from 'common';
import { FriendRequestStatus, NotiSenderType, NotiType } from 'shared';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { NotiRepository } from '../../noti/repositories/noti.repository';

@Injectable()
@KafkaListener()
export class FriendListenerService {
  constructor(private notiRepo: NotiRepository) {}

  @SubscribeTo(KAFKA_TOPIC.FRIEND_REQUEST_CREATED)
  @Transactional()
  async handleFriendCreated({
    message,
  }: EachMessagePayload<FriendRequestCreatedKafkaPayload>) {
    const { beRequestedId, id, requesterId, status } = message.value;

    let noti = this.notiRepo.create({
      link: `/profile/${requesterId}`,
      params: {},
      userId: beRequestedId,
      resourceId: id,
      senderUserId: requesterId,
      senderType: NotiSenderType.USER,
      type: NotiType.NEW_FRIEND_REQUEST,
    });

    await this.notiRepo.save(noti);
  }

  @SubscribeTo(KAFKA_TOPIC.FRIEND_REQUEST_UPDATED)
  @Transactional()
  async handleFriendUpdated({
    message,
  }: EachMessagePayload<FriendRequestUpdatedKafkaPayload>) {
    const { beRequestedId, id, requesterId, status } = message.value;

    await this.notiRepo.softDelete({
      resourceId: id,
      type: NotiType.NEW_FRIEND_REQUEST,
    });

    if (status === FriendRequestStatus.ACCEPTED) {
      let noti = this.notiRepo.create({
        link: `/profile/${beRequestedId}`,
        params: {},
        userId: requesterId,
        resourceId: id,
        senderUserId: beRequestedId,
        senderType: NotiSenderType.USER,
        type: NotiType.FRIEND_REQUEST_ACCEPTED,
      });

      await this.notiRepo.save(noti);
    }
  }

  @SubscribeTo(KAFKA_TOPIC.FRIEND_REQUEST_DELETED)
  @Transactional()
  async handleFriendRequestDeleted({
    message,
  }: EachMessagePayload<FriendRequestDeletedKafkaPayload>) {
    const { friendRequestId } = message.value;

    await this.notiRepo.softDelete({
      resourceId: friendRequestId,
      type: In([NotiType.NEW_FRIEND_REQUEST, NotiType.FRIEND_REQUEST_ACCEPTED]),
    });
  }
}
