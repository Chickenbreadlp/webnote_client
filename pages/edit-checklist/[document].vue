<script setup lang="ts">
import { DateTime } from 'luxon';

const router = useRouter();
const documentStore = useDocumentStore();
const settingsStore = useSettingsStore();

const crossedClasses = 'text-medium-emphasis text-decoration-line-through';

const list = ref<ChecklistEntry[]>([]);
const listIds = computed(() => {
  return list.value.map((item) => item.id);
});
const nextId = ref(0);

let documentId = '';

watch(documentStore, () => {
  if (documentStore.currentPageDocument && 'entries' in documentStore.currentPageDocument) {
    list.value = [...documentStore.currentPageDocument.entries];

    let currentEditIndexFound = false;
    for (const entry of list.value) {
      if (entry.id >= nextId.value) {
        nextId.value = entry.id + 1;
      }

      if (entry.id === editDialog.value.editId) {
        currentEditIndexFound = true;
        if (
          editDialog.value.currentEntryText !== entry.text &&
          editDialog.value.open
        ) {
          editDialog.value.showChangedWarning = true;
        }
      }
    }

    if (editDialog.value.open && !currentEditIndexFound) {
      editDialog.value.open = false;
    }
  }
});
if (documentStore.currentPageDocument && 'entries' in documentStore.currentPageDocument) {
  list.value = [...documentStore.currentPageDocument.entries];
  documentId = documentStore.currentPageDocument.id;

  for (const entry of list.value) {
    if (entry.id >= nextId.value) {
      nextId.value = entry.id + 1;
    }
  }
}
else {
  router.push('/');
}

const editDialog = ref({
  open: false,
  addOnTop: false,
  editIndex: -1,
  editId: -1,
  currentEntryText: '',
  showChangedWarning: false
});
function openCreateDialog(addOnTop: boolean) {
  editDialog.value = {
    open: true,
    editIndex: -1,
    editId: -1,
    currentEntryText: '',
    addOnTop,
    showChangedWarning: false
  };
}
function openEditDialog(index: number) {
  editDialog.value = {
    open: true,
    editIndex: index,
    editId: list.value[index].id,
    currentEntryText: list.value[index].text,
    addOnTop: false,
    showChangedWarning: false
  };
}

async function saveTextEntry(entryText: string, dontClose = false) {
  const changeObj: DocumentChange = {
    document: documentId,
    timestamp: DateTime.utc().toISO(),
    type: 'update'
  }

  if (editDialog.value.editIndex >= 0) {
    changeObj.entryChange = {
      id: editDialog.value.editId,
      newText: entryText
    };
  }
  else if (editDialog.value.addOnTop) {
    const entryId = nextId.value++;
    changeObj.entryAdd = {
      id: entryId,
      crossedState: false,
      text: entryText,
      atTop: true
    }
  }
  else {
    const entryId = nextId.value++;
    changeObj.entryAdd = {
      id: entryId,
      crossedState: false,
      text: entryText,
      atTop: false
    }
  }

  await documentStore.stageChange(changeObj);

  if (!dontClose) {
    editDialog.value.open = false;
  }
}
async function orderChanged() {
  const changeObj: DocumentChange = {
    document: documentId,
    timestamp: DateTime.utc().toISO(),
    type: 'update',
    entryReorder: listIds.value
  };
  await documentStore.stageChange(changeObj);
}
async function removeEntry(index: number) {
  const changeObj: DocumentChange = {
    document: documentId,
    timestamp: DateTime.utc().toISO(),
    type: 'update',
    entryRemove: list.value[index].id
  };
  await documentStore.stageChange(changeObj);
}
</script>

<template>
  <v-container fluid>
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

      <draggable
        v-model="list"
        handle=".handle"
        item-key="id"
        @end="orderChanged()"
      >
        <template #item="{ element, index }">
          <div>
            <v-list-item
              @click.stop="openEditDialog(index)"
            >
              <template v-if="list.length > 1 && !settingsStore.offlineClient" v-slot:prepend>
                <v-icon class="handle" icon="mdi-unfold-more-horizontal" />
              </template>

              <v-list-item-title
                v-text="element.text"
              />

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
        :show-changed-warning="editDialog.showChangedWarning"
        @close="editDialog.open = false"
        @next="saveTextEntry($event, true)"
        @save="saveTextEntry($event)"
      />
    </v-list>
  </v-container>
</template>
