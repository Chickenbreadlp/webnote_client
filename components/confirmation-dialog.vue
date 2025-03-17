<script setup lang="ts">
const { openDialog } = defineProps<{
  openDialog: boolean;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>();
</script>

<template>
  <v-dialog
    :model-value="openDialog"
    width="70%"
    min-width="200"
    max-width="400"
    persistent
  >
    <v-card>
      <v-card-title class="pt-4">
        <v-icon icon="mdi-alert" class="mr-2" />
        Wirklich löschen?
      </v-card-title>
      <v-card-text class="pa-4 pb-2">
        Soll die Seite wirklich gelöscht werden?<br />
        Der Löschvorgang ist unwiederruflich.
      </v-card-text>
      <v-card-actions class="px-3 pb-3">
        <v-btn
          text="Abbrechen"
          @click="emit('cancel')"
        ></v-btn>

        <v-spacer></v-spacer>

        <v-btn
          text="Löschen"
          color="red"
          @click="emit('confirm')"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>