import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PushService } from './push.service';
import { RegisterPushDto } from './dto/register-push.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('push')
@UseGuards(JwtAuthGuard)
export class PushController {
  constructor(private pushService: PushService) {}

  @Post('register')
  register(
    @CurrentUser() user: { id: string },
    @Body() dto: RegisterPushDto,
  ) {
    return this.pushService.register(user.id, dto.token, dto.platform);
  }
}
