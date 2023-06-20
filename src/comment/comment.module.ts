import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'common';
import { NotiRepository } from '../noti/repositories/noti.repository';
import { CommentListenerService } from './services/comment-listener.service';

@Module({
  imports: [TypeOrmCustomModule.forFeature([NotiRepository])],
  providers: [CommentListenerService],
})
export class CommentModule {}
