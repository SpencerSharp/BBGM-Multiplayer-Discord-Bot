"use strict";
exports.__esModule = true;
var abf = require("/Users/spencersharp/Documents/Coding/BBGM/BBGM-Multiplayer-Discord-Bot/leaguefiles/Small/export.json");
var fs = require("fs");
var Player = /** @class */ (function () {
    function Player(name, tid) {
        this.name = name;
        this.tid = tid;
    }
    return Player;
}());
;
var Team = /** @class */ (function () {
    function Team(name, tid) {
        this.name = name;
        this.tid = tid;
    }
    return Team;
}());
var Roster = /** @class */ (function () {
    function Roster(name, players) {
        this.name = name;
        this.players = players;
    }
    return Roster;
}());
var val;
var iter = Object.values(abf.players).entries();
var players = [];
while ((val = iter.next().value) != undefined) {
    var fields = val[1];
    var name_1 = fields.firstName + " " + fields.lastName;
    var tid = fields.tid;
    var player = new Player(name_1, tid);
    players.push(player);
}
var teams = [];
var team;
var teamiter = Object.values(abf.teams).entries();
while ((val = teamiter.next().value) != undefined) {
    var tid = val[1].tid;
    var name_2 = val[1].name;
    var team_1 = new Team(name_2, tid);
    teams.push(team_1);
}
var rosters = [];
var by_team = teams.map(function (team) { return players.map(function (player) { return player.tid == team.tid ? player.name + "\n" : ""; }).reduce(function (prev, player) { return prev + player; }); });
teams.forEach(function (team, index) {
    var roster = new Roster(team.name, by_team[index]);
    rosters.push(roster);
});
console.log(rosters);
fs.writeFile("./rosters.json", JSON.stringify(rosters), function (err) {
    if (err) {
        console.error(err);
        return;
    }
    ;
    console.log("File has been created");
});
/*
let team = { tid: 0 }
let player_to_name = player => player.firstName + " " + player.lastName
let does_match_team = Object.values(abf.players).map(player => (player.tid == team.tid ? player_to_name(player): ""))
let get_players_from_condition = (acc: string, guy: string) => (guy == "" ? acc : acc + "\n" + guy)
let players_with_team = team => does_match_team.reduce(get_players_from_condition)
let teams_with_players = Object.values(abf.teams).map(players_with_team)
let team_names_with_player_names = team => team.region + " wacko"
console.log(teams_with_players)*/
//console.log(eval('Object.values(abf.teams).map(team => console.log(team.region + " " + team.name) ? 0 : (Object.values(abf.players).map(player => player.tid == team.tid ? console.log(player.firstName + " " + player.lastName) ? true : true : false).reduce((acc, guy) => acc || guy)) ? console.log('-------------------'): 0)'))
