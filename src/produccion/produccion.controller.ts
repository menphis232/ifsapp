import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import { FormulasHardcodeadasService } from './formulas-hardcodeadas.service';
import { CrearProduccionDto } from './dto/crear-produccion.dto';

@Controller('produccion')
export class ProduccionController {
  constructor(
    private readonly produccionService: ProduccionService,
    private readonly formulasHardcodeadasService: FormulasHardcodeadasService,
  ) {}

  // Rutas estáticas primero para que no las capture :id
  @Get('formulas')
  getFormulasDisponibles() {
    return this.formulasHardcodeadasService.getTodasLasFormulas();
  }

  @Get('verificar/:formulaId')
  async verificarDisponibilidad(@Param('formulaId') formulaId: string) {
    return this.produccionService.verificarDisponibilidad(formulaId);
  }

  @Get()
  findAll() {
    return this.produccionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produccionService.findOne(id);
  }

  @Post('calcular-potes')
  async calcularPotes(
    @Body('formulaId') formulaId: string,
    @Body('potes1kg') potes1kg: number,
  ) {
    return this.produccionService.calcularPotes(formulaId, potes1kg);
  }

  @Post('verificar-envases-etiquetas')
  async verificarEnvasesYEtiquetas(
    @Body('formulaId') formulaId: string,
    @Body('potes1kg') potes1kg: number,
    @Body('potesMedioKg') potesMedioKg: number,
  ) {
    return this.produccionService.verificarEnvasesYEtiquetas(formulaId, potes1kg, potesMedioKg);
  }

  @Post('crear')
  @HttpCode(HttpStatus.CREATED)
  async crearProduccion(@Body() crearProduccionDto: CrearProduccionDto) {
    return this.produccionService.crearProduccion(crearProduccionDto);
  }
}
