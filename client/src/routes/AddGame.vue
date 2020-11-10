<template>
  <div>
    <h1>LISÄÄ PELI</h1>

    <div class="team shadow">
      <div class="text-left d-flex">
        <h5 class="mr-auto teamname">LIBERAALIT</h5>
        <b-icon
          icon="trophy-fill"
          style="
            color: #434343;
            position: relative;
            top: 4px;
            margin-right: 3px;
          "
        ></b-icon>
        <b-form-radio
          v-model="winner"
          name="win-radio"
          value="L"
        ></b-form-radio>
      </div>
      <hr style="margin-bottom: 0px" />
      <b-list-group class="list-group-flush">
        <b-list-group-item
          class="d-flex align-items-center playerlisting"
          v-for="liberal in liberals"
          :key="liberal.id"
        >
          <div class="mr-auto d-flex">
            <h6>{{ liberal.name }}</h6>
            <b-icon
              icon="x"
              style="width: 20px; height: 20px; margin-left: 5px; cursor: pointer;"
              @click="removePlayer(liberal)"
            ></b-icon>
          </div>
          <b-img
            src="../assets/bullet.png"
            style="height: 20px; width: 20px"
          />

          <input
            type="checkbox"
            class="check-input"
            v-model="shot[liberal.id]"
            id="defaultCheck1"
          />
        </b-list-group-item>

        <b-list-group-item class="add-player-listing">
          <b-dropdown
            text="Lisää pelaaja"
            class="add-player-button"
            :disabled="players.length == 0"
          >
            <b-dropdown-item
              v-for="player in players"
              :key="player.key"
              @click="addToTeam(player, 'liberals')"
            >
              {{ player.name }}
            </b-dropdown-item>
          </b-dropdown>
        </b-list-group-item>
      </b-list-group>
    </div>

    <div class="team shadow">
      <div class="text-left d-flex">
        <h5 class="mr-auto teamname">FASISTIT</h5>
        <b-icon
          icon="trophy-fill"
          style="
            color: #434343;
            position: relative;
            top: 4px;
            margin-right: 3px;
          "
        ></b-icon>
        <b-form-radio
          v-model="winner"
          name="win-radio"
          value="F"
        ></b-form-radio>
      </div>
      <hr style="margin-bottom: 0px" />
      <b-list-group class="list-group-flush">
        <b-list-group-item
          class="d-flex align-items-center playerlisting"
          v-for="facist in facists"
          :key="facist.id"
        >
          <div class="mr-auto d-flex">
            <h6>{{ facist.name }}</h6>
            <b-icon
              icon="x"
              style="width: 20px; height: 20px; margin-left: 5px; cursor: pointer;"
              @click="removePlayer(facist)"
            ></b-icon>
          </div>

          <b-img
            src="../assets/hitler.png"
            style="height: 20px; width: 20px"
          />
          <b-form-radio
            v-model="hitler"
            name="hitler-radio"
            :value="facist.id"
          ></b-form-radio>

          <b-img
            src="../assets/bullet.png"
            style="height: 20px; width: 20px"
          />

          <input
            type="checkbox"
            class="check-input"
            v-model="shot[facist.id]"
            id="defaultCheck1"
          />
        </b-list-group-item>

        <b-list-group-item class="add-player-listing">
          <b-dropdown
            text="Lisää pelaaja"
            class="add-player-button"
            :disabled="players.length == 0"
          >
            <b-dropdown-item
              v-for="player in players"
              :key="player.key"
              @click="addToTeam(player, 'facists')"
            >
              {{ player.name }}
            </b-dropdown-item>
          </b-dropdown>
        </b-list-group-item>
      </b-list-group>
    </div>

    <b-button
      id="add-game-button"
      :disabled="!canSubmit()"
      @click="submit()"
    >Lisää peli</b-button>
  </div>
</template>

<script>
import axios from "axios";

const baseUrl = process.env.VUE_APP_API_URL;

export default {
  name: "AddGame",
  data() {
    return {
      liberals: [],
      facists: [],
      hitler: "",
      shot: {},
      players: [],
      winner: "L",
    };
  },
  methods: {
    addToTeam(player, team) {
      if (team == "liberals") {
        this.liberals.push(player);
      } else {
        this.facists.push(player);
      }
      let i = this.players.indexOf(player);
      this.players.splice(i, 1);
      this.shot[player.id] = false;
    },

    canSubmit() {
      return (
        this.liberals.length != 0 &&
        this.facists.length != 0 &&
        this.hitler != "" &&
        this.winner != ""
      );
    },

    removePlayer(player) {
      this.liberals = this.liberals.filter((p) => p != player);
      this.facists = this.facists.filter((p) => p != player);
      this.hitler = this.hitler == player.id ? "" : this.hitler;
      this.shot[player.id] = false;
      this.players.push(player);
    },

    submit() {
      axios
        .post(baseUrl + "api/games", {
          facists: this.facists.map((f) => f.id),
          liberals: this.liberals.map((l) => l.id),
          hitler: this.hitler,
          facistsWon: this.winner == "F",
          shotPlayers: Object.keys(this.shot).filter((id) => this.shot[id]),
        })
        .then((response) => {
          this.liberals = [];
          this.facists = [];
          this.hitler = "";
          this.shot = {};
          this.winner = "L";

          axios.get(baseUrl + "api/players").then((res) => {
            this.players = res.data.sort((a, b) => (a.name < b.name ? -1 : 1));
          });
        });
    },
  },

  mounted() {
    axios.get(baseUrl + "api/players").then((res) => {
      this.players = res.data.sort((a, b) => (a.name < b.name ? -1 : 1));
    });
  },
};
</script>

<style scoped>
.team {
  width: 90%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 30px;

  background-color: #f7e2c1;
  border-radius: 10px;
  padding-top: 20px;
  padding-bottom: 0px;
}

#hitlerCheck {
  margin-right: 20px;
}

.add-player-button {
  height: 100%;
  width: 100%;
  margin: 0px;
}

.add-player-listing {
  background-color: #636363;
  padding: 0px;
  border-radius: 0px 0px 10px 10px;
}

#add-game-button {
  width: 90%;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
}

.playerlisting {
  background-color: #f7e2c1;
}

.teamname {
  padding-left: 10px;
}
</style>