import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'common';
import { NotiRepository } from '../noti/repositories/noti.repository';
import { FriendListenerService } from './services/friend-listener.service';

@Module({
  imports: [TypeOrmCustomModule.forFeature([NotiRepository])],
  providers: [FriendListenerService],
})
export class FriendModule {}
