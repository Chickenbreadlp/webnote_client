<script setup lang="ts">
import { WSReadyState } from '~/utils/types';

const runtimeConfig = useRuntimeConfig();
const settingsStore = useSettingsStore();
const netConn = useNetConn();

const states: ConnectionStatusConfig = {
  'connected': {
    color: 'success',
    title: 'Verbunden',
  },
  'connecting': {
    color: 'amber-darken-2',
    title: 'Verbindungsaufbau...',
  },
  'connectionLost': {
    color: 'red-darken-3',
    title: 'Verbindung verloren',
  },
  'offline': {
    color: 'pink-darken-3',
    title: 'Offlinemodus',
  },
  'paused': {
    color: 'blue-grey-darken-2',
    title: 'Synchronisation pausiert',
  }
}

const status = computed(() => {
  if (runtimeConfig.public.offlineMode) return 'offline';
  else if (settingsStore.syncPaused) return 'paused';
  else {
    switch (netConn.wsConnectionStatus) {
      case WSReadyState.OPEN:
        return 'connected';
      case WSReadyState.CONNECTING:
        return 'connecting';
      default:
        return 'connectionLost';
    }
  }
});

function toggleSyncPause() {
  settingsStore.syncPaused = !settingsStore.syncPaused;
}
</script>

<template>
  <v-list
    class="non-selectable py-0"
    :bg-color="states[status].color"
  >
    <v-list-item
      class="py-3"
      :title="states[status].title"
      subtitle="Verbindungsstatus"
      @click="toggleSyncPause()"
    />
  </v-list>
</template>
