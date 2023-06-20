import { BaseEntity, PartialIndexWithSoftDelete } from 'common';
import { CommentReactionType, NotiSenderType, NotiType, PostReactionType } from 'shared';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import {
  CommentReactionNotiParams,
  PostReactionNotiParams,
} from '../types/noti.type';
import { NotiTemplate } from './noti-template.entity';

@Entity()
@PartialIndexWithSoftDelete(['resourceId', 'type', 'userId'], { unique: true })
export class Noti extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4' })
  resourceId: number;

  @Column({ nullable: true, type: 'timestamptz' })
  readAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  params: PostReactionNotiParams | CommentReactionNotiParams;

  @Column({ nullable: true })
  link: string;

  @Column({nullable: true})
  reactionType: PostReactionType | CommentReactionType

  @Column({ nullable: true, enum: NotiSenderType, type: 'enum' })
  senderType: NotiSenderType;

  // join user
  @Column()
  userId: number;

  @ManyToOne(() => User, (u) => u.noties)
  user: User;
  // end join user

  //join sender user
  @Column({ nullable: true })
  senderUserId: number;

  @ManyToOne(() => User, (u) => u.sentNoties)
  @JoinColumn()
  senderUser: User;
  // end join sender user

  // join template
  @Column({ enum: NotiType, type: 'enum' })
  type: NotiType;

  @ManyToOne(() => NotiTemplate, (nt) => nt.noties, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'type', referencedColumnName: 'notiType' })
  notiTemplate: NotiTemplate;
  // end join template
}
