<script setup lang="ts">
const settingsStore = useSettingsStore();

const states: ConnectionStatusConfig = {
  'connected': {
    color: 'success',
    title: 'Verbunden',
  },
  'connectionLost': {
    color: 'amber-darken-2',
    title: 'Verbindungsaufbau...',
  },
  'offline': {
    color: 'pink-darken-3',
    title: 'Offlinemodus',
  }
}

const status = computed(() => {
  return settingsStore.offlineClient ? 'offline' : 'connectionLost'
});
</script>

<template>
  <v-list :bg-color="states[status].color">
    <v-list-item :title="states[status].title" subtitle="Verbindungsstatus"></v-list-item>
  </v-list>
</template>
