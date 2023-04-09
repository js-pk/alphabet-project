const needle = require('needle');
const fs = require('fs');

const token = 'AAAAAAAAAAAAAAAAAAAAAA5EVAEAAAAApopaAIFkiXGWyc0MrWZEj4BvWhc%3DLOzQmXYC0A8pZYL0gHBnLixhk1EF5IJnpu7eX4NGTPRHpPjHkU';
const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

const date = new Date();
const timestamp = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)} ${date.getHours()}:${date.getMinutes()}-${date.getSeconds()}`;


async function getTweets() {

    let params = {
        'max_results': 100,
        'query': '-is:retweet young -to:young',
        'tweet.fields': 'created_at'
    }
    
    const res = await needle('get', endpointUrl, params, {
        headers: {
            "User-Agent": "v2RecentSearchJS",
            "authorization": `Bearer ${token}`
        }
    })

    if (res.body.meta) { //if no meta, error occurred
        let resultHtml;
        
        let young = "";
        for (let i=0; i<2500; i++) {
            young += "young ";
        }
        resultHtml = `<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1" /><link rel="stylesheet" href="./style.css" /><script   src="https://code.jquery.com/jquery-3.6.0.min.js"   integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="   crossorigin="anonymous"></script><script src="./script.js"></script><title>SO YOUNG</title> </head><body><div class="background">${young}</div><div class="tweet">`
        res.body.data.forEach(t => {
            let tweet = t.text;
            let result_tweet;
            
            result_tweet = tweet.replace(/(young|Young)/, `<a class="young" href="https://twitter.com/i/web/status/${t.id}">$1</a>`)
            
            mentions = Array.from(tweet.matchAll(/(@\w+)/g), m => m[0]);        
            mentions.forEach(m => {
              result_tweet = result_tweet.replace(m, `<a class="mention" href="https://twitter.com/${m}">${m}</a>`)  
            })
            
            links = Array.from(tweet.matchAll(/(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g), l => l[0]);
            links.forEach(l => {
                result_tweet = result_tweet.replace(l, `<a class="link" href="${l}">${l}</a>`)  
            })
           
            resultHtml += `<span>${result_tweet}</span><br><br><br>`
        })
        resultHtml += '</div></body></html>'
        
        fs.writeFileSync(`./public/tweets_${timestamp}.json`, JSON.stringify(res.body, null, 2), (err) => {
          if (err) throw err;
        });
        fs.writeFileSync(`./public/result_${timestamp}.html`, resultHtml, (err) => {
          if (err) throw err;
        });
        
        return res.body;
    } else {
        console.log(res.body.title + ', detail: ' + res.body.detail);
        console.log(res.body.type + ', status: ' + res.body.status);
        console.log(res.body);
        throw new Error('Unsuccessful request');
    }
}

getTweets();