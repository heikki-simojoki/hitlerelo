<template>
  <div>
    <h1>PELIT</h1>
    <Game
      v-for="game in games"
      :key="game.time"
      :game="game"
      class="game"
    />
  </div>
</template>




<script>
import axios from "axios";
const baseUrl = process.env.VUE_APP_API_URL;

import Game from "../components/Game.vue";

export default {
  name: "Games",
  components: {
    Game,
  },
  data() {
    return {
      games: [],
    };
  },

  mounted() {
    axios.get(baseUrl + "api/games").then((response) => {
      this.games = response.data.sort((a, b) => b.time - a.time);
    });
  },
};
</script>

<style scoped>
</style>