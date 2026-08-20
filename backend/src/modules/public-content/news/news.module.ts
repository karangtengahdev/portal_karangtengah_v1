import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { NewsCmsController } from './news-cms.controller';

@Module({
  controllers: [NewsController, NewsCmsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
