<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data() {
    return {
      defaultOptions: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            ticks: {
              display: false
            }
          }]
        },
        layout: {
          padding: {
            right: 10
          }
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            label: function(tooltipItem, data) {
              let labelText = data.datasets[tooltipItem.datasetIndex].label 
              let eloAmt = tooltipItem.yLabel

              return labelText + ": " + Math.round(eloAmt)

            }
          }
        }
    }
    }
  },
  props: {
    games: {
      type: Array,
    },
    playerID: {
      type: String,
    }
  },

  watch: {
    playerID(){
      this.renderChart(this.computeData(), {...this.defaultOptions, ...this.options})
    },
    games(){
      this.renderChart(this.computeData(), {...this.defaultOptions, ...this.options})
    }
  },


  mounted () {
    this.renderChart(this.computeData(), {...this.defaultOptions, ...this.options})
  },

  methods: {

    computeData(){
      let filteredGames = this.games.filter(g => g.liberals.some(p => p.id == this.playerID) || g.facists.some(p => p.id == this.playerID))

      filteredGames.sort((a, b) =>  a.time - b.time);

      let labels = filteredGames.map(g => this.getDateString(g.time))
      labels.unshift("Luotu")

      let playerHistory = filteredGames.map(g => g.facists.concat(g.liberals).find(p => p.id == this.playerID))

      let eloData = playerHistory.map(p => p.elo)

      let lastPlayerHistory = playerHistory[playerHistory.length - 1]
      eloData.push(lastPlayerHistory.elo + lastPlayerHistory.eloChange)


      return {
        labels: labels,
        datasets: [{
          label: "ELO",
          data: eloData,
          fill: false,
          lineTension: 0.1,
          borderColor: '#434343',
          backgroundColor: '#434343FF',
          pointRadius: 5
        }]
      }
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
    }
  }
}

</script>