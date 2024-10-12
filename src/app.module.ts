import { Module } from '@nestjs/common';
import * as process from "node:process";
import { TelegrafModule } from 'nestjs-telegraf';
import { Bot } from "./bot";
import { ConfigModule } from "@nestjs/config";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
    })
  ],
  controllers: [],
  providers: [Bot],
})
export class AppModule {}
