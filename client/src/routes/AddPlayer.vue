<template>
  <div>
    <h1>LISÄÄ PELAAJA</h1>

    <b-form-input
      v-model="name"
      variant="danger"
      placeholder="Pelaajan nimi"
      id="namebar"
    ></b-form-input>

    <b-button
      id="add-name-button"
      :disabled="name == ''"
      @click="submit()"
    >
      Lisää</b-button>
  </div>
</template>

<script>
import axios from "axios";
const baseUrl = process.env.VUE_APP_API_URL;

export default {
  name: "AddPlayer",
  data() {
    return {
      name: "",
    };
  },
  methods: {
    submit() {
      axios
        .post(baseUrl + "api/players", {
          name: this.name,
        })
        .then((response) => {
          this.name = "";
        });
    },
  },
};
</script>

<style scoped>
#namebar {
  margin-top: 30px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

#add-name-button {
  margin-top: 20px;
  width: 90%;
}

.form-control:focus {
  border-color: #bbbbbb;
  outline: none;
  -webkit-box-shadow: none !important;
  -moz-box-shadow: none !important;
  box-shadow: none !important;
}
</style>