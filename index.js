const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');

dotenv.config();

let channel = client.channels.cache.get('665184285858463754')

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

function statusHasCanghed(member) {
    let bool;

    if (usersChrono.length > 0) {
        usersChrono.forEach((user) => {
            if (member.id == user.id && member.presence.status == user.lastStatus) {
                bool = false;
            } else if (member.id == user.id) {
                user.lastStatus = member.presence.status;
                bool = true;
            }
        })
    } else {
        bool = true;
    }
    return bool;
}


client.once('ready', () => {
    console.log("Peppe is ready!")
    channel = client.channels.cache.get('665184285858463754');
});

client.on('presenceUpdate', (status) => {
    let message;

    if (statusHasCanghed(status.member)) {

        switch (status.member.presence.status) {
            case "online":
                message = "è qui  😍"
                break
            case "dnd":
                message = "è un pò antipatico  🛑"
                break
            case "offline":
                message = "non è più tra noi  🧟‍♂️"
                break
            case "idle":
                message = "ha preso sonno  💤"
                break
        }
        channel.send(`${status.member} ${message}`)
    }

    let x = usersChrono.find((obj) => obj.id == status.member.id);

    if (x == undefined) {
        usersChrono.push({ 'id': status.member.id, 'lastStatus': status.member.presence.status });
    } else {
        let index = usersChrono.map((e) => { return e.id }).indexOf(status.member.id);
        usersChrono[index].lastStatus = status.member.presence.status;
    }

})

client.on('message', (msg) => {
    let message;

    if (msg.content.toLowerCase() == "!help") {
        channel.send(`Ciao ${msg.author.username}! Sono Peppe e rendo questo server più interessante! Per ora i miei comandi sono : !watch, !poke @<nome>, !8Ball <domanda>. Provali per scoprire cosa fanno!`);
    }
    else if (msg.content.toLowerCase() == 'ping') {
        channel.send("pong!");
    }
    else if (msg.content.toLowerCase() == "!watch") {
        channel.send("Ecco la stanza https://bit.ly/2Avtbqu !");
    }
    else if (msg.content.toLowerCase() == "omg") {
        channel.send("omg omg");
    }
    else if (msg.content.substring(0, 5) == "!poke" && msg.content.length > 5) {
        let user = msg.mentions.users.first(); //grabbing the user mention

        for (let i = 0; i < 5; i++) {
            user.send(`Sveglia! ${msg.author.username} vuole giocare con te!`);
        }
    }
    else if (msg.content.substring(0, 6) == "!8Ball" && msg.content.length > 5) {
        let reply = Math.floor(Math.random() * answers.length)
        channel.send(answers[reply]);
    } else if (msg.content.charAt(0) == "!") {
        channel.send("Mhhh, non ho alcun comando con quel nome...")
    }
})

client.login(process.env.TOKEN);
