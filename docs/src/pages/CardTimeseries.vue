<template>
  <card-base :title="title" :source_link="source_link">
    <fig-plotly
      :data="traces"
      :layout="layout"
      :options="{ displayModeBar: false }"
    ></fig-plotly>
  </card-base>
</template>

<script>
import CardBase from "./CardBase.vue";
import FigPlotly from "./figures/FigPlotly.vue";

export default {
  name: "card-ts",
  components: {
    CardBase,
    FigPlotly,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    source_link: {
      type: String,
      required: true,
    },
    trace: {
      type: Object,
      required: true,
    },
    layout: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      traces: [this.trace],
    };
  },
  watch: {
    trace: {
      handler(v) {
        this.traces = [v];
      },
      deep: true,
    },
  },
};
</script>
