<template>
  <div :id="id" v-resize:debounce.100="onResize" />
</template>
<script>
import Plotly from "plotly.js";

// Adapted from vue-plotly

const directives = {};
if (typeof window !== "undefined") {
  directives.resize = require("vue-resize-directive");
}
export default {
  name: "fig-plotly",
  inheritAttrs: false,
  directives,
  props: {
    id: {
      type: String,
      required: false,
      default: null,
    },
    data: {
      type: Array,
      required: true,
    },
    layout: {
      type: Object,
    },
    options: {
      type: Object,
    },
    events: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      scheduled: null,
    };
  },
  mounted() {
    Plotly.newPlot(this.$el, this.data, this.layout, this.options);

    if (this.events !== null) {
      Object.entries(this.events).forEach((ent) => {
        this.$el.on(ent[0], ent[1]);
      });
    }
  },
  watch: {
    data: {
      handler() {
        this.schedule({ replot: true });
      },
      deep: true,
    },
    options: {
      handler(value, old) {
        if (JSON.stringify(value) === JSON.stringify(old)) {
          return;
        }
        this.schedule({ replot: true });
      },
      deep: true,
    },
    layout: {
      handler(value, old) {
        if (JSON.stringify(value) === JSON.stringify(old)) {
          return;
        }
        this.schedule({ replot: true });
      },
      deep: true,
    },
  },
  methods: {
    onResize() {
      Plotly.Plots.resize(this.$el);
    },
    schedule(context) {
      const { scheduled } = this;
      if (scheduled) {
        scheduled.replot = scheduled.replot || context.replot;
        return;
      }
      this.scheduled = context;
      this.$nextTick(() => {
        const {
          scheduled: { replot },
        } = this;
        this.scheduled = null;
        if (replot) {
          this.react();
          return;
        }
        this.relayout(this.layout);
      });
    },
    react() {
      Plotly.react(this.$el, this.data, this.layout, this.options);
    },
  },
};
</script>
