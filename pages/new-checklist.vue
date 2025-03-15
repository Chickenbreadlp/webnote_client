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

const crossedClasses = 'text-medium-emphasis text-decoration-line-through';

const title = ref('');
const list = ref<ChecklistEntry[]>([]);
const nextId = ref(0);

const titleError = ref<string | null>('Seitentitel ist erforderlich');

watch(title, (newVal) => {
  if (documentStore.documents.find(document => document.id === generatePageId(newVal))) {
    titleError.value = 'Dieser Seitentitel kann nicht verwendet werden';
    documentStore.inProgressDocument.savable = false;
  }
  else if (newVal.trim() === '') {
    titleError.value = 'Seitentitel ist erforderlich';
    documentStore.inProgressDocument.savable = false;
  }
  else if (titleError.value) {
    titleError.value = null;
    documentStore.inProgressDocument.savable = true;
  }
});
effect(() => {
  documentStore.inProgressDocument.changed = title.value !== '' && list.value.length > 0;
});

const editDialog = ref({
  open: false,
  addOnTop: false,
  editIndex: -1,
  currentEntryText: ''
});
function openCreateDialog(addOnTop: boolean) {
  editDialog.value = {
    open: true,
    editIndex: -1,
    currentEntryText: '',
    addOnTop
  };
}
function openEditDialog(index: number) {
  editDialog.value = {
    open: true,
    editIndex: index,
    currentEntryText: list.value[index].text,
    addOnTop: false
  };
}

function saveTextEntry(entryText: string, dontClose = false) {
  if (editDialog.value.editIndex >= 0) {
    list.value[editDialog.value.editIndex].text = entryText;
  }
  else if (editDialog.value.addOnTop) {
    list.value.unshift({
      id: nextId.value++,
      text: entryText,
      crossed: false
    });
  }
  else {
    list.value.push({
      id: nextId.value++,
      text: entryText,
      crossed: false
    });
  }

  if (!dontClose) {
    editDialog.value.open = false;
  }
}
function removeEntry(index: number) {
  list.value.splice(index, 1);
}

watch(saveInProgress, async () => {
  const newDocument: DocumentChange = {
    type: 'create',
    timestamp: DateTime.utc().toISO(),
    document: generatePageId(title.value),
    title: title.value,
    content: list.value
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
      hide-details="auto"
      class="mb-4"
    />

    <v-list bg-color="transparent" class="mx-n4 non-selectable">
      <v-divider />
      <template v-if="list.length > 0">
        <v-list-item @click.stop="openCreateDialog(true)">
          <template v-slot:prepend>
            <v-icon icon="mdi-plus" />
          </template>

          <v-list-item-title>
            Eintrag hinzufügen
          </v-list-item-title>
        </v-list-item>
        <v-divider />
      </template>

      <draggable v-model="list" handle=".handle" item-key="id">
        <template #item="{ element, index }">
          <div>
            <v-list-item
              :class="element.crossed ? crossedClasses : ''"
              @click.stop="openEditDialog(index)"
            >
              <template v-if="list.length > 1" v-slot:prepend>
                <v-icon class="handle" icon="mdi-unfold-more-horizontal" />
              </template>

              <v-list-item-title v-text="element.text" />

              <template v-slot:append>
                <v-btn
                  color="red"
                  variant="text"
                  icon="mdi-delete"
                  @click.stop="removeEntry(index)"
                />
              </template>
            </v-list-item>
            <v-divider />
          </div>
        </template>
      </draggable>

      <v-list-item @click.stop="openCreateDialog(false)">
        <template v-slot:prepend>
          <v-icon icon="mdi-plus" />
        </template>

        <v-list-item-title>
          Eintrag hinzufügen
        </v-list-item-title>
      </v-list-item>
      <v-divider />

      <edit-checklist-entry
        :open-dialog="editDialog.open"
        :prefill-text="editDialog.currentEntryText"
        :show-add-next="editDialog.editIndex === -1"
        @close="editDialog.open = false"
        @next="saveTextEntry($event, true)"
        @save="saveTextEntry($event)"
      />
    </v-list>
  </v-container>
</template>

<style scoped>
.non-selectable {
  user-select: none;
}
</style>