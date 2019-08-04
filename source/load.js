var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

var dynamo = new AWS.DynamoDB();

function sleep(ms) {
    var waitUntil = new Date().getTime() + ms;
    while(new Date().getTime() < waitUntil) true;
}

function putPlayer(name, ratings, old_ovr, stats, age, born, contract) {
    var params = {
        Item: {
            "Name": {
                S: name
            },
            "Ratings": {
                S: ratings
            },
            "LastOvr": {
                S: old_ovr
            },
            "Stats": {
                S: stats
            },
            "Age" : {
                N: age.toString()
            },
            "Born" : {
                S: born
            },
            "Contract" : {
                S: contract
            }
        },
        TableName: "ABF"
    };
    dynamo.putItem(params, function(err, data) { if (err) console.log(JSON.stringify(params) + '\n' + err, err.stack); });
    sleep(100);
}
var CURRENT_YEAR = 2049
var league = require('./' + CURRENT_YEAR + '.json');
players = league['players'];
var i = 0
for (let p of players) {
    var name = ""
    if (p['firstName']) {
        name = p['firstName'].trim()
    }
    if (p['lastName']) {
        name = name + " " + p['lastName'].trim()
    }
    var ratings = JSON.stringify(p['ratings'].slice(-1)[0])
    var old_ovr = '' + p['ratings'].slice(-2)[0]['ovr']
    var allStats = p['stats']
    var stats = {}
    for (let s of allStats) {
        if (s['season'] == CURRENT_YEAR - 1 && !s['playoffs']) {
            stats = s
        }
    }
    stats = JSON.stringify(stats)
    var age = CURRENT_YEAR - p['born']['year']
    var born = p['born']['loc'] ? p['born']['loc'] : 'Unknown'
    var contract = p['contract']['amount'] / 1000 + 'M thru ' + p['contract']['exp']
    putPlayer(name, ratings, old_ovr, stats, age, born, contract);
    i = i + 1
    console.log(i);
}
