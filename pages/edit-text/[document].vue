<script setup lang="ts">
import { DateTime } from "luxon";

const router = useRouter()
const documentStore = useDocumentStore();

const { saveInProgress } = storeToRefs(documentStore);
documentStore.inProgressDocument = {
  changed: false,
  savable: true
}
saveInProgress.value = false;

let startingVals = {
  id: '',
  text: ''
}

const text = ref('');

const textError = ref<string | null>('Text ist erforderlich');

watch(text, (newVal) => {
  if (newVal.trim() === '') {
    textError.value = 'Text ist erforderlich';
  }
  else if (textError.value) {
    textError.value = null;
  }
});

if (!documentStore.currentPageDocument || !('text' in documentStore.currentPageDocument)) {
  router.push('/');
}
else {
  startingVals = {
    id: documentStore.currentPageDocument.id,
    text: documentStore.currentPageDocument.text
  };

  text.value = startingVals.text;

  effect(() => {
    documentStore.inProgressDocument.changed =
      text.value !== '' &&
      text.value !== startingVals.text
      ;
  });
}

watch(saveInProgress, async () => {
  const changeDocument: DocumentChange = {
    type: 'update',
    timestamp: DateTime.utc().toISO(),
    document: startingVals.id,
  };

  if (text.value !== startingVals.text)
    changeDocument.textChange = text.value;

  await documentStore.stageChange(changeDocument);
  await router.push('/documents/' + startingVals.id);
  // TODO: implement saving
})
</script>

<template>
  <v-container>
    <v-textarea
        v-model="text"
        label="Text"
        :error="!!textError"
        :error-messages="textError"
        auto-grow
    />
  </v-container>
</template>

<style scoped>

</style>