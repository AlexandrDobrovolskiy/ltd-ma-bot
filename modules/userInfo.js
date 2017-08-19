import * as config from './config';
import fetch from 'node-fetch';
console.log(config.userTemplate);

let ui = JSON.parse(JSON.stringify(config.userTemplate));
let init = JSON.parse(JSON.stringify(config.init));

let response = `
<div id="success">
    <div id="cpt"><div id="text"> <p align="center"><h4> Success! Now go to bot and resume booking =)</h4></p></div></div>
    <br><img src="trump-success.jpg" alt=""></div>
`;

let sendData = () => {
    ui['Name'] = document.querySelector('#Name').value;
    ui['LastName'] = document.querySelector('#lastName').value;
    // ui['Email'] = document.querySelector('#Email').value;
    ui['AddressLine1'] = document.querySelector('#Address1').value;
    ui['AddressLine2'] = document.querySelector('#Address2').value;
    // ui['Phone'] = document.querySelector('#CompanyName').value;
    // ui['Mobile'] = document.querySelector('#city').value;
    // ui['Country'] = document.querySelector('#country').value;
    ui['City'] = document.querySelector('#zip').value;
    // ui['Zip'] = document.querySelector('#phone').value;
    ui['StateCode'] = document.querySelector('#mobile').value;
    ui['CompanyName'] = document.querySelector('#stateCode').value;
    document.querySelector('body').innerHTML = response;
};

function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split('&');
       for (var i = 0; i < vars.length; i++) {
               var pair = vars[i].split('=');
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
};

let form = document.querySelector('#form123');

form.addEventListener('submit', function () {
    sendData();
    let chatId = getQueryVariable('chatId'); 
    let basketId = getQueryVariable('basketId');
    submitOrder(chatId, ui, basketId);
});

var submitOrder = function(chatId, userInf, basketId){
    let url = 'https://api.londontheatredirect.com/rest/v2/Baskets/' + basketId + '/SubmitOrder';
    init.body = JSON.stringify(userInf);
    init.method = 'POST';
    let request = new fetch.Request(url, init);

    fetch(request)
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            console.log(response);
            let paymentUrl = response['PaymentRedirectUrl'];
            let text = 'Submit Order'
            let url = 'https://api.telegram.org/bot' + config.token + '/sendMessage?chat_id=' + chatId + 
                '&text=' + text + '&reply_markup={"inline_keyboard":[[{"text":"Payment","url":"' + paymentUrl + '"  }]]}';

            let request = new fetch.Request(url, init);

            fetch(request)
               .then(response => {
                    response.json();
               })
        })
        .catch(err => {
            console.log(err);

        })
}
