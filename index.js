/* Modules */

const AWS = require('aws-sdk');
AWS.config.loadFromPath('./credentials/aws-credentials.json');

const Fs = require('fs')

const {Translate} = require('@google-cloud/translate');

/* Google Cloud */

const projectId = 'chinesepracticegenerator';

// Instantiates a translate client
const translate = new Translate({
 projectId: projectId,
 keyFilename: "./credentials/ChinesePracticeGenerator-9c112e9d0885.json"
});

/* Polly */

const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
})

function plParams(phrase,speed = 100,voiceId = 'Zhiyu') {
    return {
        'Text': '<speak>' + '<prosody rate="' + speed + '%">' + phrase + '</prosody>'+'</speak>',
        'OutputFormat': 'mp3',
        'VoiceId': voiceId,
        'TextType':'ssml'
    }
}

makeSpeech = () => {
    Polly.synthesizeSpeech(plParams('你好'), (err, data) => {
        if (err) {
            console.log(err.code)
        } else if (data) {
            if (data.AudioStream instanceof Buffer) {
                let fileName = "./working/output/speech.mp3";
                Fs.writeFile(fileName, data.AudioStream, function(err) {
                    if (err) {
                        return console.log(err)
                    }
                    console.log(fileName + " was saved!")
                })
            }
        }
    })
}
// makeSpeech();

getTranslation = (text,from = 'zh',to = 'en') => {
    const options = {
        from: from,
        to: to
    };
     
    // Translates some text into Russian
    translate
      .translate(text, options)
      .then(results => {
        const translation = results[0];
     
        console.log(`Text: ${text}`);
        console.log(`Translation: ${translation}`);
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
}
// getTranslation("我的自行车被偷了");