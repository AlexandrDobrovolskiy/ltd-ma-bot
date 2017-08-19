const moment = require('moment');
const fetch = require('node-fetch');

exports.token = '411054335:AAHMRKSUpfO4OY_jBfJqpSjgI06TrIXer-g';
// exports.token = '402102841:AAGJHEFy9hjrEAqQzFgfQs6Mw-KZx6fCj48';


var headers = {
        'Api-Key': 'kjeqfrhamu8g25zyzjsjzre4',
        'Content-Type': 'application/json'
};

exports.headers = new fetch.Headers(headers);

exports.init = {
    method: 'GET',
    headers: headers
};

exports.userTemplate = {
    "Email": "john.smith@test.com",
    "Name": "John",
    "LastName": "Smith",
    "AddressLine1": "132, My Street",
    "AddressLine2": "1st floor",
    "CompanyName": "Company, s.r.o.",
    "City": "London",
    "Country": 218,
    "Zip": "WC1A 1AA",
    "Phone": "020 7946 0645",
    "Mobile": "020 7946 0645",
    "StateCode": "GB",
    "DeliveryType": 1,
    "RequireTicketPlan": true,
    "SuccessReturnUrl": "https://www.londontheatredirect.com",
    "FailureReturnUrl": "https://www.londontheatredirect.com",
    "SendConfirmationEmail": true,
    "TransactionReference": "ticket123",
    "PaymentGateLanguage": 1
}

exports.eventTypes = [
	{
        'EventTypeUrl':'https://api.londontheatredirect.com/rest/v2/Events',
        'EventTypeName': 'Most Popular'
    },
    {
        'EventTypeUrl': 'https://api.londontheatredirect.com/rest/v2/Events?type=1',
        'EventTypeName': 'Musical'
    },
    {
        'EventTypeUrl': 'https://api.londontheatredirect.com/rest/v2/Events?type=2',
        'EventTypeName': 'Play'
    },
    {
        'EventTypeUrl': 'https://api.londontheatredirect.com/rest/v2/Events?type=4',
        'EventTypeName': 'Ballet & Dance'
    },
    {
        'EventTypeUrl': 'https://api.londontheatredirect.com/rest/v2/Events?type=5',
        'EventTypeName': 'Opera'
    }, 
    {
        'EventTypeUrl':'https://api.londontheatredirect.com/rest/v2/Events',
        'EventTypeName': 'All events'
}];

exports.calendarPerfom = [{
        'perfomDates': new Set(),
        'currentMonth': moment().startOf('month'),
        'EventId': ' '
 }];

exports.domain = 'http://ltd-bot.herokuapp.com';