const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const sd = require('silly-datetime');
const fs = require('fs');


const TOKEN = 'YOUR-TOKEN-HERE';
const url = 'YOUR-URL-HERE';
const port = 9001;


let enablelist = new Array();
function savelist () {
  fs.writeFile("enablelist.txt",JSON.stringify(enablelist), err => {
      if(!err) console.log("save success");
  });
}
function loadlist () {
  enablelist = JSON.parse(fs.readFileSync('enablelist.txt'));
  console.log(enablelist);
  console.log("load success");
}

loadlist();
const bot = new TelegramBot(TOKEN);
bot.setWebHook(`${url}/bot${TOKEN}`);
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => res.send(`I am a Telegram Bot`));

app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.post('/send', function (req, res) {
  chat_id=req.body.chat_id
  secret=req.body.secret
  if (secret === 'YOUR-PASSWORD-HERE') {
    if(req.body.type==='msg'){
      console.log('sent_msg:',chat_id, req.body.message);
      bot.sendMessage(chat_id, req.body.message);
      res.send(`OK`);
    }
    if(req.body.type==='photo'){
      console.log('sent_photo:',chat_id, req.body.url);
      bot.sendPhoto(chat_id, req.body.url);
      res.send(`OK`);
    }
  }
  else {
    console.log('send_msg_bad_secret');
    res.send(`???`);
  }
})

app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

bot.onText(/\/getid_a_new_day_bot/, function onLoveText(msg) {
    const chatId = msg.chat.id;
    console.log(`getid_a_new_day_bot`+msg.chat.id)
    bot.sendMessage(chatId, chatId);
});

bot.onText(/\/enable_a_new_day_bot/, function onLoveText(msg) {
  const chatId = msg.chat.id;
  console.log(`enable_a_new_day_bot`+msg.chat.id)
  if (enablelist.includes(chatId)) {
    bot.sendMessage(chatId, '之前就enable了2333');
  }
  else {
    enablelist.push(chatId);
    savelist();
    bot.sendMessage(chatId, '200 OK（假装自己是http server）');

  }
});

bot.onText(/\/disable_a_new_day_bot/, function onLoveText(msg) {
  const chatId = msg.chat.id;
  console.log(`disable_a_new_day_bot`+msg.chat.id)
  if (enablelist.includes(chatId)) {
    enablelist.pop(chatId);
    savelist();
    bot.sendMessage(chatId, '200 OK（假装自己是http server）');
  }
  else {
    bot.sendMessage(chatId, '并未enable了2333');
  }
});

bot.onText(/\/status_a_new_day_bot/, function onLoveText(msg) {
  const chatId = msg.chat.id;
  console.log(`status_a_new_day_bot`+msg.chat.id)
  if (enablelist.includes(chatId)) {
    bot.sendMessage(chatId, '已启用');
  }
  else {
    bot.sendMessage(chatId, '未启用');

  }
});

const sendmessageanewday = ()=>{
    schedule.scheduleJob('0 0 0 * * *',()=>{
      enablelist.forEach(function(x){
        console.log('send to:'+x)
        bot.sendMessage(x, '绒布球们快乐的一天开始了！');
      });
    });
}



sendmessageanewday();

// const sendmessageanewdayhour = ()=>{
//   schedule.scheduleJob('0 0 * * * *',()=>{
//     enablelist.forEach(function(x){
//       console.log('send to:'+x)
//       let timenow=sd.format(new Date(), 'YYYY-MM-DD HH:mm:00');
//       bot.sendMessage(x, '新的一小时开始了！' + '现在是北京时间 '+timenow);
//     });
//   });
// }


// sendmessageanewdayhour();
