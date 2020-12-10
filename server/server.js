const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');



const elo = require('./elo')
elo.loadDataSync()

const app = express()
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())



const port = require('./serverconfig.json').port


app.get('/api/players', (req, res) => {
    res.send(JSON.stringify(elo.getPlayersData()))
})

app.get('/api/players/:id', (req, res) => {
    res.send(JSON.stringify(elo.getPlayerData(req.params.id)))
})

app.post('/api/players', (req, res) => {
    let player = elo.addPlayer(req.body.name)
    if(player != null){
    res.set('Location', '/api/players/' + player.id).sendStatus(201)
    }
    else{
        res.sendStatus(409)
    }
})

app.get('/api/games', (req, res) => {
    res.send(JSON.stringify(elo.getGames()))
})

app.post('/api/games', (req, res) => {
    elo.addGame(req.body.facists, req.body.liberals, req.body.hitler, req.body.facistsWon, req.body.shotPlayers)
    res.sendStatus(200)
})

app.get('/api/games/:time', (req, res) => {
    res.send(JSON.stringify(elo.getGames().find(p => p.time == req.params.time)))
})

app.get('/api', (req, res) => {
    res.send("HitlerElo API Server")
})

app.listen(port)
