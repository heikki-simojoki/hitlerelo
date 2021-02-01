
const fs = require('fs')

var players = []
var games = []

const dataFile = require('./serverconfig.json').datafile



function writeToFile() {
    fs.writeFile(dataFile, JSON.stringify({ players, games }), e => { })
}

function loadDataSync() {
    let data = JSON.parse(fs.readFileSync(dataFile))

    players = data.players
    games = data.games

}


function genID() {
    return Math.random().toString(36).substr(2, 9)
}

function addPlayer(name) {
    if (players.some(p => p.name == name)) return null

    let player = {
        name,
        id: genID(),
        elo: 1000
    }

    players.push(player)
    writeToFile()
    return player
}

function getPlayers() {
    return players
}


function getPlayersData() {
    return players.map(player => getPlayerData(player.id))
}

function getPlayerData(id) {
    let player = getPlayers().find(p => p.id == id)
    if (player == null) return null

    var liberalGames = 0
    var facistGames = 0
    var totalGames = 0

    var liberalWins = 0
    var facistWins = 0
    var totalWins = 0

    var hitlerGames = 0
    var hitlerWins = 0

    var shotAsFacist = 0
    var shotAsHitler = 0
    var shotAsLiberal = 0
    var timesShot = 0

    var maxElo = player.elo
    var minElo = player.elo

    for (var i = 0; i < games.length; i++) {
        let game = games[i]

        let isLiberal = game.liberals.some(p => p.id == player.id)
        let isFacist = game.facists.some(p => p.id == player.id)
        let isHitler = game.hitler.id == player.id
        let wasShot = game.shot.some(p => p.id == player.id)
        let won = (game.facistsWon && isFacist) || (!game.facistsWon && isLiberal)

        if (!isLiberal && !isFacist) continue;
        
        

        if (isLiberal) liberalGames++
        if (isFacist) facistGames++
        if (isHitler) hitlerGames++

        totalGames++

        if (won && isFacist) facistWins++
        if (won && isHitler) hitlerWins++
        if (won && isLiberal) liberalWins++

        if (won) totalWins++

        if (wasShot && isFacist) shotAsFacist++
        if (wasShot && isLiberal) shotAsLiberal++
        if (wasShot && shotAsHitler) shotAsHitler++
        if (wasShot) timesShot++


        let oldElo = (isLiberal ? game.liberals : game.facists).find(p => p.id == player.id).elo

        if(oldElo < minElo) minElo = oldElo
        if(oldElo > maxElo) maxElo = oldElo

    }

    return {
        ...player,
        liberalGames,
        facistGames,
        totalGames,

        liberalWins,
        facistWins,
        totalWins,

        hitlerGames,
        hitlerWins,

        shotAsLiberal,
        shotAsFacist,
        shotAsHitler,
        timesShot,

        maxElo,
        minElo
    }

}


function calculateNewElo(player, facists, liberals, hitler, facistsWon, shotPlayers) {
    let fElo = facists.map(f => f.elo).reduce((a, b) => a + b, 0) / facists.length
    let lElo = liberals.map(l => l.elo).reduce((a, b) => a + b, 0) / liberals.length

    let isFacist = facists.some(p => p.id == player.id)
    let won = isFacist == facistsWon

    let playerAmount = facists.length + liberals.length

    const k = playerAmount * 20


    let opponentElo = isFacist ? lElo : fElo
    let ownElo = isFacist ? fElo : lElo

    var opponentRating = Math.pow(10, opponentElo / 400)
    var ownRating = Math.pow(10, ownElo / 400)


    ownRating = ownRating / (opponentRating + ownRating)

    let s = won ? 1 : 0




    let eloChange = k * (s - ownRating)

    var ownTeamElos = isFacist ? facists : liberals
    ownTeamElos = ownTeamElos.map(p => p.elo)


    let ownTeamTotalElo = ownTeamElos.reduce((t, e) => t + e, 0)


    if (won) {
        let ownReversedEloPercentage = 1.0 - (player.elo / ownTeamTotalElo)

        if (ownReversedEloPercentage != 0) {
            return (ownReversedEloPercentage / (ownTeamElos.length - 1)) * eloChange + player.elo
        }
        else return player.elo + eloChange
    } else {
        return (player.elo / ownTeamTotalElo) * eloChange + player.elo
    }


}


function addGame(facists, liberals, hitler, facistsWon, shotPlayers) {

    let oldFacists = facists.map(f => players.find(p => p.id == f)).map(f => Object.assign({}, f))
    let oldLiberals = liberals.map(l => players.find(p => p.id == l)).map(l => Object.assign({}, l))

    let oldHitler = oldFacists.find(p => p.id == hitler)

    let oldShotPlayers = shotPlayers.map(s => oldFacists.concat(oldLiberals).find(p => p.id == s))



    let newElos = {}

    facists.concat(liberals).forEach(f => {
        var player = players.find(p => p.id == f)
        newElos[player.id] = calculateNewElo(player, oldFacists, oldLiberals, oldHitler, facistsWon, oldShotPlayers)
    })

    for (id in newElos) {
        var player = players.find(p => p.id == id)
        player.elo = newElos[id]

        oldPlayer = oldFacists.concat(oldLiberals).find(p => p.id == id)

        oldPlayer.eloChange = player.elo - oldPlayer.elo

    }


    let game = {
        time: Date.now(),
        facists: oldFacists,
        liberals: oldLiberals,
        hitler: oldHitler,
        facistsWon,
        shot: oldShotPlayers
    }


    games.push(game)

    writeToFile()
}

function removeLastGame(){
    if(games.length == 0) return

    let lastGame = games.pop()

    lastGame.facists.concat(lastGame.liberals).forEach(player => {
        players.find(p => p.id == player.id).elo -= player.eloChange
    })

    writeToFile()
}

function getGames() {
    return games
}

module.exports = { addPlayer, getPlayers, getPlayersData, addGame, getGames, getPlayerData, loadDataSync, removeLastGame }