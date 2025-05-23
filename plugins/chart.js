import VueApexCharts from "vue-apexcharts";
import Vue from "vue";

export default () => {
  Vue.use(VueApexCharts);
  Vue.component("apexchart", VueApexCharts);
};
