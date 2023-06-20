import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'common';
import { DataSource } from 'typeorm';
import { NotiTemplate } from '../entities/noti-template.entity';

@Injectable()
export class NotiTemplateRepository extends BaseRepository<NotiTemplate> {
  constructor(dataSource: DataSource) {
    super(NotiTemplate, dataSource);
  }
}
