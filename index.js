const Telegraf = require('telegraf');
const download = require('image-downloader');
const emptyDir = require('empty-dir');
const PythonShell = require('python-shell');
const fs = require('fs');
const exec = require('child_process').exec;

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
        const result = emptyDir.sync('./test/empty');
        const options = {
            pythonPath: '/usr/bin/python3.5'
        };

        console.log('qqqqqqqqq', result);

        if (!result) {
            PythonShell.run('../Odessa_Hack/__init__.py', options, function (err) {
                if (err) throw err;
                console.log('finished');
            });
        } else {
            exec('rm' + '/home/mykhalychnickolay/teleg_bot/original/*', function (err, stdout, stderr) {
                // your callback goes here
            });
        }

    } catch (e) {
        console.log('2222222', e);
    }

    return ctx.replyWithPhoto({ source: './result/mask.png' });
})



module.exports = app;
