<script setup lang="ts">
const documentStore = useDocumentStore();

const documentLinks = computed(() => {
  return documentStore.documents.map(document => ({
    title: document.title,
    link: '/documents/' + document.id,
    id: document.id
  }))
});
</script>

<template>
  <v-list nav>
    <v-list-item to="/">
      <template v-slot:prepend>
        <v-icon icon="mdi-cog" />
      </template>
      <v-list-item-title>Einstellungen</v-list-item-title>
    </v-list-item>

    <v-list-item link>
      <template v-slot:prepend>
        <v-icon icon="mdi-plus" />
      </template>
      <v-list-item-title>Neue Seite</v-list-item-title>

      <v-menu activator="parent" location="end">
        <v-list>
          <v-list-item to="/new-text">
            <template v-slot:prepend>
              <v-icon icon="mdi-text" />
            </template>
            <v-list-item-title>Text</v-list-item-title>
          </v-list-item>
          <v-list-item to="/new-checklist">
            <template v-slot:prepend>
              <v-icon icon="mdi-format-list-checks" />
            </template>
            <v-list-item-title>Checkliste</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list-item>

    <v-divider class="my-3" />


    <v-list-item
      v-for="(document) in documentLinks"
      :key="document.id"
      :to="document.link"
    >
      <v-list-item-title v-text="document.title" />
    </v-list-item>
  </v-list>
</template>
