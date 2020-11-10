import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import VueRouter from 'vue-router'


import App from './App.vue'

import Players from './routes/Players.vue'
import Games from './routes/Games.vue'
import AddPlayer from './routes/AddPlayer.vue'
import AddGame from './routes/AddGame.vue'
import Player from './routes/Player.vue'



Vue.use(VueRouter)

Vue.config.productionTip = false


const routes = [
  { path: '/players/:id', component: Player, name: "player" },
  { path: '/players', component: Players, name: "players" },
  { path: '/games', component: Games, name: "games" },
  { path: '/addplayer', component: AddPlayer, name: "addplayer" },
  { path: '/addgame', component: AddGame, name: "addgame" },
  { path: '*', redirect: '/addgame' }
]

const router = new VueRouter({
  mode: 'history',
  routes
})


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
