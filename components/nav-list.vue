<script setup lang="ts">

</script>

<template>
  <v-list nav>
    <v-list-item to="/">
      <template v-slot:prepend>
        <v-icon icon="mdi-home" />
      </template>

      <v-list-item-title v-text="'Home'" />
    </v-list-item>
    <v-list-item to="/new">
      <template v-slot:prepend>
        <v-icon icon="mdi-plus" />
      </template>

      <v-list-item-title v-text="'New Page'" />
    </v-list-item>
    <v-divider class="my-3" />
  </v-list>
</template>

<style scoped>

</style>