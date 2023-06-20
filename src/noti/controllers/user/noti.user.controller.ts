import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from 'common';
import { User } from '../../../auth/entities/user.entity';
import {
  AuthenticateUser,
  CurrentUser,
} from '../../../common/decorators/auth.decorator';
import { PaginationResponse } from '../../../common/decorators/swagger.decorator';
import { NotiResDto } from '../../dtos/common/res/noti.res.dto';
import {
  GetListNotiUserReqDto,
  UpdateReadStatusNotiUserReqDto,
} from '../../dtos/user/req/noti.user.req.dto';
import { NotiUserService } from '../../services/user/noti.user.service';

@Controller(`${PrefixType.USER}/noti`)
@ApiTags('Noti user')
@AuthenticateUser()
export class NotiUserController {
  constructor(private notiUserService: NotiUserService) {}

  @Get()
  @PaginationResponse(NotiResDto)
  getList(@Query() body: GetListNotiUserReqDto, @CurrentUser() user: User) {
    return this.notiUserService.getList(body, user);
  }

  @Patch()
  updateReadStatus(
    @Body() body: UpdateReadStatusNotiUserReqDto,
    @CurrentUser() user: User,
  ) {
    return this.notiUserService.readNoti(body, user);
  }
}
