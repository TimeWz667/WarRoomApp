<template>
  <div>
    <div id="my-accordion" class="accordion" role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1 d-grid gap-2" role="tab">
          <b-button v-b-toggle.accordion-1 variant="dark">{{CurLoc.Location}}</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <form id="location">
              <div class="form-group">
                <div class="form-floating mb-12 mt-12">
                  <select class="form-select" id="loc_sel" name="sel1" v-model="SelLoc">
                    <option :value="loc" v-for="loc in locations">{{ loc.Location }}</option>
                  </select>
                  <label for="sel1" class="form-label">{{ `Location: (current=${CurLoc.Location})`}}</label>
                </div>
              </div>

<!--              <div class="form-group">-->
<!--                <label for="year1"><h5>Projection end:&nbsp;</h5></label>-->
<!--                <div class="form-check form-check-inline">-->
<!--                  <input type="radio" class="form-check-input" name="year1" value="2025" v-model="YearEnd" checked>2025-->
<!--                </div>-->
<!--                <div class="form-check form-check-inline">-->
<!--                  <input type="radio" class="form-check-input" name="year1" value="2030" v-model="YearEnd">2030-->
<!--                </div>-->
<!--              </div>-->

              <button type="submit" class="btn btn-block btn-primary" v-on:click="updateSettings">Update</button>
            </form>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1  d-grid gap-2" role="tab">
          <b-button v-b-toggle.accordion-2 variant="dark">Interventions</b-button>
        </b-card-header>
        <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <form id="intv">
              <div class="action" v-for="intv in IntvForm">
                <div class="form-switch">
                  <input class="form-check-input" role="switch" type="checkbox" id="include" v-model="intv.Clicked">
                  <label class="form-check-label" for="include"><h5>{{ `&nbsp;${intv.Desc}` }}</h5></label>
                </div>

                <div class="from-group" v-for="par in intv.Pars">
                  <label :for="par.name" size="sm">{{par.label + " " + Math.round(par.value * 100) + "%"}}</label>
                  <input class="form-control" :id="par.name" :name="par.name" type="range" :min="par.min" :max="par.max" step="0.01"
                         v-model="par.value">
                </div>
              </div>

              <b-button-group style="padding-top: 20pt">
                <button type="submit" class="btn btn-info" v-on:click="revertIntv">Current</button>
                <button type="submit" class="btn btn-primary" v-on:click="updateIntv">Update</button>
                <button type="submit" class="btn btn-warning" v-on:click="resetIntv">Reset</button>
              </b-button-group>

            </form>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Controller",
  props: {
    locations: {
      type: Array,
      required: true
    },
    IntvForm: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      SelLoc: this.locations[0],
      CurLoc: this.locations[0],
      YearEnd: 2025
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
      this.$emit("intv_reset")
    },
    revertIntv(evt) {
      evt.preventDefault();
      this.$emit("intv_revert")
    }
  }
}
</script>

<style scoped>
.form-group {
  padding: 10px;
}

</style>