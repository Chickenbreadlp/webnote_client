import { useTheme } from "vuetify";

export const useSettingsStore = defineStore(
    'settings',
    () => {
        const runtimeConfig = useRuntimeConfig();
        const vuetifyTheme = useTheme();

        const syncPaused = ref(false);
        const offlineClient = computed(() => {
            return runtimeConfig.public.offlineMode || syncPaused.value;
        });
        const theme = ref('dark');

        watch(theme, (newTheme) => {
            vuetifyTheme.global.name.value = newTheme;
        })

        return { offlineClient, syncPaused, theme };
    },
    {
        persist: true
    }
)