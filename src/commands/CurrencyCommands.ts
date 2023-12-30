import TelegramBot from "node-telegram-bot-api";
import { Command } from "./Command.js";
import { BotEventEmitter } from "../services/BotEventEmitter.js";
import { CurrencyService } from "../services/CurrencyService.js";
import { BACK_PANEL, WAIT_TEXT } from "../services/Texts.js";

export class CurrencyCommand extends Command {
    private currencyService: CurrencyService
    constructor(bot: TelegramBot, emitter: BotEventEmitter) {
        super(bot, emitter)
        this.currencyService = new CurrencyService()
    }
    public init(): void {
        this.emitter.on('get_currencies', async (chat_id, currencies, wait_msg_id?) => {
            await this.bot.deleteMessage(chat_id, wait_msg_id)
            await this.bot.sendMessage(chat_id, currencies, {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: BACK_PANEL,
                    resize_keyboard: true
                }
            })
        })
    }
    public handle(): void {
        this.bot.onText(/Курс валюты/, async msg => {
            const wait_msg = await this.bot.sendMessage(msg.chat.id, WAIT_TEXT)
            const currencies = await this.currencyService.getCurrencies()
            this.emitter.emit('get_currencies', msg.chat.id, currencies, wait_msg.message_id)
        })
    }
}