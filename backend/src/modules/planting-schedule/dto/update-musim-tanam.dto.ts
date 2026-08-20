import { PartialType } from '@nestjs/swagger';
import { CreateMusimTanamDto } from './create-musim-tanam.dto';

export class UpdateMusimTanamDto extends PartialType(CreateMusimTanamDto) {}
