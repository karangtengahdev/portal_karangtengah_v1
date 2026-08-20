import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { VillageService } from './village.service';

@ApiTags('public/village')
@Controller('public/village')
export class VillageController {
  constructor(private readonly villageService: VillageService) {}

  @Public()
  @Get()
  get() {
    return this.villageService.getProfile();
  }
}
