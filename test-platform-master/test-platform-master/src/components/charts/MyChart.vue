<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import echarts from '@/config/echartsConfig';
import type { EChartsOption } from 'echarts';

export default defineComponent({
  name: 'MyChart',
  props: {
    option: {
      type: Object as () => EChartsOption,
      required: true,
    },
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null);
    let chartInstance: echarts.ECharts | null = null;

    onMounted(() => {
      if (chartRef.value) {
        chartInstance = echarts.init(chartRef.value);
        chartInstance.setOption(props.option);
      }
    });

    onUnmounted(() => {
      chartInstance?.dispose();
    });

    return {
      chartRef,
    };
  },
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>