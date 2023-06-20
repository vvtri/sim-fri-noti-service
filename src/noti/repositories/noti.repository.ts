import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'common';
import { DataSource } from 'typeorm';
import { Noti } from '../entities/noti.entity';

@Injectable() 
export class NotiRepository extends BaseRepository<Noti> {
  constructor(dataSource: DataSource) {
    super(Noti, dataSource);
  }
}
