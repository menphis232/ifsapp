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
  Query,
} from '@nestjs/common';
import { EnvaseService } from './envase.service';
import { CreateEnvaseDto } from './dto/create-envase.dto';
import { UpdateEnvaseDto } from './dto/update-envase.dto';

@Controller('envases')
export class EnvaseController {
  constructor(private readonly envaseService: EnvaseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEnvaseDto: CreateEnvaseDto) {
    return this.envaseService.create(createEnvaseDto);
  }

  @Get()
  findAll(@Query('tipo') tipo?: string) {
    if (tipo) {
      return this.envaseService.findByTipo(tipo);
    }
    return this.envaseService.findAll();
  }

  @Get(':id/qr-payload')
  getQrPayload(@Param('id') id: string) {
    return { payload: `IFS:envase:${id}` };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.envaseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnvaseDto: UpdateEnvaseDto) {
    return this.envaseService.update(id, updateEnvaseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.envaseService.remove(id);
  }
}
