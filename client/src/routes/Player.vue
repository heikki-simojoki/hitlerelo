<template>
  <div>
    <div class="playercard shadow">
      <h1> {{player.name}}</h1>
      <hr />
      <b-container>
        <b-row>
          <b-col>
            <div>Pelimäärä: </div>
            <div>{{player.totalGames}}</div>
          </b-col>
          <b-col>
            <div>ELO:</div>
            <div>{{Math.round(player.elo)}}</div>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <div>Ammuttu:</div>
            <div>{{player.timesShot}}</div>
          </b-col>
          <b-col>
            <div>Voittoprosentti:</div>
            <div>{{Math.round(player.totalWins / (player.totalGames != 0 ? player.totalGames : 1) * 100)}}%</div>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <div>Pelit Fasistina:</div>
            <div>{{player.facistGames}}</div>
          </b-col>
          <b-col>
            <div>Voittoprosentti Fasistina:</div>
            <div>{{Math.round(player.facistWins / (player.facistGames != 0 ? player.facistGames : 1) * 100)}}%</div>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <div>Pelit Liberaalina:</div>
            <div>{{player.liberalGames}}</div>
          </b-col>
          <b-col>
            <div>Voittoprosentti Liberaalina:</div>
            <div>{{Math.round(player.liberalWins / (player.liberalGames != 0 ? player.liberalGames : 1) * 100)}}%</div>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <div>Pelit Hitlerinä:</div>
            <div>{{player.hitlerGames}}</div>
          </b-col>
          <b-col>
            <div>Voittoprosentti Hitlerinä:</div>
            <div>{{Math.round(player.hitlerWins / (player.hitlerGames != 0 ? player.hitlerGames : 1) * 100)}}%</div>
          </b-col>
        </b-row>

      </b-container>

    </div>

    <Game
      v-for="game in games"
      :key="game.time"
      :game="game"
      class="game"
    />

  </div>
</template>

<script>
import Game from "../components/Game.vue";

import axios from "axios";
const baseUrl = process.env.VUE_APP_API_URL;

export default {
  name: "Player",
  data() {
    return {
      player: {},
      games: [],
    };
  },
  components: {
    Game,
  },

  methods: {
    setUp(id) {
      let getPlayers = axios.get(baseUrl + "api/players/" + id);
      let getGames = axios.get(baseUrl + "api/games");

      Promise.all([getPlayers, getGames]).then((results) => {
        this.player = results[0].data;
        this.games = results[1].data.filter(
          (g) =>
            g.liberals.some((p) => p.id == this.player.id) ||
            g.facists.some((p) => p.id == this.player.id)
        );
        this.games.sort((a, b) => b.time - a.time);
      });
    },
  },

  watch: {
    "$route.params.id": {
      handler(newValue) {
        this.setUp(newValue);
        window.scrollTo(0, 0);
      },
      immediate: true,
    },
  },

  mounted() {
    this.setUp(this.$route.params.id);
  },
};
</script>

<style scoped>
.playercard {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  line-height: 300%;
  margin-bottom: 50px;
  background-color: #f7e2c1;
  border-radius: 10px;
  padding-top: 20px;
  padding-bottom: 10px;
}
</style>