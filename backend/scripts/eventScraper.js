const puppeteer = require('puppeteer');

async function scrapeEvents() {
    const eventUrl = "https://www.ufc.com.br/event/ufc-328";

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });

        console.log(`Abrindo: ${eventUrl}`);
        await page.goto(eventUrl, { waitUntil: 'load', timeout: 60000 });

        await new Promise(r => setTimeout(r, 5000));

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
            fotoRed: `/fotos/${l.redCorner.replace(/\s+/g, '_').toLowerCase()}.png`,
            fotoBlue: `/fotos/${l.blueCorner.replace(/\s+/g, '_').toLowerCase()}.png`
        }));

        console.log(`${finalResult.length} lutas encontradas`);

        await browser.close();
        return finalResult;

    } catch (error) {
        console.error("Erro:", error.message);
        await browser.close();
        return [];
    }
}

module.exports = scrapeEvents;