import TelegramBot from "node-telegram-bot-api"
import { Command } from "./Command.js"
import { BotEventEmitter } from "../services/BotEventEmitter.js"

export class BackCommand extends Command {
    constructor(bot: TelegramBot, emitter: BotEventEmitter) {
        super(bot, emitter)
    }
    public init(): void {
        this.emitter.on('back', async chat_id => {
            this.emitter.emit('start', chat_id)
        })
    }
    public handle(): void {
        this.bot.onText(/◀️ На главную/, async msg => {
            this.emitter.emit('back', msg.chat.id)
        })
    } 
}