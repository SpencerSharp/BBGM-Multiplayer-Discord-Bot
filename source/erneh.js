var Discord = require('discord.io');
var auth = require('./auth.json');
var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

var dynamo = new AWS.DynamoDB();

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
	;
    if (message.substring(0, 1) === '!') {
		var ServerID = bot.channels[channelID].guild_id;
		console.log(ServerID);
		if(ServerID === '159396339761938432' || ServerID === '607415631444312067') {
			var Table = "ABF";
		} else if (ServerID === '461547461438210051') {var Table = "IBF";}
		  else if (ServerID === '599788255130550339') {var Table = "AHBA";}
			
        if (message.username === 'LABron23james') {
            return
        }
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !erneh
            case 'erneh':
                var ask = args[0]
                if (ask == 'ratings' || ask == 'stats' || ask == 'both') {
                    args = args.splice(1)
                }
                var fullName = args.join(' ').trim();
                var params = {
                    Key: {
                        "Name": {
                            S: fullName
                        }
                    },
                    TableName: Table
                };
                dynamo.getItem(params, function(err, data) {
                    if (err) {
                        bot.sendMessage({
                            to: channelID,
                            message: err
                        });
                    } else {
                        if ('Item' in data) {
                            name = data['Item']['Name']['S']
                            age = data['Item']['Age']['N']
                            born = data['Item']['Born']['S']
                            contract = data['Item']['Contract']['S']
                            last_ovr = data['Item']['LastOvr']['S']
                            info =
`${name}
**Age:** ${age}               **Contract:** ${contract}           **Born:** ${born}`
                            if (ask != 'stats') {
                                ratings = JSON.parse(data['Item']['Ratings']['S'])
                                r = {}
                                for (const rk of Object.keys(ratings)) {
                                    r[rk] = Math.round(ratings[rk])
                                }
                                ratings =
`
**Overall: ${r['ovr']}                                                        Potential: ${r['pot']}**
 *Physical                      Shooting                             Skill*
 Height: ${r['hgt']}                  Inside: ${r['ins']}                           Offensive IQ: ${r['oiq']}
 Strength: ${r['stre']}              Dunks/Layups: ${r['dnk']}            Defensive IQ: ${r['diq']}
 Speed: ${r['spd']}                   Free Throws: ${r['ft']}                Dribbling: ${r['drb']}
 Jumping: ${r['jmp']}               Two Pointers: ${r['fg']}               Passing: ${r['pss']}
 Endurance: ${r['endu']}           Three Pointers: ${r['tp']}            Rebounding: ${r['reb']}`

                                info = info + ratings
                            }
                            if (ask != 'ratings') {
                                s = JSON.parse(data['Item']['Stats']['S'])
                                if (s['season']) {
                                    stats =
`

Last season's (${s['season']}) stats (at ${last_ovr} OVR):
PER: ${s['per'].toFixed(2)}         EWA: ${s['ewa'].toFixed(2)}`
                                    info = info + stats
                                }
                            }
                            bot.sendMessage({
                                to: channelID,
                                message: info
                            });
                        } else {
                            bot.sendMessage({
                                to: channelID,
                                message: "Couldn't find " + fullName
                            });
                        }
                    }
                });
            break;
         }
     }
});
