import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { CreateScheduleDto } from './create-schedule.dto';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  @ApiProperty({ example: 'planted', required: false, description: 'planned | planted | harvested' })
  @IsOptional() @IsString() @IsIn(['planned', 'planted', 'harvested']) status?: string;
}
