import TelegramBot from "node-telegram-bot-api";
import { Command } from "./Command.js";
import { BotEventEmitter } from "../services/BotEventEmitter.js";
import { BACK_PANEL, WAIT_TEXT } from "../services/Texts.js";
import { WeatherService } from "../services/WeatherService.js";

export class WeatherCommand extends Command {
    private weatherService: WeatherService
    constructor(bot: TelegramBot, emitter: BotEventEmitter) {
        super(bot, emitter)
        this.weatherService = new WeatherService()
    }
    public init(): void {
        this.emitter.on('get_weather', async (chat_id, weather, wait_msg_id?) => {
            await this.bot.deleteMessage(chat_id, wait_msg_id)
            await this.bot.sendMessage(chat_id, weather, {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: BACK_PANEL,
                    resize_keyboard: true
                }
            })
        })
    }
    public handle(): void {
        this.bot.on('location', async msg => {
            const wait_msg = await this.bot.sendMessage(msg.chat.id, WAIT_TEXT)
            const weather = await this.weatherService.getWeather(msg.location?.latitude, msg.location?.longitude)
            this.emitter.emit('get_weather', msg.chat.id, weather, wait_msg.message_id)
        })
    }
}