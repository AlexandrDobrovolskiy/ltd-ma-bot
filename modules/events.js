const moment = require('moment');
const fetch = require('node-fetch');
const config = require('./config');
const init = config.init;

exports.showEvents = function(bot, chatId, url, flag) {
    let request = new fetch.Request(url, init);

    fetch(request)
        .then(response => {
            return response.json()
        })
        .then(response => {
            let events = eventFilter(response['Events'], flag);
            let eventsCount = Object.keys(events).length;
            (function loop(i) {
                if (i < eventsCount) new Promise(resolve => {
                    let event = events[i];
                    eventPrinter(bot, event, chatId);
                    setTimeout(resolve, 193);
                }).then(loop.bind(null, i+1));
                if (i === eventsCount){
                    bot.sendMessage(chatId,
                        "That's all!  Check it out and choose the best for you");
                }
            })(0);
        })
        .catch(error => {
            bot.sendMessage(chatId, 'Sorry, something go wrong!((');
            console.log(error);
        });
};

exports.showTypesKeyboard = function(bot, eventTypes, chatId){
    let keyboard = [];
    for(let i = 0; i < eventTypes.length; i++){
        keyboard.push([eventTypes[i]['EventTypeName']]);
    }
    bot.sendMessage(chatId, 'Choose event type', {
        reply_markup: { 
            'keyboard': keyboard,
            'resize_keyboard': true,
            'one_time_keyboard': true
        }
    });
};

function eventFilter(data, flag) {
    var events = [];

    if(flag === 'Most Popular'){
        data = data.slice(0,17);
    }

    for (let i = 0; i < data.length; i++) {
        if (
            moment().add(7, 'd') >= moment(data[i]['StartDate']) &&
            data[i]['EventMinimumPrice'] &&
            data[i]['EventType'] != 3 &&
            data[i]['EventId'] != 2841 &&
            data[i]['EventType'] != 13 &&
            data[i]['Name'].indexOf('NEW YORK') === -1
            ) {
                events.push(data[i]);
        }
        for (var prop in data[i]) {
            if (data[i][prop] == null) {
                data[i][prop] = '-';
            }
        }
    }
    return events;
}

function eventPrinter(bot, event, chatId) {
    let msg = '<b>' + event['Name'] + '</b>\n\
    <a href="' + event['MainImageUrl'] + '">\
    ___________________________________</a>\n\n\
    <em>' + event['TagLine'] + '</em>\n\n\
    Running Time: ' + event['RunningTime'] + '\n\
    Child Policy: ' + event['MinimumAge'] + '\n\n\
    <b>From ' + event['EventMinimumPrice'] + '&#163</b>';

    bot.sendMessage(chatId, msg, {
        parse_mode: 'HTML',
        disable_notification: true,
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Show More',
                    url: 'http://ltd-bot.herokuapp.com/event?eventId=' + event['EventId']
                }],
                [{
                    text: 'Show Performances',
                    callback_data: 'I' + event['EventId'].toString()
                }]
            ]
        }
    });
}