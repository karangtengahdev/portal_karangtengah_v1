import { PartialType } from '@nestjs/swagger';
import { CreateUmkmDto } from './create-umkm.dto';

export class UpdateUmkmDto extends PartialType(CreateUmkmDto) {}
