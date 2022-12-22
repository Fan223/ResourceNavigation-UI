<template>
  <el-tabs
    v-model="activeName"
    class="demo-tabs"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="User"
      name="first"
    >
      <el-carousel indicator-position="outside">
        <el-carousel-item>
          <el-row>
            <el-col
              :offset="2"
              :span="4"
            >
              <div>
                <el-image
                  style="width: 100px; height: 100px"
                  :src="info.url"
                />
                <h4>MVN Repository</h4>
              </div>
            </el-col>
            <el-col :span="4">
              <el-image
                style="width: 100px; height: 100px"
                :src="info.url"
              />
            </el-col>
          </el-row>
        </el-carousel-item>
      </el-carousel>
    </el-tab-pane>
    <el-tab-pane
      label="Config"
      name="second"
    >Config</el-tab-pane>
    <el-tab-pane
      label="Role"
      name="third"
    >Role</el-tab-pane>
    <el-tab-pane
      label="Task"
      name="fourth"
    >Task</el-tab-pane>
  </el-tabs>
</template>

<script>
import { reactive } from '@vue/reactivity'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Index',
  setup() {
    let info = reactive({
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    })

    return {
      info
    }
  }
}
</script>

<style>
.el-tabs {
  border: 1px solid red;
  margin: 10% auto;
  width: 80%;
  height: 60vh;
}
</style>