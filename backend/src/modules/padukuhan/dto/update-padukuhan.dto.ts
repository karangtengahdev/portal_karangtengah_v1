import { PartialType } from '@nestjs/swagger';
import { CreatePadukuhanDto } from './create-padukuhan.dto';

export class UpdatePadukuhanDto extends PartialType(CreatePadukuhanDto) {}
