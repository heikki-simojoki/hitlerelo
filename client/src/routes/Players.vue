<template>
  <div>
    <h1>PELAAJAT</h1>
    <b-list-group class="list-group-flush playerlist shadow">
      <b-list-group-item
        class="d-flex justify-content-between align-items-center playerentry"
        v-for="(player, index) in players"
        :key="player.id"
        :to="'/players/' + player.id"
      >
        <h3>{{index + 1}}. {{player.name}}</h3>
        <h4> {{Math.round(player.elo)}} </h4>

      </b-list-group-item>

    </b-list-group>
  </div>
</template>

<script>
import axios from "axios";

const baseUrl = process.env.VUE_APP_API_URL;

export default {
  name: "Players",
  data() {
    return {
      players: [],
    };
  },
  mounted() {
    axios.get(baseUrl + "api/players").then((res) => {
      this.players = res.data.sort((a, b) => b.elo - a.elo);
    });
  },
};
</script>

<style scoped>
.playerlist {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
}

.playerentry {
  background-color: #f7e2c1;
  color: #434343;
}

.playerentry:hover {
  background-color: #ecd4ae;
}

.badge {
  background-color: #eeeeee;
}
</style>