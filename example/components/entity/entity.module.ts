import { Module } from "@base/lib/common/decorator";
import { HelloController } from "./entity.controller";
import { HelloService } from "./entity.service";

@Module({
  controllers: [HelloController],
  services: [HelloService]
})
export class EntityModule {}
