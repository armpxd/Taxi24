import { Module } from "@nestjs/common";
import { DbConnection } from "./typeorm.config";

@Module({
    providers:[...DbConnection],
    exports:[...DbConnection]
})

export class DbModule{}