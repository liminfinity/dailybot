import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv'
import { Command } from "./commands/Command.js";
import { StartCommand } from "./commands/StartCommand.js";
import { ChatGPTCommand } from "./commands/ChatGPTCommand.js";
import { BackCommand } from "./commands/BackCommand.js";
import { BotEventEmitter } from "./services/BotEventEmitter.js";
import { CurrencyCommand } from "./commands/CurrencyCommands.js";
import { WeatherCommand } from "./commands/WeatherCommand.js";
dotenv.config()
export class Bot {
    private bot: TelegramBot
    private commands: Command[] = []
    private emmiter: BotEventEmitter
    constructor() {
        this.bot = new TelegramBot(process.env["TOKEN_BOT"] || '', {
            polling: true
        })
        this.emmiter = new BotEventEmitter()
    }
    public init() {

        this.commands.push(new StartCommand(this.bot, this.emmiter), 
        new ChatGPTCommand(this.bot, this.emmiter), new BackCommand(this.bot, this.emmiter),
        new CurrencyCommand(this.bot, this.emmiter), new WeatherCommand(this.bot, this.emmiter))
        
        this.commands.forEach(command => {
            command.init()
            command.handle()
        })
    }
}