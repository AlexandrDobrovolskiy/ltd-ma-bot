const moment = require('moment');
const fetch = require('node-fetch');
const config = require('./config');
const init = config.init;

exports.performFilter = function (data){
    let available = []
    for (let i = 0; i < data.length; i++){
        if (data[i]['TotalAvailableTickesCount']){
            available.push(data[i]);
        }
    }
    return available
}

exports.makeCalendar = function (calendPerform) {
    var calendar = [];
    var week = [];
    var date = calendPerform['currentMonth'];
    var daysInMonth = date.daysInMonth()

    calendar.push([{
        text: date.format('MMMM YYYY'),
        callback_data: 'calendar'
    }]);

    for (let i = 0; i < 7; i++) {
        if (i === 0){
            week.push({
                text: date.format('dd'),
                callback_data: 'calendar'
            });
        } else {
            week.push({
                text: date.add(1, 'd').format('dd'),
                callback_data: 'calendar'
            });
        }
    }

    date = date.startOf('month');
    calendar.push(week);
    week = [];
    var perfomDates = calendPerform['perfomDates'];
   
    for (let i = 1; i <= date.daysInMonth(); i++) {
        let fDate = date.format().substr(0,10);
        if (perfomDates.has(fDate) && fDate >= moment().format().substr(0,10) ) {
            week.push({
                text: '>' + i.toString() + '<',
                callback_data: 'D' + fDate + calendPerform['EventId']
            });
        } else {
            week.push({
                text: moment(i, 'DD').format('Do').toString(),
                callback_data: 'calendar'
            });
        }
        if (i % 7 === 0 || i === daysInMonth) {
            calendar.push(week);
            week = [];
        }
        date.add(1, 'd');
    }
    if (calendar.slice(-1)[0].length < 7) {
        var len = calendar.slice(-1)[0].length;
        for (let i = 1; i <= 7 - len; i++) {
            calendar.slice(-1)[0].push({
                text: ' ',
                callback_data: 'calendar'
            });
        }
    }
    calendar.push([{
            text: '<===',
            callback_data: 'prev' + calendPerform['EventId']
        },
        {
            text: '===>',
            callback_data: 'next' + calendPerform['EventId']
        }
    ]);
    calendPerform['currentMonth'].subtract(1,'M');
    return calendar;
}

exports.getDates = function (data) {
    var performDates = new Set();
    for (let i = 0; i < Object.keys(data).length; i++) {
        performDates.add(data[i]['PerformanceDate'].substr(0,10));
    }
    return performDates;
}

exports.getPerformancesByDate = function(bot, chatId, date, eventId, text){
    let dateFrom = moment(date).format('YYYY-MM-DD');
    let dateTo = moment(dateFrom).add(1, 'd').format('YYYY-MM-DD');
    let url = 'https://api.londontheatredirect.com/rest/v2/Events/' + eventId +
        '/Performances?dateFrom=' + dateFrom + '&dateTo=' + dateTo;
    let request = new fetch.Request(url, init);

    fetch(request)
        .then(response => {
            return response.json()
        })
        .then(response => {
            performances = response['Performances'];
            if (performances.length !== 0){
                showDatesKeyboard(bot, performances, chatId, text);
            } else {
                bot.sendMessage(chatId, 'Sorry, there are no performances on this date');
            }
        })
        .catch(error => {
            bot.sendMessage(chatId, 'Sorry, something go wrong!((');
            console.log(error);
        });
}

var showDatesKeyboard = function(bot, performances, chatId, text){
    let keyboard = [];
    for(let i = 0; i < performances.length; i++){
        keyboard.push([{
            text: performances[i]['PerformanceDate'].substr(11),
            url: 'http://ltd-bot.herokuapp.com/seats?performId=' + 
                performances[i]['PerformanceId'].toString() + '&chatId=' + chatId
        }]);
    }
    bot.sendMessage(chatId, text, {
        reply_markup: { 
            inline_keyboard: keyboard
        }
    });
};