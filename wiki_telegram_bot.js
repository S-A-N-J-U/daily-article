const axios = require('axios');
const cheerio = require('cheerio');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Set up your Telegram Bot Token and Group Chat ID
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Wikipedia API URL for fetching random articles
const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

const helpMessage = `
🤖 Welcome to the Random Wikipedia Article Bot! 📚

This bot fetches a random Wikipedia article and sends its summary to this Telegram group.
  
📋 Available Commands:

1. '/random' or '/getRandom': Fetch a new random Wikipedia article and post its summary to the group.
  
2. '/help': Display this help message.
  
🚀 Let's explore the vast knowledge of Wikipedia together! 🌐
`;

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

            return plainTextSummary.trim(); // Trim the whitespace before returning
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
}

// Matches "/random" or "/getRandom"
bot.onText(/\/(random|getRandom)/, async (msg) => {
    const chatId = msg.chat.id;

    const article = await getWikiArticle();
    if (article) {
        const message = `Title: ${article.title}\n\nSummary: ${article.summary}`;
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
});

// Matches "/help"
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// Listen for any kind of message. There are different kinds of messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    const validMessage = ['/start', '/help', '/random', '/getRandom'];

    if (msg.text === '/start') {
        bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    }
    if (!validMessage.includes(msg.text)) {
        const message = `Invalid command. Send /help for available commands.`;
        bot.sendMessage(chatId, message);
    }
});
