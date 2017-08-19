const handlebars = require('handlebars');
const fetch = require('node-fetch');
const config = require('./config');

let tmpl = `
<p><h3>selected seats: </h3><span id="seats"></span></p>
<iframe src="{{url}}" width="100%" height="1000"></iframe>
`;

function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split('&');
       for (var i = 0; i < vars.length; i++) {
               var pair = vars[i].split('=');
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
};

function getSeatingPlan (performanceId){ 
    let url = 'https://api.londontheatredirect.com/rest/v2/Performances/'+ performanceId + '/SeatingPlan?parentDomain=' + config.domain + '/seats';
    let init = config.init;
    let request = new fetch.Request(url, init);

    fetch(request)
        .then(response => {
            return response.json()
        })
        .then(response => {
            let seatingPlanUrl = response['SeatingPlanUrl'];
            const main = {
                 url: seatingPlanUrl,
            };

            let template = handlebars.compile(tmpl);
            let final = template(main);

            document.querySelector('body').innerHTML = final;
        })
}
let performId = getQueryVariable('performId');
getSeatingPlan(performId);

window.addEventListener('message', function (e) {
    var origin = e.origin || event.originalEvent.origin;
    if (origin !== 'https://www.londontheatredirect.com') {
        return;
    }
    var seats = e.data['seats'];
    let chatId = getQueryVariable('chatId');
    let count = seats.length;
    let text = 'You selected ' + count +  ' tickets';
    let url = 'https://api.telegram.org/bot' + config.token + '/sendMessage?chat_id=' + chatId + 
    '&text=' + text + '&reply_markup={"inline_keyboard":[[{"text":"Book Tickets","callback_data":"J' + chatId + '|' + seats.join(',') + '"}]]}';
    let init = config.init;
    let request = new fetch.Request(url, init);

    fetch(request)
        .then(res => res.json())
});