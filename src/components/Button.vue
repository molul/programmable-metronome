<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  label?: string
  icon?: string
  fullWidth?: boolean
  size?: 'normal' | 'big'
  type?: 'primary' | 'secondary' | 'text' | 'alert'
  shape?: 'rounded' | 'square'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fullWidth: false,
  size: 'normal',
  type: 'primary',
  shape: 'square',
  disabled: false
})
</script>

<template>
  <button
    :class="[
      'font-semibold text-white  duration-200 transition-colors flex gap-2.5 justify-center items-center cursor-pointer',
      {
        'bg-blue-600 hover:bg-blue-500 active:bg-blue-600': props.type === 'primary'
      },
      {
        'bg-red-600 hover:bg-red-500 active:bg-red-600': props.type === 'alert'
      },
      {
        '': props.type === 'text'
      },
      { 'w-full': props.fullWidth },
      { 'h-16 text-3xl': props.size === 'big' },
      { 'rounded-full p-4 aspect-square': props.shape === 'rounded' },
      { 'rounded-md px-4 py-2': props.shape === 'square' }
    ]"
    :disabled="disabled"
  >
    <Icon
      v-if="props.icon"
      :icon="props.icon"
      :class="[props.size === 'big' ? 'size-7' : 'size-6']"
    />
    <span v-if="props.label">{{ props.label }}</span>
  </button>
</template>
