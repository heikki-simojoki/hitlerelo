<template>
  <div>
    <h1>PELIT</h1>
    <Game
      v-for="(game, index) in games"
      :key="game.time"
      :game="game"
      class="game"
      :first="index == 0"
      @remove-game="removeGame"
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
      this.games = response.data;
      this.games.sort((a, b) => b.time - a.time);
    });
  },

  methods: {
    removeGame(){

      this.modalResult = ''
      this.$bvModal.msgBoxConfirm('Poistetaanko peli?', {
          title: 'Vahvistus',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Kyllä',
          cancelTitle: 'Ei',
          footerClass: 'p-2',
          hideHeaderClose: true,
          centered: true
        })
          .then(value => {
            if(value){
              axios.delete(baseUrl + "api/games").then((response) => {
                  axios.get(baseUrl + "api/games").then((response) => {
                  this.games = response.data;
                  this.games.sort((a, b) => b.time - a.time);
                 });
              })
            }
          })
          
    }
  }
};
</script>

<style scoped>
.modal-header .close {
  display:none;
}
</style>