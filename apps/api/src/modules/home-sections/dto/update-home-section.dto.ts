/**
 * @fileoverview Update Home Section DTO
 */

import { PartialType } from '@nestjs/common';
import { CreateHomeSectionDto } from './create-home-section.dto';

export class UpdateHomeSectionDto extends PartialType(CreateHomeSectionDto) {}
