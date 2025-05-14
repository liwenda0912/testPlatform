<script setup lang="ts" xmlns="">
import {use} from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {BarChart, LineChart, PieChart} from 'echarts/charts';
import {TitleComponent, TooltipComponent, LegendComponent, GridComponent} from 'echarts/components';
import VChart from 'vue-echarts';
import {onMounted, ref} from "vue";

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);
const loading = ref(false);

const option = {
  title: {
    text: '示例图表',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: ({d}%)'
  },
  label: {
    show: true,
    formatter: '{b}: {d}%'
  },
  legend: {
    left: 0,
    top: 60,
    // align: 'left', // 图例组件在容器中水平对齐方式
    data: ['用户数', '用例文档', '用例'],
  },
  grid: {
         // 距离容器右侧的距离
    width: '80%',      // 图表内容的宽度（相对于容器）
    // containLabel: true // 是否包含坐标轴标签
  },
  series: [
    {
      top: 80,
      radius: '50%',
      name: '访问来源',
      type: 'pie',
      data: [],
    },
  ],
};
const options = {
  title: {
    text: '近7天新增会员数',
  },
  xAxis: {
    data: []
  },
  tooltip: {
    trigger: 'item',
  },
  yAxis: {},
  series: [
    {
      type: 'bar',
      data: []
    }
  ]
};
import { UploadFilled } from '@element-plus/icons-vue'
import {count, countTest} from "@/api/index";
const upload=(file:any)=>{
  const File = file.file;
  const formData = new FormData();
  formData.append("file", File);
}
const chartRef = ref<any>(null);
const chartRefs = ref<any>(null);


onMounted(()=>{
  count().then((res:any)=>{
    options.xAxis.data=res.data.date
    options.series[0].data=res.data.data
    console.log(options)
    chartRef.value.setOption(options);
  })
  countTest().then((res:any)=>{
    option.series[0].data=res.data
    console.log(option)
    chartRefs.value.setOption(option);

  })
  console.log(import.meta.env.VITE_BASE_API);
})
</script>
<template>
  <div class="common-layout">
    <el-container class="layout-container-demo">
      <el-main>
        <div slot="header" class="clearfix">
          <el-card v-loading="loading" class="demo-layout">
            <v-chart ref="chartRefs" :option="option" style="width: 600px;height: 400px ;padding-left:150px;display: block;float: left"/>
            <v-chart ref="chartRef"  :option="options"
                     style="width: 400px;height: 400px;padding: 10px 150px 10px 10px;   display: block; float: right"/>
          </el-card>
          <el-card class="demo-layout-upload">
            <el-upload
                    :http-request="upload"
                    class="upload-demo"
                    drag
                    action=""
                    multiple
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  jpg/png files with a size less than 500kb
                </div>
              </template>
            </el-upload>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.common-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.layout-container-demo {
  font-size: 2rem;
}



button {
  height: 50px;
}

.layout-container-demo {
  /* 隐藏滚动条 */
  overflow: auto; /* 允许滚动 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 和 Edge */
}

main {
  /* 隐藏滚动条 */
  overflow: auto; /* 允许滚动 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 和 Edge */
  width: 94% !important;
}

.demo-layout {
  margin: 20px 20px 20px 20px;
  height: 420px;
  width: auto;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
  max-width: 100%; /* 最大宽度限制 */

}
.demo-layout-upload{
  margin: 20px 20px 20px 20px;
  height: 300px;
  width: auto;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
  max-width: 100%; /* 最大宽度限制 */
}
</style>