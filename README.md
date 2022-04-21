# a_new_day_bot
一个超简单的Telegram机器人，应某群绒布球要求写的。
功能是每天0点问候群友：新的一天开始了！
其实也可以设置定时在每小时或者任何时间报时或者问候。


# 安装
使用NPM安装一下依赖即可:

node-telegram-bot-api

node-schedule

express

request

silly-datetime

# 用法
在a_new_day_bot.js中修改你的bot token(TOKEN) 与 webhook(url)。

如果你使用了反代 (如httpd/nginx), 记得留意是否需要改端口号。

记得修改提示语和几点报时。

运行：

node a_new_day_bot.js
