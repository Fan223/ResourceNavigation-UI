<template>
  <div class="content">
    <el-tabs
      v-model="activeTabId"
      @tab-change="listResources"
    >
      <el-tab-pane
        v-for="category in categorys.data"
        :key="category.id"
        :label="category.name"
        :name="category.id"
      >
        <el-carousel
          indicator-position="outside"
          :interval="10000"
        >
          <el-carousel-item
            v-for="resource in resources.data"
            :key="resource"
          >
            <div
              v-for="res in resource"
              :key="res.id"
              class="res-item"
            >
              <div @click="openUrl(res.url)">
                <el-image :src="require('@/assets/images/icon/' + res.icon)" />
                <h4> {{res.name}} </h4>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Index',
  setup() {
    const axios = inject('axios');

    let resources = reactive({
      data: []
    })
    let categorys = reactive({
      data: []
    })
    let activeTabId = ref('')

    function listCategorys() {
      categorys.data = []

      axios.get('/resNav/api/listCategorys').then(response => {
        categorys.data.push.apply(categorys.data, response.data.data)
        activeTabId.value = categorys.data[0].id;
      });
    }
    listCategorys();

    function listResources(activeTabId) {
      resources.data = []

      axios.get('/resNav/api/listResources', {
        params: {
          categoryId: activeTabId
        }
      }).then(response => {
        let size = 8
        for (let i = 0; i < Math.ceil(response.data.data.length / size); i++) {
          let start = i * size
          let end = start + size
          resources.data.push(response.data.data.slice(start, end))
        }
      });
    }

    function openUrl(url) {
      window.open(url, '_blank')
    }

    return {
      resources,
      categorys,
      activeTabId,

      listResources,
      openUrl
    }
  }
}
</script>

<style>
.content {
  background-image: url("@/assets/images/background.jpg");
  background-size: 100% 100%;
  height: 100vh;
  border: 0.1px solid black;
}
.el-tabs {
  margin: 5% auto;
  width: 70%;
}
.el-tabs__active-bar {
  background-color: #ffd04b;
}
.el-tabs__item {
  color: #fff;
}
.el-tabs__item:hover {
  color: #ffd04b;
}
.el-tabs__item.is-active {
  color: #ffd04b;
}
.res-item {
  float: left;
  width: 120px;
  height: 150px;
  margin-left: 80px;
  margin-top: 30px;
  color: #fff;
}
.res-item:hover {
  color: #ffd04b;
}
.el-image {
  margin: 0 auto;
  height: 120px;
  width: 120px;
}
h4 {
  text-align: center;
}
</style>