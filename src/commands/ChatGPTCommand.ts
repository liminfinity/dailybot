import TelegramBot, { Message } from "node-telegram-bot-api";
import { Command } from "./Command.js";
import { ChatGPT } from "../services/ChatGPTService.js";
import { BACK_PANEL } from "../services/Texts.js";
import { BotEventEmitter } from "../services/BotEventEmitter.js";

export class ChatGPTCommand extends Command {
    private chatGPT: ChatGPT
    constructor(bot: TelegramBot, emitter: BotEventEmitter) {
        super(bot, emitter)
        this.chatGPT = new ChatGPT()
    }
    public init(): void {
        this.emitter.on('start_chatgpt', async chat_id => {
            await this.bot.sendMessage(chat_id, "Введите запрос для Chat GPT", {
                reply_markup: {
                   keyboard: BACK_PANEL,
                   resize_keyboard: true
                }
            })
            this.bot.once('message', async msg => {
                await this.GetChatGPT(msg);
            })
        })
    }
    public handle(): void {
        this.bot.onText(/Chat GPT/, async msg => {
            this.emitter.emit('start_chatgpt', msg.chat.id)
        })
    }
    private async GetChatGPT(msg: Message): Promise<void> {
        if (['◀️ На главную', '/start'].includes(msg.text || '')) return;
        const wait_msg = await this.bot.sendMessage(msg.chat.id, "Запрос выполняется...", {
            reply_markup: {
                keyboard: BACK_PANEL,
                resize_keyboard: true
            }
        })
        const response = await this.chatGPT.simpleRequest(msg.text || '')
        await this.bot.deleteMessage(wait_msg.chat.id, wait_msg.message_id)
        await this.bot.sendMessage(msg.chat.id, response, {
            reply_markup: {
                keyboard: BACK_PANEL,
                resize_keyboard: true
            },
            parse_mode: 'Markdown'
        })
        this.bot.once('message', async msg => {
            await this.GetChatGPT(msg)
        })
    }
}