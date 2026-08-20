import { PartialType } from '@nestjs/swagger';
import { CreateTahapanDto } from './create-tahapan.dto';

export class UpdateTahapanDto extends PartialType(CreateTahapanDto) {}
