<template>
  <div id="app">
    <router-view />
    <nav class="navbar fixed-bottom navbar-light">

      <b-nav-item
        class="navbar-brand"
        to="/players"
      >
        <b-icon
          icon="people-fill"
          :style="'color:' + ($route.name == 'players' ? '#ffffff' : '#767676')"
        ></b-icon>
      </b-nav-item>

      <b-nav-item
        class="navbar-brand"
        to="/games"
      >
        <b-icon
          icon="card-list"
          :style="'color:' + ($route.name == 'games' ? '#ffffff' : '#767676')"
        ></b-icon>
      </b-nav-item>

      <b-nav-item
        class="navbar-brand"
        to="/addplayer"
      >
        <b-icon
          icon="person-plus-fill"
          :style="
            'color:' + ($route.name == 'addplayer' ? '#ffffff' : '#767676')
          "
        ></b-icon>
      </b-nav-item>

      <b-nav-item
        class="navbar-brand"
        to="/addgame"
      >
        <b-icon
          icon="plus-square-fill"
          :style="'color:' + ($route.name == 'addgame' ? '#ffffff' : '#767676')"
        ></b-icon>
      </b-nav-item>

    </nav>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Courier+Prime:wght@700&display=swap");

#app {
  font-family: "Courier Prime", Courier, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
  height: 100%;
  padding-bottom: 100px;
}

.sitebody {
  background-color: #fbb969;
  color: #434343;
}

.navbar {
  background-color: #434343;
}
</style>
