<template>
  <Row>
    <Col :span="12">
    <Button
      @click="collapsedAside"
      icon="ios-home-outline"
      v-if="!this.$store.state.isCollapsed"
      class="header-collapse-button"
    >
    </Button>
    <Button
      @click="collapsedAside"
      icon="ios-home-outline"
      v-if="this.$store.state.isCollapsed"
      class="header-collapse-button"
    >
    </Button>
    </Col>

    <Col
      :span="4"
      :offset="8"
    >
    <Avatar
      :size="40"
      :src="this.$store.state.url"
      class="header-avatar"
    />
    </Col>
  </Row>
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'HeaderMenu',
  setup() {
    const store = useStore()

    function collapsedAside() {
      store.state.isCollapsed = !store.state.isCollapsed
    }

    return {
      collapsedAside,
    }
  }
}
</script>

<style scoped>
.header-collapse-button {
  border: none;
  height: 50px;
  width: 50px;
  margin-bottom: 2px;
  font-size: 25px;
  border-bottom: 1px solid #ccc;
}
.header-collapse-button:hover {
  background-color: #ccc;
  color: black;
}
.header-avatar {
  float: right;
  margin-right: 40px;
  margin-top: 5px;
}
</style>