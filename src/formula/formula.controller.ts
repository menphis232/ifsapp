import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FormulaService } from './formula.service';
import { CreateFormulaDto } from './dto/create-formula.dto';
import { UpdateFormulaDto } from './dto/update-formula.dto';

@Controller('formulas')
export class FormulaController {
  constructor(private readonly formulaService: FormulaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFormulaDto: CreateFormulaDto) {
    return this.formulaService.create(createFormulaDto);
  }

  @Get()
  findAll() {
    return this.formulaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formulaService.findOne(id);
  }

  @Get('mobiliario/:mobiliarioId')
  findByMobiliario(@Param('mobiliarioId') mobiliarioId: string) {
    return this.formulaService.findByMobiliario(mobiliarioId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormulaDto: UpdateFormulaDto) {
    return this.formulaService.update(id, updateFormulaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.formulaService.remove(id);
  }
}
