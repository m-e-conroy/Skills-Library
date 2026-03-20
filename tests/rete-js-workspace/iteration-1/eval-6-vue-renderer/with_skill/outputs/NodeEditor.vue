<template>
  <div :ref="el" class="rete-editor" />
</template>

<script setup lang="ts">
import { useRete } from "rete-vue-plugin";
import { createEditor } from "./editor";

// useRete returns [refCallback, editorInstance]
// Pass the ref callback to :ref on the container element.
// Rete mounts itself into the container once Vue binds the DOM element.
const [el, editor] = useRete(createEditor);
</script>

<style scoped>
.rete-editor {
  width: 100%;
  height: 100vh;
}
</style>
