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
const ownerid = ['YOURID'];


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



app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

bot.onText(/\/get_chatid/, function onLoveText(msg) {
    const chatId = msg.chat.id;
    console.log(`get_chatid`+msg.chat.id)
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

bot.onText(/\/howtosend/, function onLoveText(msg) {
  const chatId = msg.chat.id;
  console.log(`howtosend`+msg.chat.id);
  bot.sendMessage(chatId, 'Should be: send text/img,target_id,content');
});


bot.onText(/\/send (.+)/, function onLoveText(msg, match) {
  let senderId = msg.chat.id;
  if (ownerids.includes(senderId.toString())) {
    let user_cmd = match[1];
    let cmds = user_cmd.split(',');
    if (cmds.length != 3) {
        bot.sendMessage(senderId, 'Wrong format! Should be: send text/img,target_id,content');
    }
    else {
        if(cmds[0]==='text'){
            console.log('sent_msg:',cmds[1], cmds[2]);
            bot.sendMessage(cmds[1], cmds[2]);
            bot.sendMessage(senderId, 'OK');
          }
          else if(cmds[0]==='img'){
            console.log('sent_photo:',cmds[1], cmds[2]);
            bot.sendPhoto(cmds[1], cmds[2]);
            bot.sendMessage(senderId, 'OK');
          }
          else {
            bot.sendMessage(senderId, 'Only support text/img');
          }
    }
  }
  else  {
      bot.sendMessage(senderId, 'Auth fail');
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
