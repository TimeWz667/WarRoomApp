<template>
  <div :id="'con' + chartId">
    <svg :id="chartId"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";


export default {
  name: "FigTrend",
  props: {
    trace_base: {
      type: Array,
      required: true,
    },
    trace_intv: {
      type: Array,
      required: true,
    },
    chartId: {
      type: String,
      required: true
    },
    asp: {
      type: Number,
      default: 0.4
    }
  },
  data() {
    return {
      svg: null,
      g: null,
      width: null,
      height: null,
      x: null, y: null, xAxis: null, yAxis: null,
      colour: null,
      margin: { top: 10, right: 40, bottom: 55, left: 20 },
    };
  },
  watch: {
    visible() {
      this.resize();
    },
    svg_width() {
      this.resize();
    },
    trace_base() {
      this.update();
    },
    trace_intv() {
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

      const height = width * this.asp;
      this.width = width;
      this.height = height;

      this.x = d3
          .scaleLinear()
          .rangeRound([this.margin.left, this.width - this.margin.right]);

      this.y = d3
          .scaleLinear()
          .nice()
          .range([this.height - this.margin.bottom, this.margin.top]);

      this.xAxis = d3
          .axisBottom(this.x)
          .ticks(5).tickFormat(d3.format(".0f"));

      this.yAxis = d3
          .axisRight(this.y)
          .ticks(6);

      this.svg
          .append("g")
          .attr("class", "xAxis")
          .attr(
              "transform",
              `translate(0,${this.height - this.margin.bottom})`
          );

      this.svg
          .append("g")
          .attr("class", "yAxis")
          .attr("transform", `translate(${this.width - this.margin.right},0)`);

      this.svg
          .append("text")
          .attr("class", "xLab")
          .attr(
              "transform",
              `translate(${(this.width + this.margin.left) / 2},${this.height})`
          )
          .attr("dy", "-0.9em")
          .style("text-anchor", "middle")
          .text("Year");

      this.svg
          .append("text")
          .attr("class", "yLab")
          .attr("transform", "rotate(-90)")
          .attr("y", 0)
          .attr("x", -(this.height / 2) + this.margin.top)
          .attr("dy", "0.9em")
          .style("text-anchor", "middle")
          .text("per 100 000");

      this.colours = d3
          .scaleOrdinal()
          .domain(["Baseline", "Intervention"])
          .range(["#ffab16", "#23ff4f"]);

      this.x.domain([2022, 2030]);

      this.svg
          .select("g.xAxis")
          .transition()
          .duration(100)
          .call(this.xAxis)
          .selectAll("text")
          .attr("y", 10)
          .attr("x", 9)
          .attr("dy", ".35em")
          .attr("transform", "rotate(20)")
          .style("text-anchor", "start");
    },
    update() {
      this.y.domain([
        0,
        1.1 * d3.max(this.trace_base, ent =>
            ent.Value
        )
      ]);

      this.svg
          .select("g.yAxis")
          .transition()
          .duration(100)
          .call(this.yAxis);

      let has_intv = false;
      if (this.trace_intv.length > 0 &&
          this.trace_intv[this.trace_intv.length - 1].Value !==this.trace_base[this.trace_base.length - 1].Value ) {
        has_intv = true;
      }

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