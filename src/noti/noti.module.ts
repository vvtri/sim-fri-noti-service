import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'common';
import { NotiUserController } from './controllers/user/noti.user.controller';
import { NotiTemplateRepository } from './repositories/noti-template.repository';
import { NotiRepository } from './repositories/noti.repository';
import { NotiUserService } from './services/user/noti.user.service';

@Module({
  imports: [
    TypeOrmCustomModule.forFeature([NotiRepository, NotiTemplateRepository]),
  ],
  controllers: [NotiUserController],
  providers: [NotiUserService],
})
export class NotiModule {}
