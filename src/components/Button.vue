<script setup lang="ts">
import { Icon } from "@iconify/vue";

interface Props {
  label?: string;
  icon?: string;
  fullWidth?: boolean;
  size?: "normal" | "big";
  type?: "primary" | "secondary" | "text" | "alert";
}

const props = withDefaults(defineProps<Props>(), {
  fullWidth: false,
  size: "normal",
  type: "primary",
});
</script>

<template>
  <button
    :class="[
      'font-semibold text-white rounded-md px-4 py-2 duration-200 transition-colors flex gap-2.5 justify-center items-center cursor-pointer',
      {
        'bg-blue-600 hover:bg-blue-500 active:bg-blue-600':
          props.type === 'primary',
      },
      {
        'bg-red-600 hover:bg-red-500 active:bg-red-600': props.type === 'alert',
      },
      {
        '': props.type === 'text',
      },
      { 'w-full': props.fullWidth },
      { 'h-14 text-3xl': props.size === 'big' },
    ]"
  >
    <Icon
      v-if="props.icon"
      :icon="props.icon"
      :class="[props.size === 'big' ? 'size-8' : 'size-6']"
    />
    <span v-if="props.label">{{ props.label }}</span>
  </button>
</template>
