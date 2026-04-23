const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

async function scrapeRankings() {
    try {
        console.log("Iniciando busca de atletas");

        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'pt-BR,pt;q=0.9'
        };

        const { data } = await axios.get('https://www.ufc.com.br/athletes/all', {
            headers
        });

        const $ = cheerio.load(data);
        let athletes = [];

        $('.athlete-listing__name, .views-field-title a').each((_, el) => {
            const name = $(el).text().trim();

            let href =
                $(el).attr('href') ||
                $(el).find('a').attr('href');

            if (name && href && href.includes('/athlete/')) {
                const profileUrl = href.startsWith('http')
                    ? href
                    : "https://www.ufc.com.br" + href;

                if (!athletes.find(a => a.name === name)) {
                    athletes.push({ name, profileUrl });
                }
            }
        });

        athletes = athletes.slice(0, 80);

        console.log(`Total processado: ${athletes.length} atletas`);

        const result = [];

        for (const athlete of athletes) {
            try {
                const athletePage = await axios.get(athlete.profileUrl, {
                    headers,
                    timeout: 10000
                });

                const $at = cheerio.load(athletePage.data);

                let realImageUrl =
                    $at('img[src*="full_body"]').attr('src') ||
                    $at('.hero-profile__image').attr('src') ||
                    $at('img[src*="profile"]').attr('src');

                if (realImageUrl) {
                    if (realImageUrl.startsWith('//')) {
                        realImageUrl = 'https:' + realImageUrl;
                    }

                    const localPath = await downloadImage(realImageUrl, athlete.name);
                    
                    const storagePath = localPath || realImageUrl;

                    result.push({
                        name: athlete.name,
                        fotoUrl: storagePath,
                        weightClass:
                            $at('.hero-profile__division-title').text().trim() || "MMA Fighter",
                        ranking:
                            $at('.hero-profile__division-body').text().trim() || "N/A"
                    });
                }
            } catch (err) {
                console.log(`Erro ao processar ${athlete.name}`);
            }

            const delay = 1000 + Math.random() * 2000;
            await new Promise(r => setTimeout(r, delay));
        }

        console.log(`Finalizado: ${result.length} atletas processados`);
        return result;

    } catch (error) {
        console.error("Erro geral:", error.message);
        return [];
    }
}

module.exports = scrapeRankings;