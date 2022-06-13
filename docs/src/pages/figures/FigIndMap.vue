<template>
  <div id="root_map">
    <svg id="sub_ind_lv2"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import geojson from "../../lists/gadm_ind.json";
import * as turf from "@turf/turf";

export default {
  name: "FigTwMap",
  data() {
    const ava = this.ava.map(loc => loc.Location);

    geojson.features = geojson.features
        .filter(feature => feature.geometry !==null)
        .filter(feature => ava.indexOf(feature.properties.NAME_1) >= 0)
        .map(function (feature) {
      return turf.rewind(feature, { reverse: true });
    });

    return {
      geojson: geojson,
      selected: null,
      svg: null,
      g: null,
      width: null,
      height: null,
      proj: null
    };
  },
  props: {
    asp: {
      type: Number,
      default: 1,
    },
    visible: {
      type: Boolean,
      required: true
    },
    ava: {
      type: Array,
      required: true
    }
  },
  watch: {
    visible() {
      this.resize();
    }
  },
  mounted() {
    this.initialise();
    this.svg.on("resize", this.resize);
  },
  methods: {
    initialise() {
      const size = d3.select("#root_map").node().getBoundingClientRect();
      this.svg = d3.select("svg#sub_ind_lv2");
      const width = size.width;
      const height = width * this.asp;
      this.width = width;
      this.height = height;
      this.svg.attr("width", width).attr("height", height);

      const svg = this.svg;

      // Map and projection
      this.proj = d3
        .geoMercator()
        .scale(400)
        .center([80, 21])
        .translate([width / 2, height / 2]);

      svg
        .append("g")
        .selectAll("path")
        .data(this.geojson.features)
        .join("path")
        .attr("class", "county")
        .attr("d", d3.geoPath().projection(this.proj))
        .attr("fill", "#ddd")
        .style("stroke", "#1d466c")
        .on("click", this.selectState);
    },
    update() {
      this.svg.selectAll("path.county").join(
        (enter) => {
          enter
            .append("path")
            .attr("class", "county")
            .attr("d", d3.geoPath().projection(this.proj))
            .attr("fill", "#ddd")
            .style("stroke", "#1d466c")
            .on("click", this.selectState);
        },
        (update) => {
          update
              .attr("d", d3.geoPath().projection(this.proj))
              .attr("fill", (d) => {
            return d.properties.NAME_1 === this.selected ? "#e22" : "#ddd";
          });
        }
      );
    },
    selectState(evt) {
      const loc = evt.target.__data__.properties.NAME_1;

      if (this.selected === loc) {
        this.selected = null;
        this.$emit("change-loc", "India");
      } else {
        this.selected = loc;
        this.$emit("change-loc", loc);
      }
      this.update();
    },
    resize() {
      const size = d3.select("#root_map").node().getBoundingClientRect();
      const width = size.width;

      const height = width * this.asp;
      this.width = width;
      this.height = height;
      this.svg.attr("width", width).attr("height", height);

      this.proj
          .scale((width < 250)? 300: 400)
          .center([80, 21])
          .translate([width / 2, height / 2]);


      this.update();
    },
  },
};
</script>

<style scoped>
path {
  fill-opacity: 0.4;
  fill: #0d6efd;
  stroke: #bb1313;
}
</style>
