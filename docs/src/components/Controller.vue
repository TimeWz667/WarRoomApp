<template>
  <div id="ctrl">
    <div id="my-accordion" class="accordion" role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1 d-grid gap-2" role="tab">
          <b-button v-b-toggle.accordion-1 variant="dark"
                    :class="map_visible ? null : 'collapsed'"
                    :aria-expanded="map_visible ? 'true' : 'false'"
                    aria-controls="collapse-4"
                    @click="map_visible = !map_visible"
          >{{CurLoc.Location}}</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <form id="location">
              <div class="form-group">
<!--                <div class="form-floating mb-12 mt-12">-->
<!--                  <select class="form-select" id="loc_sel" name="sel1" v-model="CurLoc">-->
<!--                    <option :value="loc" v-for="loc in locations">{{ loc.Location }}</option>-->
<!--                  </select>-->
<!--                  <label for="sel1" class="form-label">{{ `Location: (current=${CurLoc.Location})`}}</label>-->
<!--                </div>-->
                <ind-map v-on:change-loc="changeLocation" :visible="map_visible" :ava="locations" />
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

<!--              <button type="submit" class="btn btn-block btn-primary" v-on:click="updateSettings">Update</button>-->
            </form>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1  d-grid gap-2" role="tab">
          <b-button v-b-toggle.accordion-2 visible variant="dark">Interventions</b-button>
        </b-card-header>
        <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel" visible>
          <b-card-body>
            <form id="intv">
<!--              <div class="action" v-for="(intv, i) in IntvForm">-->
<!--                <div class="form-switch">-->
<!--                  <input class="form-check-input" role="switch" type="checkbox" :id="i" v-model="intv.Clicked">-->
<!--                  <label class="form-check-label" :for="i"><h5>{{ `&nbsp;${intv.Desc} &#9432;` }}</h5></label>-->
<!--                </div>-->

<!--                <div class="from-group" v-for="par in intv.Pars">-->
<!--                  <label :for="i + par.name" size="sm">{{par.label + " " + Math.round(par.value * 100) + "%"}}</label>-->
<!--                  <input class="form-control" :id="i + par.name" :name="par.name" type="range" :min="par.min" :max="par.max" step="0.01"-->
<!--                         v-model="par.value">-->
<!--                </div>-->
<!--              </div>-->

              <div class="action" v-for="(intv, i) in IntvForm">
                <div class="form-switch">
                  <input class="form-check-input" role="switch" type="checkbox" :id="i" v-model="intv.Clicked">
                  <label class="form-check-label" v-b-toggle="'intv'+i"><p><b>{{ `&nbsp;${intv.Desc} &#9432;` }}</b></p></label>
                </div>

                <b-collapse :id="'intv'+i">
                  <div class="from-group  bg-light" v-for="par in intv.Pars">
                    <label :for="i + par.name" size="sm">{{par.label + " " + Math.round(par.value * 100) + "%"}}</label>
                    <input class="form-control" :id="i + par.name" :name="par.name" type="range" :min="par.min" :max="par.max" step="0.01"
                           v-model="par.value">
                  </div>
                </b-collapse>
              </div>

              <b-button-group style="padding-top: 20pt" class="d-flex">
                <button type="submit" class="btn btn-info" v-on:click="revertIntv">Last</button>
                <button type="submit" class="btn btn-primary" v-on:click="updateIntv">Keep</button>
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
import IndMap from "../pages/CardMap.vue";

export default {
  name: "Controller",
  components: {
    IndMap
  },
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
      // SelLoc: this.locations[0],
      CurLoc: this.locations[0],
      YearEnd: 2025,
      map_visible: false
    }
  },
  watch: {
    CurLoc() {
      const res = {Location: this.CurLoc, YearEnd: +this.YearEnd};
      this.$emit("setting_update", res);
    }
  },
  methods: {
    // updateSettings: function(evt) {
    //   evt.preventDefault()
    //   this.CurLoc = this.SelLoc;
    //
    //   const res = {Location: this.CurLoc, YearEnd: +this.YearEnd}
    //
    //   this.$emit("setting_update", res)
    // },
    changeLocation(e) {
      const i = this.locations.map(l => l.Location).indexOf(e);
      if (i < 0) {
        this.CurLoc = this.locations[0];
      } else {
        this.CurLoc = this.locations[i];
      }
      console.log(this.CurLoc)
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

.action {
  padding-top: 10px;
}

</style>