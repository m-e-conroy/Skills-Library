<template>
  <div ref="el" class="rete-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { createEditor } from "./editor";

const el = ref<HTMLElement | null>(null);
let destroy: (() => void) | null = null;

onMounted(async () => {
  if (el.value) {
    const editor = await createEditor(el.value);
    destroy = editor.destroy;
  }
});

onBeforeUnmount(() => {
  destroy?.();
});
</script>

<style scoped>
.rete-container {
  width: 100%;
  height: 600px;
  background: #1e1e2e;
  border-radius: 8px;
  overflow: hidden;
}
</style>
