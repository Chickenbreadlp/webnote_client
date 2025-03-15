<script setup lang="ts">
import { DateTime } from 'luxon';

const router = useRouter();
const documentStore = useDocumentStore();

const { saveInProgress } = storeToRefs(documentStore);
documentStore.inProgressDocument = {
  changed: false,
  savable: false
}
saveInProgress.value = false;

const title = ref('');
const text = ref('');

const titleError = ref<string | null>('Seitentitel ist erforderlich');

watch(title, (newVal) => {
  if (documentStore.documents.find(document => document.id === generatePageId(newVal))) {
    titleError.value = 'Dieser Seitentitel kann nicht verwendet werden';
    documentStore.inProgressDocument.savable = false;
  } else if (newVal.trim() === '') {
    titleError.value = 'Seitentitel ist erforderlich';
    documentStore.inProgressDocument.savable = false;
  } else if (titleError.value) {
    titleError.value = null;
    documentStore.inProgressDocument.savable = true;
  }
});
effect(() => {
  documentStore.inProgressDocument.changed = title.value !== '' && text.value !== '';
});

watch(saveInProgress, async () => {
  const newDocument: DocumentChange = {
    type: 'create',
    timestamp: DateTime.utc().toISO(),
    document: generatePageId(title.value),
    title: title.value,
    content: text.value
  }
  await documentStore.stageChange(newDocument);
  await router.push('/documents/' + newDocument.document);
});
</script>

<template>
  <v-container>
    <v-text-field
      v-model="title"
      label="Seitentitel"
      :error="!!titleError"
      :error-messages="titleError"
      class="mb-4"
    />
    <v-textarea v-model="text" label="Text" auto-grow />
  </v-container>
</template>

<style scoped>

</style>