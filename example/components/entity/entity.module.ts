import { Module } from "@base/lib/common/decorator";
import { HelloController } from "./entity.controller";

@Module({
  controllers: [HelloController],
})
export class EntityModule {}
