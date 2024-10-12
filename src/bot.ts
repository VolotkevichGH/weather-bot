import { Ctx, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context } from './context.interface';
import * as process from 'node:process';

@Update()
export class Bot {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    await ctx.reply(
      'Добро пожаловать в бота по погоде. \n' +
        'Для получения информации по региону, вам требуется написать его название. \n' +
        'Пример: Минск',
    );
  }

  @On('text')
  async onButton(@Ctx() ctx: Context, @Message('text') message: string) {
    const coordinate = await this.getCoordinate(message);
    if (coordinate === null) {
      await ctx.reply('Город не найден!');
      return;
    }
    const weather = await this.getWeather(coordinate.point.lat, coordinate.point.lon);
    const msg = `Регион: ${coordinate.name} \n\n
    Температура: ${weather.temp}°C\n
    Ощущаемая температура: ${weather.feels_like}°C\n
    Влажности воздуха: ${weather.humidity}%\n
    Давление: ${weather.pressure_mm} мм.рт.ст.\n
    Погода: ${weather.condition}\n
    Скорость ветра: ${weather.wind_speed}`
    await ctx.reply(msg)
  }

  async getWeather(lat: number, lon: number) {
    const accessKey = process.env.YANDEX_ACCESS_KEY;
    console.log(accessKey);
    const headers = {
      'X-Yandex-Weather-Key': accessKey,
    };
    const response = await fetch(`https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}`, { headers },).then((response) => response.json());
    return response.fact;

  }

  async getCoordinate(city: string) {
    const accessKey = process.env.COORD_ACCESS_KEY;
    const response = await fetch(`https://catalog.api.2gis.com/3.0/items/geocode?q=${city}&fields=items.point&key=${accessKey}`).then((response) => response.json());
    if (response.meta.code !== 200) return null;
    console.log(response.result);
    return (response.result.items[0]);
  }
}
