const TelegramBot = require('node-telegram-bot-api');
const routers = require('./modules/routers');
const config = require('./modules/config');
const showEvents = require('./modules/events').showEvents;
// const User = require('./models/user');

const bot = new TelegramBot(config.token, {
    polling: true
});

bot.onText(/\/start/, (msg, match) => {
    
    bot.sendMessage(msg.chat.id, 
        'Hello friend!\n Ready to visit one of the best shows in London?\n'+
        ' LTD will help you, just choose a type of performance or check all available shows', {
        reply_markup: {
            'keyboard': [['Show events by type'], ['All events']],
            'resize_keyboard': true,
            'one_time_keyboard': true
        }
    });
});


bot.onText(/\/showEvents/, (msg, match) => {
    let url = 'https://api.londontheatredirect.com/rest/v2/Events';
    showEvents(bot, msg.chat.id, url)
});

bot.on('message', (msg) => {
    routers.messageRouter(bot, msg);
});

bot.on('callback_query', (callbackQuery) => {
    routers.callbackRouter(bot, callbackQuery);
});