import { Module } from "@base/lib/common/decorator";
import { EntityModule } from "example/components/entity/entity.module";

@Module({
  imports: [EntityModule],
})
export class AppModule {}
