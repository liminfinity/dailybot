import TelegramBot from "node-telegram-bot-api";
import { Command } from "./Command.js";
import { BotEventEmitter } from "../services/BotEventEmitter.js";
import { HELP_TEXT } from "../services/Texts.js";

export class HelpCommand extends Command {
    constructor(bot: TelegramBot, emitter: BotEventEmitter) {
        super(bot, emitter)
    }
    public init(): void {
        this.emitter.on('help', async chat_id => {
            await this.bot.sendMessage(chat_id, HELP_TEXT)
        })
    }
    public handle(): void {
        this.bot.onText(/Помощь|\/help/, async msg => {
            this.emitter.emit('help', msg.chat.id)
        })
    }
}