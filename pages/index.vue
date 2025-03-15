<script setup lang="ts">
const settingsStore = useSettingsStore();
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Willkommen bei Webnote</h1>
        Erstelle eine neue Seite, oder öffene eine existierende in der Seitenleiste.<br />
      </v-col>
      <v-col cols="12">
        <v-switch
            v-model="settingsStore.theme"
            label="Dunkles Theme"
            color="primary"
            false-value="light"
            true-value="dark"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
