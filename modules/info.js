const handlebars = require('handlebars');
const fetch = require('node-fetch');
const config = require('./config')

let html = `
<div id="mainInfo">
    <div id="mainContent">
        <div id="image"><img src="{{mainImage}}" alt="main image" id="mainImage"></div>
        <div id="shortInfo">
            <h3>{{name}}</h3>
            {{description}}
        </div>
    </div>
<div id="photos">
{{#each photos}}
<div>
<img src="{{Url}}" alt="photo" class="photo">
</div>
{{/each}}
</div>
</div>
`;

var getQueryVariable = function(variable){
       var query = window.location.search.substring(1);
       var vars = query.split('&');
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split('=');
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

const init = config.init;
let url = 'https://api.londontheatredirect.com/rest/v2/Events/' + getQueryVariable('eventId');

let request = new fetch.Request(url, init);

let content = {
    name: '',
    description: '',
    mainImage: '',
    photos: [{
        'Url': '',
    }],
    videoUrl: ''
};

fetch(request).then((response) => {
    return response.json();
}).then((response) => {
    content.name = response['Event']['Name'];
    content.description = response['Event']['Description'];
    content.mainImage = response['Event']['MainImageUrl'];
    content.photos = response['Event']['Images'];
    handlebars.registerHelper('description', () => {
        return new handlebars.SafeString(content.description);
    });

}).then(() => {
    let template = handlebars.compile(html);
    let final = template(content);

    document.querySelector('#mainContainer').innerHTML = final;
})

exports.getQueryVariable = getQueryVariable;