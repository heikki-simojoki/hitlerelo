<template>
  <div class="gamecard shadow" style="position: relative">
    <h3 class="mr-auto">{{ getDateString(game.time) }}</h3>
    <b-icon
              v-if="first"
              icon="x"
              style="width: 35px; height: 35px; margin-left: 5px; cursor: pointer; position: absolute; top:0; right: 0"
              @click="$emit('remove-game')"
            ></b-icon>
    <hr />
    <div>
      <h4>LIBERAALIT</h4>
      <b-icon
        icon="trophy-fill"
        style="color: #434343"
        v-if="!game.facistsWon"
      ></b-icon>
    </div>
    <b-list-group class="list-group-flush">
      <b-list-group-item
        class="d-flex align-items-center playerlisting"
        v-for="liberal in game.liberals"
        :key="liberal.id"
        :to="'/players/' + liberal.id"
      >
        <h6 class="mr-auto">
          {{ liberal.name }}
          <b-badge
            style="vertical-align: top"
            pill
            :variant="getEloChangeVariant(liberal.eloChange)"
          >{{ getEloChangeString(liberal.eloChange) }}</b-badge>
        </h6>

        <b-img
          v-if="game.shot.some((s) => s.id == liberal.id)"
          src="../assets/bullet.png"
          style="height: 20px; width: 20px"
        />
      </b-list-group-item>

      <hr />
    </b-list-group>

    <h4>FASISTIT</h4>
    <b-icon
      icon="trophy-fill"
      style="color: #434343"
      v-if="game.facistsWon"
    ></b-icon>
    <b-list-group class="list-group-flush">
      <b-list-group-item
        class="d-flex align-items-center playerlisting"
        v-for="facist in game.facists"
        :key="facist.id"
        :to="'/players/' + facist.id"
      >
        <h6 class="mr-auto">
          {{ facist.name }}
          <b-badge
            style="vertical-align: top"
            pill
            :variant="getEloChangeVariant(facist.eloChange)"
          >{{ getEloChangeString(facist.eloChange) }}</b-badge>
        </h6>

        <b-img
          v-if="game.hitler.id == facist.id"
          src="../assets/hitler.png"
          style="height: 20px; width: 20px"
        />

        <b-img
          v-if="game.shot.some((s) => s.id == facist.id)"
          src="../assets/bullet.png"
          style="height: 20px; width: 20px"
        />
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  name: "Game",
  props: {
    game: Object,
    first: Boolean,
  },
  methods: {
    getEloChangeVariant(change) {
      let rounded = Math.round(change);
      if (rounded > 0) return "success";
      else if (rounded == 0) return "secondary";
      else return "danger";
    },
    getEloChangeString(change) {
      let rounded = Math.round(change);
      if (rounded > 0) return "+" + rounded;
      else return rounded;
    },

    getDateString(time) {
      let date = new Date(time);

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      let hours = date.getHours();
      let minutes = date.getMinutes();

      let hoursPadded = hours < 10 ? "0" + hours : hours;
      let minutesPadded = minutes < 10 ? "0" + minutes : minutes;

      let dayPadded = day < 10 ? "0" + day : day;
      let monthPadded = month < 10 ? "0" + month : month;

      return (
        dayPadded +
        "." +
        monthPadded +
        "." +
        year +
        "\t" +
        hoursPadded +
        ":" +
        minutesPadded
      );
    },
  },
};
</script>

<style scoped>
.gamecard {
  width: 90%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 30px;

  background-color: #f7e2c1;
  border-radius: 10px;
  padding-top: 20px;
  padding-bottom: 10px;
}

.playerlisting {
  background-color: #f7e2c1;
}
.playerlisting:hover {
  background-color: #ecd4ae;
}

.teamheader {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>