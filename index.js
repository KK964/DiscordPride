const Discord = require('discord.js');
const client = new Discord.Client();
require("dotenv").config();
require("dotenv-flow").config();
const fs = require('fs');
const prerowcount = './rowcount.json';
const file = require(prerowcount);

const config = {
    token: process.env.TOKEN,
    spreadsheettoken: process.env.SPREADSHEETTOKEN,
    prefix: process.env.PREFIX,
    owner: process.env.OWNEN
}

const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const creds = require('./client_secret.json');
const { lookup } = require("dns");
const { title } = require('process');
const doc = new GoogleSpreadsheet(config.spreadsheettoken);
const newverreq = client.channels.cache.get("731721405330096199");

client.on('ready', () => {
    console.log(' = = = = = = = = = = = = = ');
    console.log(`     ${client.user.username} Is Ready`);
    console.log('= = = = = = = = = = = = = =');
    accessSpreadsheet();
})
client.on('guildMemberAdd', member => {
    member.send({embed: {
        color: 3447003,
        title: `**${member.displayName}** Welcome :D`,
        description: `Thanks for joining **${member.guild.name}**, ${member.displayName}`,
        url: 'https://forms.gle/db1rnbxAGrrXUJSP9',
        fields: [
            {
                name: 'Verification',
                value: 'We need to verify that you are a real person.\nPlease Click the blue text!\n\n*when done, type `!vsent` in #verify*',
                inline: true,
            }
        ],
        timestamp: new Date()
    }}).catch(() => 
    client.channels.cache.get("730595007169429555").send(`${member}, Please turn on your DMs, then type !verify in this channel!`).then
    (client.channels.cache.get("731721405330096199").send({embed: {
        color: '#cc0e11',
        title: `DMs`,
        author: {
            name: `${member.displayName}`
        },
        description: `${member.displayName}, does not have DMs open!`,
        timestamp: new Date(),
    }})))
})

client.on('message', msg => {
    const member = msg.author;
    if(member.bot){return}
    if(msg.channel.type == 'dm') {return}
    if(msg.content == config.prefix + "verify") {
        if(!msg.channel == "730595007169429555") {return msg.react('❌')}
        member.send({embed: {
            color: 3447003,
            title: `**${member.displayName}** Welcome :D`,
            description: `Thanks for joining, ${member.displayName}`,
            url: 'https://forms.gle/db1rnbxAGrrXUJSP9',
            fields: [
                {
                    name: 'Verification',
                    value: 'We need to verify that you are a real person.\nPlease Click the blue text!\n\n*when done, type `!vsent` in #verify*',
                    inline: true,
                }
            ],
            timestamp: new Date()
        }}).catch(() => 
        client.channels.cache.get("730595007169429555").send(`${member}, Please turn on your DMs, then type !verify in this channel!`).then
        (client.channels.cache.get("731721405330096199").send({embed: {
            color: '#cc0e11',
            title: `DMs`,
            author: {
                name: `${member.displayName}`
            },
            description: `${member.displayName}, does not have DMs open!`,
            timestamp: new Date(),
        }})))
    }
    if(msg.content == config.prefix + "vsent") {
        if(!msg.channel == "730595007169429555") {return msg.react('❌')}
        if(msg.member.roles.cache.has("729882426494681238")) {return msg.react('❌')}
        client.channels.cache.get('731721405330096199').send('<@&727587905064927335> new request for verification.')
    }

    if(msg.content == config.prefix + "purge") {
        if(!msg.member.hasPermission('MANAGE_MESSAGES')) {return msg.delete()}
        if(msg.channel.type = "text") {
            msg.channel.messages.fetch(100)
            .then(messages => {
                msg.channel.bulkDelete(messages);
            })
        }
    }
})

function printResponse(response) {
    console.log(`==========================================================\nDiscord: ${response.whatsyourdiscordaccountexample1234}\nIGN: ${response.whatsyourminecraftign}\nWhats your view on the lgbtq+ community: ${response.whatisyourviewonthelgbtcommunity}\nDo you understand that you can be banned from competing: ${response.doyouunderstandthatyoucanbebannedfromcompeting}\nAre you a part of any of our partner servers: ${response.areyouapartofanyofourpartnerservers}\nHow did you find us: ${response.howdidyoufindus}\nDo you agree that you will listen to all staff: ${response.doyouagreethatyouwilllistentoallstaff}`);
    //client.channels.cache.get("731721405330096199").send(`==========================================================`);
    client.channels.cache.get("731721405330096199").send({embed: {
        color: 3447003,
        title: `${response.whatsyourdiscordaccountexample1234}`,
        fields: [
            { name: "Questions", value: `IGN\nView On LGBTQ+ community\nCan be banned\nPart of partner servers\nFind us\nListen to staff`, inline: true},
            { name: "Response", value: `${response.whatsyourminecraftign}\n${response.whatisyourviewonthelgbtcommunity}\n${response.doyouunderstandthatyoucanbebannedfromcompeting}\n${response.areyouapartofanyofourpartnerservers}\n${response.howdidyoufindus}\n${response.doyouagreethatyouwilllistentoallstaff}`, inline: true}
        ],
        timestamp: `${response.timestamp}`
    }});

    /*client.channels.cache.get("731721405330096199").send(`==========================================================`);
    client.channels.cache.get("731721405330096199").send(`Discord: ${response.whatsyourdiscordaccountexample1234}`);
    client.channels.cache.get("731721405330096199").send(`IGN: ${response.whatsyourminecraftign}`);
    client.channels.cache.get("731721405330096199").send(`Whats your view on the lgbtq+ community: ${response.whatisyourviewonthelgbtcommunity}`)
    client.channels.cache.get("731721405330096199").send(`Do you understand that you can be banned from competing: ${response.doyouunderstandthatyoucanbebannedfromcompeting}`);
    client.channels.cache.get("731721405330096199").send(`Are you a part of any of our partner servers: ${response.areyouapartofanyofourpartnerservers}`);
    client.channels.cache.get("731721405330096199").send(`How did you find us: ${response.howdidyoufindus}`);
    client.channels.cache.get("731721405330096199").send(`Do you agree that you will listen to all staff: ${response.doyouagreethatyouwilllistentoallstaff}`);*/
}

async function accessSpreadsheet() {
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];
    //console.log(`Title: ${sheet.title}, Rows: ${sheet.rowCount}`);
    let rowlength = sheet.rowCount - 1;
    const rows = await promisify(sheet.getRows)({
        offset: rowlength
    });
    if(sheet.rowCount > file.rowcount) {
        file.rowcount = sheet.rowCount;
        fs.writeFile(prerowcount, JSON.stringify(file), function writeJSON(err) {
            if (err) return console.log(err);
            /*console.log(JSON.stringify(file));
            console.log('writing to ' + prerowcount);*/
        })
    rows.forEach(row => {
        printResponse(row);
    })}
    await accessSpreadsheet();
}

client.login(config.token);