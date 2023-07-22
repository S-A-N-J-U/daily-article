const axios = require('axios');
const cheerio = require('cheerio');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Set up your Telegram Bot Token and Group Chat ID
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Wikipedia API URL for fetching random articles
const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

function getRandomWikiArticle() {
    const params = {
        format: 'json',
        action: 'query',
        list: 'random',
        rnnamespace: 0, // Limit results to articles (namespace 0)
    };
    return axios.get(WIKIPEDIA_API_URL, { params })
        .then(response => {
            const randomArticle = response.data.query.random[0];
            return randomArticle.title;
        })
        .catch(error => {
            console.error('Failed to fetch a random Wikipedia article:', error.message);
            return null;
        });
}

function getWikiSummary(articleTitle) {
    const params = {
        format: 'json',
        action: 'query',
        prop: 'extracts',
        exintro: true,
        titles: articleTitle,
    };
    return axios.get(WIKIPEDIA_API_URL, { params })
        .then(response => {
            const pageId = Object.keys(response.data.query.pages)[0];

            let htmlSummary = response.data.query.pages[pageId].extract;

            // Use cheerio to parse the HTML and remove <p> and <br> tags
            const $ = cheerio.load(htmlSummary);
            $('br').replaceWith('\n');
            const plainTextSummary = $.text();

            console.log(`Summary: ${plainTextSummary}`);

            return plainTextSummary;
        })
        .catch(error => {
            console.error('Failed to fetch Wikipedia article summary:', error.message);
            return null;
        });
}

async function getWikiArticle() {
    try {
        // Get a random Wikipedia article
        const randomArticleTitle = await getRandomWikiArticle();
        if (randomArticleTitle) {
            // Get the summary of the random article
            const articleSummary = await getWikiSummary(randomArticleTitle);

            return { title: randomArticleTitle, summary: articleSummary };

        } else {
            console.error('Failed to fetch a random Wikipedia article.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};


// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, async (msg) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;

    const article = await getWikiArticle();

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, article);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    const { title, summary } = await getWikiArticle();

    const message = `Title: ${title}\n${summary}`;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, message)
        .then(() => {
            console.log('Message Sent Successfully')
        })
        .catch(err => console.log(`Error: ${err.message}`));
});