<script setup lang="ts">
import { DateTime } from "luxon";

const documentStore = useDocumentStore();

const crossedClasses = 'text-disabled text-decoration-line-through';

const openDocument = computed(() => {
  return documentStore.currentPageDocument;
});
const openDocumentIsList = computed(() => {
  return openDocument.value && 'entries' in openDocument.value;
});

function toggleCrossedState(entry: ChecklistEntry) {
  const changeObj: DocumentChange = {
    type: 'update',
    document: documentStore.currentPageDocument?.id || '',
    timestamp: DateTime.utc().toISO(),
    entryChange: {
      id: entry.id,
      newCrossedState: !entry.crossed
    }
  }
  documentStore.stageChange(changeObj);
}
</script>

<template>
  <v-container :fluid="openDocumentIsList">
    <template v-if="openDocument">
      <pre v-if="'text' in openDocument" v-text="openDocument.text" />
      <template v-if="'entries' in openDocument">
        <v-list bg-color="transparent" class="ma-n4 non-selectable">
          <template
            v-for="(entry, i) in openDocument.entries"
            :key="i"
          >
            <v-list-item
              :class="entry.crossed ? crossedClasses : ''"
              @click="toggleCrossedState(entry)"
            >
              <v-list-item-title
                v-text="entry.text"
              />
            </v-list-item>
            <v-divider />
          </template>
        </v-list>
      </template>
    </template>
    <h1 v-else>
      404 - Not Found
    </h1>
  </v-container>
</template>

<style scoped>
pre {
  font-family: "Roboto", sans-serif;
}
</style>