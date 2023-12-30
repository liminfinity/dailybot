import TelegramBot from "node-telegram-bot-api";
import { BotEventEmitter } from "../services/BotEventEmitter.js";

export abstract class Command {
    protected bot: TelegramBot
    protected emitter: BotEventEmitter
    constructor(bot: TelegramBot, emitter: BotEventEmitter) {
        this.bot = bot
        this.emitter = emitter
    }
    public abstract init(): void
    public abstract handle(): void 
}