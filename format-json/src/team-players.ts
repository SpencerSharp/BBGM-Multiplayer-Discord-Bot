import * as abf from "/Users/spencersharp/Documents/Coding/BBGM/BBGM-Multiplayer-Discord-Bot/leaguefiles/Small/export.json";
import * as fs from "fs";

class Player {
	name: string;
	tid: number;
	constructor(name: string, tid: number) {
		this.name = name;
		this.tid = tid;
	}
};

class Team {
	name: string;
	tid: number;
	constructor(name: string, tid: number) {
		this.name = name;
		this.tid = tid;
	}
}

class Roster {
	name: string;
	players: string;
	constructor(name: string, players: string) {
		this.name = name;
		this.players = players;
	}
}

let val;
let iter = Object.values(abf.players).entries();
let players : Player[] = []
while((val = iter.next().value)!=undefined) {
	const fields = val[1]
	const name = fields.firstName + " " + fields.lastName
	const tid = fields.tid
	const player = new Player(name, tid)
	players.push(player)
}

let teams : Team[] = []
let team;
let teamiter = Object.values(abf.teams).entries();
while((val = teamiter.next().value)!=undefined) {
	const tid = val[1].tid
	const name = val[1].name
	const team = new Team(name, tid)
	teams.push(team)
}

let rosters : Roster[] = []
const by_team = teams.map(team => players.map(player => player.tid == team.tid ? player.name + "\n" : "").reduce((prev,player) => prev + player))


teams.forEach(function (team, index) {
	const roster = new Roster(team.name, by_team[index]);
	rosters.push(roster);
});
console.log(rosters)

fs.writeFile("./rosters.json", JSON.stringify(rosters), (err) => {
    if (err) {
        console.error(err);
        return;
    };
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