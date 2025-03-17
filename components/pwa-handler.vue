<script setup lang="ts">
const { $pwa } = useNuxtApp();

onMounted(() => {
  if ($pwa?.offlineReady)
    console.log('We are offline ready!');
})
</script>

<template>
  <span class="d-none">
    <NuxtPwaManifest />
  </span>
</template>
