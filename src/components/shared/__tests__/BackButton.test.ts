import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BackButton from '../BackButton.vue'

describe('BackButton', () => {
  it('should render with default variant', () => {
    const wrapper = mount(BackButton)
    
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.text()).toContain('Back')
  })

  it('should render with minimal variant', () => {
    const wrapper = mount(BackButton, {
      props: { variant: 'minimal' }
    })
    
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Back')
  })

  it('should have correct classes for default variant', () => {
    const wrapper = mount(BackButton, {
      props: { variant: 'default' }
    })
    
    const button = wrapper.find('button')
    expect(button.classes()).toContain('px-4')
    expect(button.classes()).toContain('py-2')
    expect(button.classes()).toContain('bg-white')
    expect(button.classes()).toContain('shadow-sm')
    expect(button.classes()).toContain('border')
  })

  it('should have correct classes for minimal variant', () => {
    const wrapper = mount(BackButton, {
      props: { variant: 'minimal' }
    })
    
    const button = wrapper.find('button')
    expect(button.classes()).toContain('p-2')
    expect(button.classes()).toContain('rounded-full')
    expect(button.classes()).not.toContain('bg-white')
    expect(button.classes()).not.toContain('shadow-sm')
  })

  it('should have proper accessibility attributes', () => {
    const wrapper = mount(BackButton)
    
    const button = wrapper.find('button')
    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('aria-label')).toBe('Go back')
  })

  it('should emit click event when clicked', async () => {
    const wrapper = mount(BackButton)
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('should have focus styles', () => {
    const wrapper = mount(BackButton)
    
    const button = wrapper.find('button')
    expect(button.classes()).toContain('focus:outline-none')
    expect(button.classes()).toContain('focus:ring-2')
    expect(button.classes()).toContain('focus:ring-blue-500')
  })

  it('should have hover styles', () => {
    const wrapper = mount(BackButton)
    
    const button = wrapper.find('button')
    expect(button.classes()).toContain('hover:text-gray-800')
    expect(button.classes()).toContain('hover:bg-gray-100')
  })

  it('should contain back arrow SVG', () => {
    const wrapper = mount(BackButton)
    
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.classes()).toContain('w-5')
    expect(svg.classes()).toContain('h-5')
    
    const path = svg.find('path')
    expect(path.exists()).toBe(true)
    expect(path.attributes('d')).toBe('M15 19l-7-7 7-7')
  })
})
