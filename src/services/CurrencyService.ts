import { launch } from "puppeteer"

export class CurrencyService {
    private url_parse: string
    constructor() {
        this.url_parse = 'https://cbr.ru/currency_base/daily/'
    }
    public async getCurrencies(): Promise<string> {
        const browser = await launch({
            headless: 'new'
        })
        const page = await browser.newPage()
        await page.goto(this.url_parse)
        const result = await page.evaluate(() => {
            const current_day = new Date()
            const CurrencySelectors: {[index: string]: string} = {
                usd_currency: '#content > div > div > div > div.table-wrapper > div > table > tbody > tr:nth-child(15) > td:nth-child(5)',
                usd_text: '#content > div > div > div > div.table-wrapper > div > table > tbody > tr:nth-child(15) > td:nth-child(4)',
                usd_abbr: '#content > div > div > div > div.table-wrapper > div > table > tbody > tr:nth-child(15) > td:nth-child(2)',
                eur_currency: '#content > div > div > div > div.table-wrapper > div > table > tbody > tr:nth-child(16) > td:nth-child(5)',
                eur_text: '#content > div > div > div > div.table-wrapper > div > table > tbody > tr:nth-child(16) > td:nth-child(4)',
                eur_abbr: '#content > div > div > div > div.table-wrapper > div > table > tbody > tr:nth-child(16) > td:nth-child(2)',
            }
            for (let field in CurrencySelectors) {
                console.log(field)
                CurrencySelectors[field] = document.querySelector(CurrencySelectors[field])?.innerHTML || ''
            }
            const result = `<b>Курсы на ${current_day.getDate()}.${current_day.getMonth()}.${current_day.getFullYear()}</b>` + 
            `\n\t1. ${CurrencySelectors['usd_text']}(${CurrencySelectors['usd_abbr']}): ${CurrencySelectors['usd_currency']}р.` +
            `\n\t2. ${CurrencySelectors['eur_text']}(${CurrencySelectors['eur_abbr']}): ${CurrencySelectors['eur_currency']}р.`
            return result
        })
        return result
    }
}