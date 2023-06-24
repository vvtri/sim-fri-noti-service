import { Module } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from '@vvtri/nestjs-kafka';
import { AllExceptionsFilter } from 'common';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import path from 'path';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { dataSource } from '../data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import globalConfig, { GlobalConfig } from './common/configs/global.config';
import { consumerConfig, kafkaConfig } from './common/configs/kafka.config';
import { FileModule } from './file/file.module';
import { FriendModule } from './friend/friend.module';
import { NotiModule } from './noti/noti.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => globalConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({} as any),
      dataSourceFactory: async () => {
        initializeTransactionalContext();
        return addTransactionalDataSource(dataSource);
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loaderOptions: { path: path.join(__dirname, 'i18n'), watch: true },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['lang', 'l']),
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(process.cwd(), '/src/i18n/i18n.generated.ts'),
    }),
    KafkaModule.forRoot({
      kafkaConfig,
      consumerConfig,
      shouldRunConsumerAsync: true,
    }),
    AuthModule,
    FileModule,
    NotiModule,
    CommentModule,
    PostModule,
    FriendModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true }) },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService<GlobalConfig>) {}
}
