const moment = require('moment');
const fetch = require('node-fetch');
const config = require('./config');
const performances = require('./performances');
const events = require('./events');
const tickets = require('./tickets');
const eventTypes = config.eventTypes;
const init = config.init;

var calendarPerfom = config.calendarPerfom;

exports.messageRouter = function (bot, msg){
    const chatId = msg.chat.id;
    if (msg.text === 'Show events by type'){
        events.showTypesKeyboard(bot, eventTypes, chatId);
    }

    for (let i = 0; i < eventTypes.length; i++){
        if (msg.text === eventTypes[i]['EventTypeName']){
            events.showEvents(bot, chatId, eventTypes[i]['EventTypeUrl'], eventTypes[i]['EventTypeName']);
        }
    }   
};

exports.callbackRouter = function (bot, callbackQuery) {
    var msg = callbackQuery.message;
    var chatId = msg.chat.id;
    var data = callbackQuery.data;

    if (data.charAt(0) === 'I') {
        let url = 'https://api.londontheatredirect.com/rest/v2/Events/' +
            data.substr(1) + // <=== event id
            '/Performances';
        let request = new fetch.Request(url, init);

        fetch(request)
            .then(response => {
                return response.json()
            })
            .then(response => {
                let performs = performances.performFilter(response['Performances']);
                if (performs.length === 0){
                    bot.sendMessage(chatId, 'This event not available for booking')
                } else {
                    calendarPerfom.push({
                        'perfomDates': performances.getDates(performs),
                        'currentMonth': moment().startOf('month'),
                        'EventId': performs[0]['EventId']
                    });
                    bot.sendMessage(chatId, msg.text,{
                        reply_markup: {
                            inline_keyboard: performances.makeCalendar(calendarPerfom.slice(-1)[0]),
                        },
                    });
                }
            })
            .catch(error => {
                bot.sendMessage(chatId, 'Sorry, something go wrong!((')
                console.log(error);
            });
    }

    if (data.charAt(0) === 'J') {
        let tmp = data.indexOf('|');
        let chtId = data.substr(1, tmp + 1)
        let ticketIds = data.substr(tmp + 1).split(',');
        tickets.createBasket(bot, chatId, ticketIds);
    }

    if (data.charAt(0) === 'D'){
        performances.getPerformancesByDate(bot, chatId, data.substr(1, 10), data.substr(11), msg.text);
    }

    if (data.substr(0, 4) === 'next') {
        controlButtons(bot, callbackQuery, 'add');
    }

    if (data.substr(0, 4) === 'prev') {
        controlButtons(bot, callbackQuery, 'subtract');
    }

    function controlButtons(bot, callbackQuery, changeMonthFlag){
        let local = {};

        for (let i = 0; i < calendarPerfom.length; i++){
            if (+calendarPerfom[i]['EventId'] === +callbackQuery.data.substr(4)){
                if (changeMonthFlag === 'add'){
                    calendarPerfom[i]['currentMonth'] = calendarPerfom[i]['currentMonth'].add(1, 'M').startOf('month');
                }
                else if (changeMonthFlag === 'subtract'){
                    calendarPerfom[i]['currentMonth'] = calendarPerfom[i]['currentMonth'].subtract(1, 'M').startOf('month');
                } else {
                    console.log('Error! Invalid flag, use add or subtract');
                }
                local = calendarPerfom[i];
            }
        }

        bot.editMessageText(msg.text, {
            chat_id: chatId,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: performances.makeCalendar(local),
            },
        });
    }
};