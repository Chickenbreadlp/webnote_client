<script setup lang="ts">
import { useDisplay } from "vuetify";

const route = useRoute();
const documentStore = useDocumentStore();
const { xs } = useDisplay();

const navOpen = ref(true);

const pageTitle = computed(() => {
  switch (route.name) {
    case 'index':
      return 'Einstellungen';
    case 'new-text':
      return 'Neues Textdokument';
    case 'new-checklist':
      return 'Neue Checkliste';
    case 'documents-document':
      return documentStore.documents.find(document => document.id === route.params.document)?.title;
    case 'edit-text-document':
    case 'edit-checklist-document':
      return documentStore.documents.find(document => document.id === route.params.document)?.title + ' bearbeiten';
    default:
      return route.name;
  }
});
</script>

<template>
  <NuxtLayout>
    <pwa-handler />
    <v-app>
      <v-layout>
        <v-navigation-drawer v-model="navOpen" mobile-breakpoint="sm">
          <conn-status />
          <v-divider />
          <nav-list />
        </v-navigation-drawer>

        <v-app-bar color="primary">
          <template v-slot:prepend v-if="xs">
            <v-app-bar-nav-icon @click.stop="navOpen = !navOpen" />
          </template>

          <v-app-bar-title>{{ pageTitle }}</v-app-bar-title>

          <template v-slot:append>
            <quick-options />
          </template>
        </v-app-bar>

        <v-main>
          <NuxtPage />
        </v-main>
      </v-layout>
    </v-app>
  </NuxtLayout>
</template>