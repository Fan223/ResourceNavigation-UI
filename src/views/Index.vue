<template>
  <Tabs>
    <template
      v-for="(category) in categorys"
      :key="category.label"
    >
      <TabPane
        :label=category.label
        :icon=category.icon
      >
        <template
          v-for="fit in category.value"
          :key="fit"
        >
          <Row
            class="ivu-text-center"
            :gutter="24"
          >
            <Col flex="1">
            <Image src="https://file.iviewui.com/images/image-demo-13.jpg" />
            <Paragraph class="ivu-mt">默认</Paragraph>
            </Col>
            <Col flex="1">
            <Image src="https://file.iviewui.com/images/image-demo-13.jpg">
              <template #placeholder>
                <Spin
                  size="large"
                  fix
                />
              </template>
            </Image>
            <Paragraph class="ivu-mt">自定义</Paragraph>
            </Col>
          </Row>
        </template>
      </TabPane>
    </template>
  </Tabs>
</template>

<script>
import { reactive } from '@vue/reactivity'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Index',
  setup() {
    let categorys = reactive([
      {
        label: 'macOS',
        icon: 'logo-apple',
        value: ['fill', 'contain', 'cover', 'none', 'scale-down']
      },
      {
        label: 'Windows',
        icon: 'logo-windows',
        value: ['fill', 'contain', 'cover', 'none', 'scale-down']
      },
    ])
    let url = 'https://file.iviewui.com/images/image-demo-11.jpg'

    return {
      categorys,
      url
    }
  }
}
</script>

<style>
</style>