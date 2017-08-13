const Telegraf = require('telegraf')
const fs = require('fs');
const spawn = require("child_process").spawn;

const app = new Telegraf(process.env.BOT_TOKEN)

const downloadPhotoMiddleware = (ctx, next) => {
  return app.telegram.getFileLink(ctx.message.photo[0])
    .then((link) => {
      ctx.state.fileLink = link
      return next()
    })
}

app.command('start', ({ from, reply }) => {
  return reply('Welcome!')
})

app.command('help', ({ from, reply }) => {
    return reply('We want to help you with new clothes.')
})

app.on('photo', downloadPhotoMiddleware, (ctx, next) => {
    const format = ctx.state.fileLink.slice(-3);
    fs.writeFile(`./original/test.${format}`, ctx.state.fileLink, (err) => {
        if (err) console.log('1111', err);
    })

    try {
        const process = spawn('python', ["../Odessa_Hack/__init__.py"]);
    } catch (e) {
        console.log('2222222', e);
    }

    return ctx.replyWithPhoto({ source: './result/mask.png' });
})



module.exports = app;
