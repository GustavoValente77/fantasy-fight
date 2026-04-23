const puppeteer = require('puppeteer');

async function scrapeEvents() {
    const eventUrl = "https://www.ufc.com.br/event/ufc-328";

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1366, height: 768 });

        console.log(`Abrindo: ${eventUrl}`);
        await page.goto(eventUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        await new Promise(r => setTimeout(r, 3000));

        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await new Promise(r => setTimeout(r, 2000));

        const cardLutas = await page.evaluate(() => {
            const lutas = [];
            const links = Array.from(document.querySelectorAll('a[href*="/athlete/"]'));

            const nomesAtletas = links
                .map(a => a.innerText.trim())
                .filter(nome => nome.length > 3 && !nome.includes('\n'));

            const nomesLimpos = nomesAtletas.filter(
                (nome, index) => nome !== nomesAtletas[index - 1]
            );

            for (let i = 0; i < nomesLimpos.length; i += 2) {
                if (nomesLimpos[i] && nomesLimpos[i + 1]) {
                    lutas.push({
                        redCorner: nomesLimpos[i],
                        blueCorner: nomesLimpos[i + 1],
                        luta: `${nomesLimpos[i]} vs ${nomesLimpos[i + 1]}`
                    });
                }
            }
            return lutas;
        });

        const finalResult = cardLutas.map(l => ({
            ...l,
            evento: "UFC 328",
            timestamp: new Date().toISOString()
        }));

        console.log(`${finalResult.length} lutas encontradas`);

        await browser.close();
        return finalResult;

    } catch (error) {
        console.error("Erro:", error.message);
        if (browser) await browser.close();
        return [];
    }
}

module.exports = scrapeEvents;