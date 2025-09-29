import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusCircle from '../StatusCircle.vue'
import { PERFORMANCE_COLORS } from '../../../utils/constants'

describe('StatusCircle', () => {
  it('should render with default props', () => {
    const wrapper = mount(StatusCircle)
    
    expect(wrapper.find('.status-circle').exists()).toBe(true)
    expect(wrapper.classes()).toContain('w-10') // medium size
    expect(wrapper.classes()).toContain('h-10')
  })

  it('should display correct size classes', () => {
    const smallWrapper = mount(StatusCircle, { props: { size: 'small' } })
    expect(smallWrapper.classes()).toContain('w-7')
    expect(smallWrapper.classes()).toContain('h-7')
    
    const largeWrapper = mount(StatusCircle, { props: { size: 'large' } })
    expect(largeWrapper.classes()).toContain('w-14')
    expect(largeWrapper.classes()).toContain('h-14')
  })

  it('should show correct background color for unattempted question', () => {
    const wrapper = mount(StatusCircle, {
      props: { asked: false }
    })
    
    const element = wrapper.find('.status-circle').element as HTMLElement
    expect(element.style.backgroundColor).toBe('rgb(156, 163, 175)') // grey
  })

  it('should show correct background color for excellent performance', () => {
    const wrapper = mount(StatusCircle, {
      props: { avgTime: 2.5, asked: true }
    })
    
    const element = wrapper.find('.status-circle').element as HTMLElement
    expect(element.style.backgroundColor).toBe('rgb(63, 206, 149)') // green #3FCE95
  })

  it('should display formatted time in time mode', () => {
    const wrapper = mount(StatusCircle, {
      props: { avgTime: 3.7, displayMode: 'time' }
    })
    
    expect(wrapper.text()).toBe('4s') // rounded with suffix
  })

  it('should display X symbol in wrong mode', () => {
    const wrapper = mount(StatusCircle, {
      props: { displayMode: 'wrong' }
    })
    
    expect(wrapper.text()).toBe('✗')
  })

  it('should display nothing in empty mode', () => {
    const wrapper = mount(StatusCircle, {
      props: { displayMode: 'empty' }
    })
    
    expect(wrapper.text()).toBe('')
  })

  it('should add interactive classes when interactive=true', () => {
    const wrapper = mount(StatusCircle, {
      props: { interactive: true }
    })
    
    expect(wrapper.classes()).toContain('cursor-pointer')
    expect(wrapper.classes()).toContain('hover:scale-105')
  })

  it('should emit click event when interactive and clicked', async () => {
    const wrapper = mount(StatusCircle, {
      props: { interactive: true }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('should not emit click event when not interactive', async () => {
    const wrapper = mount(StatusCircle, {
      props: { interactive: false }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('should show tooltip with correct content', () => {
    const wrapper = mount(StatusCircle, {
      props: {
        n: 7,
        m: 8,
        avgTime: 4.2,
        wrongCount: 1,
        showTooltip: true
      }
    })
    
    const tooltipText = wrapper.vm.$el.getAttribute('title')
    expect(tooltipText).toContain('7×8')
    expect(tooltipText).toContain('Avg: 4.2s')
    expect(tooltipText).toContain('Wrong: 1')
  })

  it('should show "Not attempted" in tooltip for unattempted questions', () => {
    const wrapper = mount(StatusCircle, {
      props: {
        n: 3,
        m: 4,
        asked: false,
        showTooltip: true
      }
    })
    
    const tooltipText = wrapper.vm.$el.getAttribute('title')
    expect(tooltipText).toContain('3×4')
    expect(tooltipText).toContain('Not attempted')
  })

  it('should handle red color for wrong answers with no correct times', () => {
    const wrapper = mount(StatusCircle, {
      props: {
        asked: true,
        wrongCount: 2,
        avgTime: null
      }
    })
    
    const element = wrapper.find('.status-circle').element as HTMLElement
    expect(element.style.backgroundColor).toBe('rgb(239, 68, 68)') // red
  })
})
