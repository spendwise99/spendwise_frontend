<script setup lang="ts">
import { ref, watch, computed } from "vue";

const props = defineProps<{
  step: number;
  mode?: "out-in" | "in-out";
  transition?: "slide" | "fade" | "scale" | "zoom"; // Add more as needed
}>();

const currentStep = ref(props.step);
const direction = ref<"forward" | "backward">("forward");

watch(
  () => props.step,
  (newStep, oldStep) => {
    direction.value = newStep > oldStep ? "forward" : "backward";
    currentStep.value = newStep;
  }
);

// Choose transition class dynamically
const transitionName = computed(() => {
  switch (props.transition) {
    case "fade":
      return "fade";
    case "scale":
      return "scale";
    case "zoom":
      return "zoom";
    case "slide":
    default:
      return direction.value === "forward" ? "slide-left" : "slide-right";
  }
});
</script>

<template>
  <transition :name="transitionName" :mode="mode || 'out-in'">
    <div :key="step" class="w-full h-full">
      <slot :name="`step${step}`" />
    </div>
  </transition>
</template>

<style scoped>
/* SLIDE */
.slide-left-enter-active,
.slide-right-leave-active,
.slide-left-leave-active,
.slide-right-enter-active {
  transition: all 0.3s ease;
}
.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-leave-to,
.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

/* FADE */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* SCALE */
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

/* ZOOM */
.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.zoom-enter-from,
.zoom-leave-to {
  transform: scale(1.2);
  opacity: 0;
}
</style>
