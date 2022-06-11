<template>
<div class="container">
  <div class="row">
    <div class="col-4">
      <controller
        :locations="Locations"
        :IntvForm="IntvForm"
        v-on:setting_update="updateSettings($event)"
        v-on:intv_update="updateInterventions($event)"
        v-on:intv_reset="resetInterventions($event)"
        v-on:intv_revert="stayInterventions($event)"
      ></controller>
    </div>
    <div class="col-8">
      <div class="row">
        <b-card no-body>
          <b-tabs card>
            <b-tab title="Incidence" active>
              <b-card-text>
                <div class="figure-slot">
                  <h4>Key figure 1: Incidence</h4>
                  <p>X-axis: Year</p>
                  <p>Y-axis: Annual rate per 100 000</p>
                </div>
              </b-card-text>
            </b-tab>
            <b-tab title="Mortality">
              <b-card-text>
                <div class="figure-slot">
                  <h4>Key figure 2: mortality</h4>
                  <p>X-axis: Year</p>
                  <p>Y-axis: Annual rate per 100 000</p>
                </div>
              </b-card-text>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
      <div class="row">
        <div class="col-12">
          <h4>Midstream variables</h4>
          <inter-index :Cascade="CascadeLive"></inter-index>
        </div>
      </div>
    </div>

<!--    <div class="col-8">-->
<!--      <div class="row">-->
<!--        -->

<!--&lt;!&ndash;        <div class="col-4">&ndash;&gt;-->
<!--&lt;!&ndash;          <h4>Cascade baseline</h4>&ndash;&gt;-->
<!--&lt;!&ndash;          <inter-index :Cascade="Cascade0"></inter-index>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="col-6">&ndash;&gt;-->
<!--&lt;!&ndash;          <h4>Cascade current</h4>&ndash;&gt;-->
<!--&lt;!&ndash;          <inter-index :Cascade="CascadeIntv"></inter-index>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->

<!--&lt;!&ndash;        <div class="col-6">&ndash;&gt;-->
<!--&lt;!&ndash;          <h4>Input: simulation settings</h4>&ndash;&gt;-->
<!--&lt;!&ndash;          <p>{{ JSON.stringify(Settings, null, 5) }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="col-6">&ndash;&gt;-->
<!--&lt;!&ndash;          <h4>Input: interventions live</h4>&ndash;&gt;-->
<!--&lt;!&ndash;          <p>{{ JSON.stringify(IntvLive, null, 5) }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->

<!--      </div>-->
<!--    </div>-->
  </div>
</div>
</template>

<script>
import Controller from "../components/Controller.vue";
import InterIndex from "../components/InterIndex.vue";
import loc from "../lists/locations.json";
import pars_all from "../ppa/pars_cascade_wr.json"
import { summarise_cascade } from "../ppa/cascade";
import intvs from "../lists/interventions";



export default {
  name: "Preview",
  components: {
    Controller,
    InterIndex
  },
  data() {
    const settings = { Location: { Location: "India", Region: "India" }, "YearEnd": 2025 }
    const sel_p = pars_all[settings.Location.Location]

    const i0 = JSON.stringify(intvs)
    return {
      Settings: settings,
      Interventions: ["Interventions"],
      Locations: loc,
      ParsAll: pars_all,
      SelLoc: settings.Location,
      SelPars: sel_p,
      IntvForm: intvs,
      IntvLive: {},
      Intv0: i0,
      IntvCurr: i0,
      CascadeLive: summarise_cascade(sel_p)
    }
  },
  watch: {
    IntvForm: {
      handler(val) {
        this.IntvLive = val
            .filter(d => d.Clicked)
            .reduce((prev, d) => {
              prev[d.Name] = d.Pars
                  .reduce((collector, x) => {collector[x.name] = +x.value; return collector}, {});
              return prev;
            }, {});
        this.CascadeLive = summarise_cascade(this.SelPars.map(p => this.updatePars(p, this.IntvLive)));
      },
      deep: true
    }
  },
  computed: {
    CascadeIntv() {
      const intv = JSON.parse(this.IntvCurr).filter(d => d.Clicked)
          .reduce((prev, d) => {
            prev[d.Name] = d.Pars
                .reduce((collector, x) => {collector[x.name] = +x.value; return collector}, {});
            return prev;
          }, {});

      return summarise_cascade(this.SelPars.map(p => this.updatePars(p, intv)));
    },
    Cascade0() {
      return summarise_cascade(this.SelPars);
    }
  },
  methods: {
    updateSettings(evt) {
      this.Settings = evt;
      this.SelLoc = this.Settings.Location;
      this.SelPars = this.ParsAll[this.Settings.Location.Location].filter((p, i) => i < 10);

      if (this.Settings.Location.IntvCurr !== undefined) {
        this.IntvCurr = this.Settings.Location.IntvCurr;
        this.IntvForm = JSON.parse(this.IntvCurr);
      } else {
        this.resetInterventions()
      }
    },
    updateInterventions(evt) {
      this.IntvCurr = JSON.stringify(this.IntvForm);
      this.Settings.Location.IntvCurr = this.IntvCurr;
      //simulate
    },
    resetInterventions() {
      this.IntvForm = JSON.parse(this.Intv0);
      this.IntvCurr = this.Intv0
    },
    stayInterventions() {
      this.IntvForm = JSON.parse(this.IntvCurr);
    },
    updatePars(pars, intv) {
      const pars_new = Object.assign({}, pars)

      if (intv.CS !== undefined) {
        const rr = (1 + intv.CS.Scale)
        pars_new.R_CSI = pars.R_CSI * rr;
        pars_new.R_ReCSI = pars.R_ReCSI * rr;
        pars_new.R_Aware = pars.R_Aware * rr;
      }
      if (intv.PPM !== undefined) {
        let pr = intv.PPM.Scale;
        pars_new.P_Entry = [pars.P_Entry[0], pars.P_Entry[1] + pars.P_Entry[2] * pr, pars.P_Entry[2] * (1 - pr)]

        pars_new.P_Tr = [
          [pars.P_Tr[0][0], pars.P_Tr[0][1] + pars.P_Tr[0][2] * pr, pars.P_Tr[0][2] * (1 - pr)],
          [pars.P_Tr[1][0], pars.P_Tr[1][1] + pars.P_Tr[1][2] * pr, pars.P_Tr[1][2] * (1 - pr)],
          [pars.P_Tr[2][0], pars.P_Tr[2][1] + pars.P_Tr[2][2] * pr, pars.P_Tr[2][2] * (1 - pr)]
        ]
      }

      if (intv.ImpDx !== undefined) {
        let pr = 1 - intv.ImpDx.Dx;
        pars_new.P_Dx0 = [1 - pr * (1 - pars.P_Dx0[0]), 1 - pr * (1 - pars.P_Dx0[1]), pars.P_Dx0[2]]

        pars_new.P_Dx1 = [
          [1 - pr * (1 - pars.P_Dx1[0][0]), 1 - pr * (1 - pars.P_Dx1[0][1]), pars.P_Dx1[0][2]],
          [1 - pr * (1 - pars.P_Dx1[1][0]), 1 - pr * (1 - pars.P_Dx1[1][1]), pars.P_Dx1[1][2]],
          [1 - pr * (1 - pars.P_Dx1[2][0]), 1 - pr * (1 - pars.P_Dx1[2][1]), pars.P_Dx1[2][2]]
        ]
      }
      return pars_new;
    }
  }
}
</script>

<style scoped>
.figure-slot {
  background-color: lavender;
  border-style: solid;
  aspect-ratio: 2;
  padding: 5px;
}
</style>