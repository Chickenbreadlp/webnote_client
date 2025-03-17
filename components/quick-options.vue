<script setup lang="ts">
import { DateTime } from "luxon";

const router = useRouter();
const route = useRoute();
const documentStore = useDocumentStore();

const canSave = computed(() => {
  return documentStore.inProgressDocument.savable && documentStore.inProgressDocument.changed;
});

const currentPageDocument = computed(() => {
  return documentStore.currentPageDocument;
});

function saveOpenDocument() {
  documentStore.saveInProgress = true;
}

const deleteDialogOpen = ref(false);
async function deleteOpenDocument() {
  deleteDialogOpen.value = false;
  if (currentPageDocument.value) {
    const deletePayload: DocumentChange = {
      type: 'delete',
      timestamp: DateTime.utc().toISO(),
      document: currentPageDocument.value.id
    }
    await documentStore.stageChange(deletePayload);
    await router.push('/');
  }
}

watch(route, () => {
  deleteDialogOpen.value = false;
}, { deep: true, immediate: true });
</script>

<template>
  <template
    v-if="
      route.name === 'new-text' ||
      route.name === 'new-checklist' ||
      route.name === 'edit-text-document'
    "
  >
    <v-btn
      :disabled="!canSave"
      icon="mdi-content-save"
      @click.stop="saveOpenDocument()"
    ></v-btn>
    <v-btn
      icon="mdi-undo-variant"
      :to="
        route.name === 'edit-text-document'
          ? '/documents/' + route.params.document
          : '/'
      "
    />
  </template>
  <template
    v-else-if="
      route.name === 'edit-checklist-document'
    "
  >
    <v-btn
      icon="mdi-undo-variant"
      :to="'/documents/' + route.params.document"
    />
  </template>
  <template v-else-if="route.name === 'documents-document' && currentPageDocument">
    <v-btn
      icon="mdi-pencil"
      :to="
        ('text' in currentPageDocument)
          ? '/edit-text/' + route.params.document
          : '/edit-checklist/' + route.params.document
      "
    />
    <v-btn
      icon="mdi-delete"
      @click.stop="deleteDialogOpen = true"
    />
  </template>

  <confirmation-dialog
    :open-dialog="deleteDialogOpen"
    @cancel="deleteDialogOpen = false"
    @confirm="deleteOpenDocument()"
  />
</template>
