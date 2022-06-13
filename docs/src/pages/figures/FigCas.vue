<template>
  <div :id="'con' + chartId">
    <svg :id="chartId"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";


export default {
  name: "FigCas",
  props: {
    cas_base: {
      type: Array,
      required: true,
    },
    cas_intv: {
      type: Array,
      required: true,
    },
    chartId: {
      type: String,
      required: true
    },
    labels: {
      type: Array,
      required: true
    },
    align: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      svg: null,
      g: null,
      width: null,
      height: null,
      x: null, xAxis: null,
      colour: null,
      inter: 30,
      bar_width: 80
    };
  },
  watch: {
    cas_base() {
      this.update();
    },
    cas_intv() {
      this.update();
    }
  },
  mounted() {
    this.initialise();
    this.svg.on("resize", this.resize);
  },
  methods: {
    initialise() {
      const size = d3.select("#con" + this.chartId).node().getBoundingClientRect();
      const width = size.width;
      this.svg = d3.select("#" + this.chartId);

      const height = this.bar_width * 2 + this.inter;
      this.width = width;
      this.height = height;

      this.x = d3
          .scaleLinear()
          .range([this.margin.left, this.width - this.margin.right]);




      this.svg
          .append("text")
          .attr("class", "xLab")
          .attr(
              "transform",
              `translate(${(this.width + this.margin.left) / 2},${this.height})`
          )
          .attr("dy", "-0.9em")
          .style("text-anchor", "middle")
          .text(this.align? "Proportion": "Duration");

      //todo
      this.colours = d3
          .scaleOrdinal()
          .domain(["Baseline", "Intervention"]);

      this.x.domain([0, 1]);

    },
    update() {

      let has_intv = false;
      if (this.cas_intv.length > 0 &&
          this.cas_intv[this.cas_intv.length - 1].Value !==this.cas_base[this.cas_base.length - 1].Value ) {
        has_intv = true;
      }

      this.svg
        .selectAll("rect.box_base")
        .data(this.cas_base.reduce())
        .join(
            enter => {
              enter
                .append("rect")
                .attr("class", "box_base")
                .attr("x", d => d.x0)
                .attr("width", d => dx)
                .attr("y", 0)
                .attr("height", this.bar_width)
                .attr("fill", d => this.colours(d.State))
            },
            update => {

            },
            exit => {

            }
        )

      this.svg
          .selectAll("path.line_base")
          .data([this.trace_base])
          .join(
              enter => {
                enter
                    .append("path")
                    .attr("class", "line_base")
                    .attr("d", d3.line().y(d => this.y(d.Value)).x(d => this.x(d.Year))
                    )
                    .attr("fill", "none")
                    .attr("stroke", this.colours("Baseline"))
                    .attr("stroke-width", 5).style("opacity", (has_intv)? 0.3: 1);
              },
              update => {
                update
                    .transition(400)
                    .attr("d", d3.line().y(d => this.y(d.Value)).x(d => this.x(d.Year)))
                    .attr("stroke-width", 5).style("opacity", (has_intv)? 0.3: 1);
              }
          );

      this.svg
          .selectAll("path.line_intv")
          .data([has_intv? this.trace_intv: []])
          .join(
              enter => {
                enter
                    .append("path")
                    .attr("class", "line_base")
                    .attr("d", d3.line().y(d => this.y(d.Value)).x(d => this.x(d.Year))
                    )
                    .attr("fill", "none")
                    .attr("stroke", this.colours("Intervention"))
                    .attr("stroke-width", 5);
              },
              update => {
                update
                    .transition(200)
                    .attr("d", d3.line().y(d => this.y(d.Value)).x(d => this.x(d.Year)));
              },
              exit => {
                exit
                    .transition(200)
                    .remove()
              }
          );

    },
    resize() {
      const size = d3.select("#con" + this.chartId).node().getBoundingClientRect();

      const width = size.width;
      const height = width * this.asp;
      this.width = width;
      this.height = height;
      this.svg.attr("width", width).attr("height", height);

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