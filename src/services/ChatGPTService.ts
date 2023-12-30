import dotenv from 'dotenv'
import { HttpsProxyAgent } from 'https-proxy-agent'
import OpenAI from 'openai'

dotenv.config()

export class ChatGPT {
    private openai: OpenAI
    private history: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env["CHATGPT_KEY"],
            httpAgent: new HttpsProxyAgent('http://polieshko04:bt6eQ2sHmn@103.230.69.36:50100')
        })
    }
    public async simpleRequest(request: string): Promise<string> {
        try {
            this.history.push({role: 'user', content: request})
            const chat_completion = await this.openai.chat.completions.create({
                messages: this.history,
                model: 'gpt-3.5-turbo'
            })
            return chat_completion.choices[0].message.content || ''
        } catch(e) {
            return "Ответ не был получен("
        }
        
    }
}