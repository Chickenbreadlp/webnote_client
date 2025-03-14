<script setup lang="ts">
import { useDisplay } from "vuetify";

const { xs, smAndDown } = useDisplay()

const navOpen = ref(true);
</script>

<template>
  <NuxtLayout>
    <v-app>
      <v-layout>
        <v-navigation-drawer v-model="navOpen" mobile-breakpoint="sm">
          <conn-status></conn-status>
          <v-divider></v-divider>
          <nav-list></nav-list>
        </v-navigation-drawer>

        <v-app-bar color="primary">
          <template v-slot:prepend v-if="xs">
            <v-app-bar-nav-icon @click.stop="navOpen = !navOpen"></v-app-bar-nav-icon>
          </template>

          <v-app-bar-title>Current Page</v-app-bar-title>

          <template v-slot:append>
            <v-btn icon="mdi-pencil"></v-btn>
            <v-btn icon>
              <v-icon icon="mdi-dots-vertical" />

              <v-menu activator="parent">
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-delete" />
                    </template>

                    <v-list-item-title v-text="'Delete'" />
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-cog" />
                    </template>

                    <v-list-item-title v-text="'Settings'" />
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </template>
        </v-app-bar>

        <v-main class="d-flex align-center justify-center">
          <NuxtPage />
        </v-main>
      </v-layout>
    </v-app>
  </NuxtLayout>
</template>