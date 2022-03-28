<template>
<div class="container">
  <div class="row">
    <div class="col-4">
      <controller
        v-on:setting_update="updateSettings($event)"
        v-on:intv_update="updateInterventions($event)"
      ></controller>
    </div>
    <div class="col-8">
      <div class="row">
        <div class="col-6 figure-slot">
          <h4>Key figure 1: incidence</h4>
          <p>X-axis: Year</p>
          <p>Y-axis: Annual rate per 100 000</p>
        </div>

        <div class="col-6 figure-slot">
          <h4>Key figure 2: mortality</h4>
          <p>X-axis: Year</p>
          <p>Y-axis: Annual rate per 100 000</p>
        </div>

        <div class="col-6">
          <h4>Input: simulation settings</h4>
          <p>{{ JSON.stringify(Settings, null, 5) }}</p>
        </div>
        <div class="col-6">
          <h4>Input: interventions</h4>
          <p>{{ JSON.stringify(Interventions, null, 5) }}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Controller from "../components/Controller.vue";


export default {
  name: "Preview",
  components: {
    Controller
  },
  data() {
    return {
      Settings: ["Settings"],
      Interventions: ["Interventions"]
    }
  },
  methods: {
    updateSettings(evt) {
      this.Settings = evt;
    },
    updateInterventions(evt) {
      this.Interventions = evt
    }
  }
}
</script>

<style scoped>
.figure-slot {
  background-color: lavender;
  border-style: solid;
  aspect-ratio: 1.25;
  padding: 5px;
}
</style>