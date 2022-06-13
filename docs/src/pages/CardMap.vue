<template>
  <card-base title="">
    <fig-ind-map v-on:change-loc="changeLoc" :asp="0.8" :visible="visible" :ava="ava"></fig-ind-map>
    <div>
    </div>
  </card-base>
</template>

<script>
import CardBase from "./CardBase.vue";
import FigIndMap from "./figures/FigIndMap.vue";

export default {
  name: "chart-map",
  components: {
    CardBase,
    FigIndMap,
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    ava: {
      type: Array
    }
  },
  data() {
    return {
      selected: null,
      foot: "India",
    };
  },
  methods: {
    changeLoc(e) {
      this.foot = e;
      this.$emit("change-loc", e);
    },
  },
};
</script>
