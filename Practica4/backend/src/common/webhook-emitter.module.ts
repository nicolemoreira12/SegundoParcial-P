import { Module, Global } from '@nestjs/common';
import { WebhookEmitterService } from './webhook-emitter.service';

@Global()
@Module({
    providers: [WebhookEmitterService],
    exports: [WebhookEmitterService],
})
export class WebhookEmitterModule { }
