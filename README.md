# Random Wikipedia Article Telegram Bot

This is a simple Telegram bot built with Node.js that fetches a random Wikipedia article and sends its summary to a Telegram group. The bot uses Wikipedia's API to get random articles and then formats the summary in MarkdownV2 before sending it to the Telegram group.

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)

### Installing Dependencies

1. Clone this repository to your local machine.
2. Navigate to the project directory in the terminal.
3. Install the dependencies by running the following command:

```bash
npm install
```

### Configuration
1. Rename the .env.example file to .env.
2. Open the .env file and replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram bot token received from @BotFather.
3. Replace 'YOUR_TELEGRAM_GROUP_CHAT_ID' with the ID of the Telegram group chat where you want to post the random Wikipedia articles. (Note: Group chat IDs start with a negative sign "-").

### Running the Bot
To run the bot, use the following command in the terminal:
```bash
npm start
```

The bot will start fetching random Wikipedia articles and posting their summaries to the specified Telegram group chat.

### Available Commands

The bot currently supports the following commands in the Telegram group chat:

* /random: Fetch a new random Wikipedia article and post its summary to the group.

### Acknowledgments
* This bot uses the 'node-telegram-bot-api' library to interact with the Telegram Bot API. (https://github.com/yagop/node-telegram-bot-api)
* Wikipedia API is used to fetch random articles. (https://www.mediawiki.org/wiki/API:Main_page)

### License
This project is licensed under the MIT License - see the LICENSE file for details.

Make sure to replace the placeholders such as `'YOUR_TELEGRAM_BOT_TOKEN'` and `'YOUR_TELEGRAM_GROUP_CHAT_ID'` with your actual Telegram bot token and group chat ID. Save this content in a file named `README.md`, and it will serve as the README documentation for your project.
