const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');

dotenv.config();

let channel;

let usersChrono = [];

const answers = [
    'Secondo il mio punto di vista si',
    'Si!',
    'Le mie approfondite ricerche dicono di no',
    'Si, ma non ne sarei troppo sicuro',
    'Secondo me è colpa di Dario',
    'No, non è questo il caso',
    'Meglio che non te lo dico',
    'Probabilmente',
    'Forse si, forse no',
    'Sono sicuro al 69%',
    'La risposta alla domanda potrebbe non essere no',
    'Ieri ti avrei detto di si senza pensarci, ma ora non ne sono così sicuro',
    'Enzogucci ha le risposte',
]

function statusHasChanged(member) {
    let bool;

    usersChrono.forEach((user) => {
        if (member.id === user.id && member.presence.status == user.lastStatus) {
            bool = false;
        }
    })
    if (bool == undefined) bool = true;
    return bool;
}

client.once('ready', () => {
    console.log("Peppe is ready!")
    channel = client.channels.cache.get(process.env.BOT_CHANNEL);

    client.guilds.cache.get("665181987077750834").members.fetch().then(members => {
        members.forEach(member => {
            let obj = {
                id: member.id,
                lastStatus: member.presence.status
            };
            usersChrono.push(obj);
        })
    })
});

client.on('presenceUpdate', (status) => {
    let message;

    if (status != undefined) {
        if (statusHasChanged(status.member)) {
            switch (status.member.presence.status) {
                case "online":
                    message = "è qui  😍"
                    break;
                case "dnd":
                    message = "è un pò antipatico  🛑"
                    break;
                case "offline":
                    message = "non è più tra noi  🧟‍♂️"
                    break;
                case "idle":
                    message = "ha preso sonno  💤"
                    break;
                default:
                    message = "ha cambiato il suo stato! 🐱‍👤"
                    break;
            }
            channel.send(`${status.member.user.username} ${message}`);
            //only for debug
            console.log(`${status.member.user.username} ha cambiato il suo stato in ${status.member.presence.status}`)
            //
            usersChrono[usersChrono.map((e) => { return e.id }).indexOf(status.member.id)].lastStatus = status.member.presence.status;
        }
    }

})

client.on('message', (msg) => {
    if (msg.content.toLowerCase() == "!help") {
        channel.send(`Ciao ${msg.author.username}! Sono Peppe e rendo questo server più interessante! Per ora i miei comandi sono : !watch, !poke @<nome>, !8Ball <domanda>. Provali per scoprire cosa fanno!`);
    }
    else if (msg.content.toLowerCase() == 'ping') {
        channel.send("pong!");
    }
    else if (msg.content.toLowerCase() == "!watch") {
        channel.send(`Ecco la stanza ${process.env.WATCH2GETHER_URL} !`);
    }
    else if (msg.content.toLowerCase() == "omg") {
        channel.send("omg omg");
    }
    else if (msg.content.substring(0, 5).toLowerCase() == "!poke" && msg.content.length > 5) {
        for (let i = 0; i < 5; i++) {
            msg.mentions.users.first().send(`Sveglia! ${msg.author.username} vuole giocare con te!`);
        }
        channel.send(`${msg.mentions.users.first().username} è stato avvisato!`)
    }
    else if (msg.content.substring(0, 6).toLowerCase() == "!8ball".toLowerCase() && msg.content.length > 5) {
        let reply = Math.floor(Math.random() * answers.length)
        channel.send(answers[reply]);
    } else if (msg.content.toLowerCase() == "!silenzia") {
        let role = msg.guild.roles.cache.find(role => role.name === "MUTABOT");
        msg.member.roles.add(role);
        msg.member.send("Mi hai mutato! Non riceverai più notifiche dal canale e non potrai ne leggere ne inviare messaggi su quel canale. Per smutarmi contatta un admin!")
    }
    else if (msg.content.toLowerCase().search("sile") != -1) {
        channel.send('Non capisco perchè tutti mi odiate :/, se proprio non mi sopporti usa !silenzia');
    }
    else if (msg.content.charAt(0) == "!") {
        channel.send("Mhhh, non ho alcun comando con quel nome...")
    }
})

client.login(process.env.TOKEN);
