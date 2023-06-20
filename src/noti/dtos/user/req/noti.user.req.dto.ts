import { IsValidBoolean, IsValidNumber } from 'common';
import { PaginationReqDto } from '../../../../common/dtos/pagination.dto';

export class GetListNotiUserReqDto extends PaginationReqDto {}

export class UpdateReadStatusNotiUserReqDto {
  @IsValidNumber({ min: 1 })
  notiId: number;

  @IsValidBoolean()
  isRead: boolean;
}
