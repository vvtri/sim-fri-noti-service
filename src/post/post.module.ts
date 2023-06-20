import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'common';
import { NotiRepository } from '../noti/repositories/noti.repository';
import { PostListenerService } from './services/post-listener.service';

@Module({
  imports: [TypeOrmCustomModule.forFeature([NotiRepository])],
  providers: [PostListenerService],
})
export class PostModule {}
