<script setup lang="ts">
const { openDialog, prefillText, showAddNext } = defineProps<{
  openDialog: boolean;
  prefillText: string;
  showAddNext: boolean;
  showChangedWarning: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'next', value: string): void
  (e: 'save', value: string): void
}>();

const entryText = ref('');

function nextEntry() {
  emit('next', entryText.value);
  entryText.value = '';
}

effect(() => {
  if (openDialog) {
    entryText.value = prefillText;
  }
})
</script>

<template>
  <div>
    <v-dialog
      :model-value="openDialog"
      width="70%"
      min-width="300"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-text class="pa-4 pb-2">
          <v-text-field
            v-model="entryText"
            label="Label"
            :hide-details="true"
          />

          <v-expand-transition>
            <v-alert
              v-show="showChangedWarning"
              type="warning"
              density="compact"
              variant="tonal"
              border="start"
              text="Eintrag von einem anderen Nutzer bearbeitet"
              class="rounded-t-0"
            />
          </v-expand-transition>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Cancel"
            @click="emit('close')"
          ></v-btn>

          <v-spacer></v-spacer>

          <v-btn
            v-if="showAddNext"
            color="light-blue"
            text="Add next"
            @click="nextEntry()"
          ></v-btn>
          <v-btn
            text="Save"
            color="green"
            @click="emit('save', entryText)"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>