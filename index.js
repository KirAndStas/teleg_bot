const Telegraf = require('telegraf');
const download = require('image-downloader')
const PythonShell = require('python-shell');
const fs = require('fs');

const app = new Telegraf(process.env.BOT_TOKEN)

const downloadPhotoMiddleware = (ctx, next) => {
  return app.telegram.getFileLink(ctx.message.photo[0])
    .then((link) => {
      ctx.state.fileLink = link
      return next()
    })
}

async function downloadImages(link) {
    try {
        const options = {
            url: link,
            dest: `./original/test.${link.slice(-3)}`
        }


        const { filename, image } = await download.image(options)
        console.log(filename) // => /path/to/dest/image.jpg
    } catch (e) {
        throw e
    }
}

app.command('start', ({ from, reply }) => {
  return reply('Welcome!')
})

app.command('help', ({ from, reply }) => {
    return reply('We want to help you with new clothes.')
})

app.on('photo', downloadPhotoMiddleware, (ctx, next) => {
    downloadImages(ctx.state.fileLink);

    try {
        var options = {
            pythonPath: '/usr/bin/python3.5'
        };

        PythonShell.run('../Odessa_Hack/__init__.py', function (err) {
            if (err) throw err;
            console.log('finished');
        });
    } catch (e) {
        console.log('2222222', e);
    }

    return ctx.replyWithPhoto({ source: './result/mask.png' });
})



module.exports = app;
