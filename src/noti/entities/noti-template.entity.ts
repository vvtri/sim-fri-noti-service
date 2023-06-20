import { BaseEntity, PartialIndexWithSoftDelete } from 'common';
import { Language, NotiType } from 'shared';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Noti } from './noti.entity';

@Entity()
@PartialIndexWithSoftDelete(['notiType', 'lang'], { unique: true })
export class NotiTemplate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: NotiType, type: 'enum' })
  notiType: NotiType;

  @Column({ nullable: true })
  templateText: string;

  @Column({ enum: Language, type: 'enum' })
  lang: Language;

  @OneToMany(() => Noti, (n) => n.notiTemplate)
  noties: Noti[];
}
