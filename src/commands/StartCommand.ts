import TelegramBot from "node-telegram-bot-api";
import { Command } from "./Command.js";
import { START_PANEL, START_PANEL_TEXT, START_TEXT } from "../services/Texts.js";
import { BotEventEmitter } from "../services/BotEventEmitter.js";

export class StartCommand extends Command {
    constructor(bot: TelegramBot, emitter: BotEventEmitter) {
        super(bot, emitter)
    }
    public init(): void {
        this.emitter.on('start', async chat_id => {
            await this.bot.sendMessage(chat_id, START_TEXT)
            await this.bot.sendMessage(chat_id, START_PANEL_TEXT, {
                reply_markup: {
                    keyboard: START_PANEL,
                    resize_keyboard: true
                }
            })
        })
    }
    public handle(): void {
        this.bot.onText(/\/start/, async msg => {
            this.emitter.emit('start', msg.chat.id)
        })
    }
}