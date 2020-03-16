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
		
		
		var ServerID = typeof bot.channels[channelID] != "undefined" ? bot.channels[channelID].guild_id : '159396339761938432';
		console.log(ServerID);
		if(ServerID === '159396339761938432' || ServerID === '607415631444312067') {
			var Table = "ABF";
		} else if (ServerID === '461547461438210051') {var Table = "IBF";}
		  else if (ServerID === '599788255130550339') {var Table = "AHBA";}//
		  else if (ServerID === '687772178116247554') {var Table = "DRBL";}
	
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
				if (ServerID === '687772178116247554') {ask='stats';}
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
Basic                           Advanced
 Points: ${(s['pts'] / s['gp']).toFixed(3)}             EWA: ${s['ewa'].toFixed(3)}
 Rebounds: ${s['trbp'].toFixed(3)}           OWS: ${s['ows'].toFixed(3)}
 Assists: ${s['astp'].toFixed(3)}            DWS: ${s['dws'].toFixed(3)}
 Steals: ${s['stlp'].toFixed(3)}             ORTG: ${s['ortg'].toFixed(3)}
 Blocks: ${s['blkp'].toFixed(3)}             DRTG: ${s['drtg'].toFixed(3)}
 FG%: ${(s['fg'] / s['fga']).toFixed(3)}                PER: ${s['per'].toFixed(3)} 
 3PT%: ${((s['fg']-s['fgAtRim']-s['fgLowPost']-s['fgMidRange']) / (s['fga']-s['fgaAtRim']-s['fgaLowPost']-s['fgaMidRange'])).toFixed(3)} 
 Turnovers: ${(s['tov'] / s['gp']).toFixed(3)} `
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
