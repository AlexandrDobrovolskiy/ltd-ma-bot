const fetch = require('node-fetch');
const config = require('./config');

var init = JSON.parse(JSON.stringify(config.init));
init.method = 'POST';

exports.createBasket = function(bot, chatId, tickets){
	let url = 'https://api.londontheatredirect.com/rest/v2/Baskets';
	let request = new fetch.Request(url, init);

	fetch(request)
	    .then(response => {
	    	return response.json()
	    })
	    .then(response => {
	    	return response['BasketId'];
	    })
	    .then(response => {
	    	addTickets(bot, chatId, response, tickets);
	    })
};

var addTickets = function(bot, chatId, basketId, tickets){
	let url = 'https://api.londontheatredirect.com/rest/v2/Baskets/' + basketId + '/Tickets';
	let ticketIds = JSON.stringify({'Tickets': tickets});
	init.body = ticketIds;
	let request = new fetch.Request(url, init);

	fetch(request)
	    .then(response => {
	    	return response.json()
	    })
	    .then(response => {
	    	if(response['Success']){
	    		sendForm(bot, chatId, basketId);
	    	}else{
	    		bot.sendMessage(chatId, 'Something go wrong, try later');
	    	}
	    })
	    .catch(err =>{
	    	bot.sendMessage(chatId, 'Error');
	    	console.log(err);
	    })
};

var sendForm = function(bot, chatId, basketId){
	let url = config.domain + '/userInfo?basketId=' + basketId + '&chatId=' + chatId;
	bot.sendMessage(chatId, 'Fill the form to sumbit order', {
		reply_markup:{
			inline_keyboard: [[{text: 'Form', url: url}]]
		}
	});
}