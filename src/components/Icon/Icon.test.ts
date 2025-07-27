import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Icon from './Icon.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)
describe('Icon.vue', () => {
  test('图标颜色测试', () => {
    const wrapper = mount(Icon, {
      props: {
        icon: 'home',
        color: 'red',
        //其余属性不必测试，只有color是二次开发的属性
      },
      global: {
        components: {
          FontAwesomeIcon,
        },
      },
    })
    // 测试字体颜色样式是否正确应用
    expect(wrapper.find('svg').attributes('style')).toContain('color: red')
  })
})
