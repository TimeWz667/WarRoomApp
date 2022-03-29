<template>
  <div>
    <form id="location">
      <h4>Settings</h4>
      <div class="form-group">
        <div class="form-floating mb-12 mt-12">
          <select class="form-select" id="loc_sel" name="sel1" v-model="SelLoc">
            <option :value="loc" v-for="loc in Locations">{{ loc }}</option>
          </select>
          <label for="sel1" class="form-label">{{ `Location: (current=${CurLoc})`}}</label>
        </div>
      </div>

      <div class="form-group">
        <label for="year1"><h5>Proejction end:&nbsp;</h5></label>
        <div class="form-check form-check-inline">
          <input type="radio" class="form-check-input" name="year1" value="2025" v-model="YearEnd" checked>2025
        </div>
        <div class="form-check form-check-inline">
          <input type="radio" class="form-check-input" name="year1" value="2030" v-model="YearEnd">2030
        </div>
      </div>

      <button type="submit" class="btn btn-block btn-primary" v-on:click="updateSettings">Update</button>
    </form>
    <form id="intv">
      <h4>Interventions</h4>

      <div class="action" v-for="intv in IntvForm">
        <div class="form-switch">
          <input class="form-check-input" role="switch" type="checkbox" id="include" v-model="intv.Clicked">
          <label class="form-check-label" for="include"><h5>{{ `&nbsp;${intv.Desc}` }}</h5></label>
        </div>

        <div class="input-group" v-for="par in intv.Pars">
            <label :for="par.name">{{par.label + " " + Math.round(par.value * 100) + "%"}}</label>
            <input class="form-control" :id="par.name" :name="par.name" type="range" :min="par.min" :max="par.max" step="0.01"
                   v-model="par.value">
        </div>

      </div>

      <button type="submit" class="btn btn-primary" v-on:click="updateIntv">Update</button>
      <button type="submit" class="btn btn-warning" v-on:click="resetIntv">Reset</button>

    </form>
  </div>
</template>

<script>
import intvs from "../lists/interventions";

export default {
  name: "Controller",
  data: function() {

    return {
      Locations: ['India', 'North', 'East', 'West', 'South'],
      SelLoc: 'India',
      CurLoc: 'India',
      YearEnd: 2025,
      Intv0: JSON.stringify(intvs),
      IntvForm: intvs
    }
  },
  methods: {
    updateSettings: function(evt) {
      evt.preventDefault()
      this.CurLoc = this.SelLoc;

      const res = {Location: this.CurLoc, YearEnd: +this.YearEnd}

      this.$emit("setting_update", res)
    },
    updateIntv(evt) {
      evt.preventDefault();

      const res = this.IntvForm
          .filter(d => d.Clicked)
          .reduce((prev, d) => {
            prev[d.Name] = d.Pars
                .reduce((collector, x) => {collector[x.name] = x.value; return collector}, {});
            return prev;
          }, {})

      this.$emit("intv_update", res)
    },
    resetIntv(evt) {
      evt.preventDefault();
      this.IntvForm = JSON.parse(this.Intv0);
      this.updateIntv(evt)
    }
  }
}
</script>

<style scoped>
#location {
  border-radius: 10pt;
  border-style: solid;
  padding: 30px;
}

#intv {
  border-radius: 10pt;
  border-style: solid;
  padding: 30px;
}

.form-group {
  padding: 10px;
}

</style>