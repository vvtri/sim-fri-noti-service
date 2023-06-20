import { Injectable } from '@nestjs/common';
import { render } from 'mustache';
import { I18nService } from 'nestjs-i18n';
import { paginate } from 'nestjs-typeorm-paginate';
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination';
import { Language } from 'shared';
import { Transactional } from 'typeorm-transactional';
import { UserProfile } from '../../../auth/entities/user-profile.entity';
import { User } from '../../../auth/entities/user.entity';
import { NotiResDto } from '../../dtos/common/res/noti.res.dto';
import {
  GetListNotiUserReqDto,
  UpdateReadStatusNotiUserReqDto,
} from '../../dtos/user/req/noti.user.req.dto';
import { NotiTemplate } from '../../entities/noti-template.entity';
import { Noti } from '../../entities/noti.entity';
import { NotiTemplateRepository } from '../../repositories/noti-template.repository';
import { NotiRepository } from '../../repositories/noti.repository';

@Injectable()
export class NotiUserService {
  constructor(
    private notiRepo: NotiRepository,

    private notiTemplateRepo: NotiTemplateRepository,
    private i18nService: I18nService,
  ) {}

  @Transactional()
  async getList(dto: GetListNotiUserReqDto, user: User) {
    const { limit, page } = dto;

    const qb = this.notiRepo
      .createQueryBuilder('n')
      .groupBy('n.id')
      .select('n.id')
      .where('n.userId = :userId', { userId: user.id })
      .orderBy('n.updatedAt', 'DESC');

    const { items, meta } = await paginate(qb, { limit, page });

    const noties = await Promise.all(
      items.map(async (item) => {
        const noti = await this.notiRepo.findOne({
          where: { id: item.id },
          relations: {
            senderUser: { userProfile: { avatar: true } },
          },
        });

        const userLang = Language.EN;

        const notiTemplate =
          await this.notiTemplateRepo.findOneByOrThrowNotFoundExc({
            notiType: noti.type,
            lang: userLang,
          });
        let notiText: string = this.renderNoti({
          noti,
          lang: userLang,
          notiTemplate,
          userProfile: noti.senderUser.userProfile,
        });

        return NotiResDto.forUser({ data: noti, content: notiText });
      }),
    );

    return new Pagination(noties, meta);
  }

  @Transactional()
  async readNoti(dto: UpdateReadStatusNotiUserReqDto, user: User) {
    const { isRead, notiId } = dto;

    const noti = await this.notiRepo.findOneOrThrowNotFoundExc({
      where: { id: notiId, userId: user.id },
    });

    if (isRead && !noti.readAt) {
      noti.readAt = new Date();
      await this.notiRepo.save(noti);
    }

    if (!isRead && noti.readAt) {
      noti.readAt = null;
      await this.notiRepo.save(noti);
    }

    return NotiResDto.forUser({ data: noti });
  }

  private renderNoti({
    lang,
    noti,
    notiTemplate,
    userProfile,
  }: RenderNotiParams) {
    let result: string;

    const params = noti.params;
    let paramsParsed: any = {} as any;

    for (const key in params) {
      if (!Object.prototype.hasOwnProperty.call(params, key)) continue;

      const prop = params[key];

      if (prop.isNeedI18) {
        const i18nKey = `noti.${prop.value}`;
        paramsParsed[key] = this.i18nService.t(i18nKey, { lang });
      } else {
        paramsParsed[key] = prop.value;
      }
    }

    paramsParsed.name = `<strong>${userProfile.name}</strong>`;

    result = render(notiTemplate.templateText, paramsParsed);

    return result;
  }
}

type RenderNotiParams = {
  noti: Noti;
  lang: Language;
  notiTemplate: NotiTemplate;
  userProfile: UserProfile;
};
