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
        <h4>Burden projections</h4>
        <b-card class="col-6" title="Incidence">
            <b-card-text id="fig_container">
              <fig-trend chart-id="g_inc" :asp="0.8" :trace_base="TraceInc.Base" :trace_intv="TraceInc.Intv"/>
            </b-card-text>
        </b-card>
        <b-card class="col-6" title="Mortality">
          <b-card-text>
            <fig-trend chart-id="g_mor" :asp="0.8" :trace_base="TraceMor.Base" :trace_intv="TraceMor.Intv"/>
          </b-card-text>
        </b-card>

<!--        <b-card no-body hidden>-->
<!--          <b-tabs card>-->
<!--            <b-tab title="Incidence" active>-->
<!--              <b-card-text id="fig_container">-->
<!--                <fig-trend chart-id="g_inc" :svg_width="fig_width" :trace_base="TraceInc.Base" :trace_intv="TraceInc.Intv"/>-->
<!--              </b-card-text>-->
<!--            </b-tab>-->
<!--            <b-tab title="Mortality">-->

<!--            </b-tab>-->
<!--          </b-tabs>-->
<!--        </b-card>-->
      </div>
      <div class="row">
        <div class="col-12">
          <h4>Midstream variables</h4>
          <inter-index :Cascade="SimLive.Cas"></inter-index>
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
import FigTrend from "./figures/FigTrend.vue";
import loc from "../lists/locations.json";
import pars_all from "../ppa/pars_wr.json"
import { Model } from "../ppa/model";
import intvs from "../lists/interventions";
import * as d3 from "d3";


export default {
  name: "Preview",
  components: {
    Controller,
    InterIndex,
    FigTrend
  },
  data() {
    const settings = { Location: { Location: "India", Region: "India" }, "YearEnd": 2025 };
    const model_all = Object.values(pars_all)
        .map(inp => new Model(inp))
        .reduce((curr, m) => {
          curr[m.Location] = m;
          return curr;
        }, {});

    const sel_m = model_all.India;
    const sim0 = sel_m.sim();

    const i0 = JSON.stringify(intvs)
    return {
      Settings: settings,
      Interventions: ["Interventions"],
      Locations: loc,
      ModelAll: model_all,
      SelLoc: settings.Location,
      SelModel: sel_m,
      IntvForm: intvs,
      IntvLive: {},
      Intv0: i0,
      IntvCurr: i0,
      Sim0: sim0,
      SimCurr: sim0,
      SimLive: sim0,
      TraceInc: {
        Base: [], Intv: []
      },
      TraceMor: {
        Base: [], Intv: []
      },
      fig_width: 300
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
        this.SimLive = this.SelModel.sim(this.IntvLive);
        this.updateResults();
      },
      deep: true
    }
  },
  mounted() {
    this.updateResults();
    this.fig_width = d3.select("#fig_container").node().getBoundingClientRect().width;
  },
  methods: {
    updateResults() {
      this.TraceInc.Base = this.Sim0.Epi.map(d => {
        return {
          Year: d.Time,
          Value: d.IncR * 1e5
        }});

      this.TraceMor.Base = this.Sim0.Epi.map(d => {
        return {
          Year: d.Time,
          Value: d.MorR * 1e5
        }});

      if (this.Sim0 !== this.SimLive) {
        this.TraceInc.Intv = this.SimLive.Epi.map(d => {
          return {
            Year: d.Time,
            Value: d.IncR * 1e5
          }});

        this.TraceMor.Intv = this.SimLive.Epi.map(d => {
          return {
            Year: d.Time,
            Value: d.MorR * 1e5
          }});
      } else {
        this.TraceInc.Intv = [];
        this.TraceMor.Intv = [];
      }
    },
    updateSettings(evt) {
      this.Settings = evt;
      this.SelLoc = this.Settings.Location;
      this.SelModel = this.ModelAll[this.Settings.Location.Location];
      this.Sim0 = this.SelModel.sim();

      if (this.Settings.Location.IntvCurr !== undefined) {
        this.IntvCurr = this.Settings.Location.IntvCurr;
        this.IntvForm = JSON.parse(this.IntvCurr);
      } else {
        this.resetInterventions()
      }
      this.updateResults();
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