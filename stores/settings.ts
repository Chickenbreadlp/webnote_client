import { useTheme } from "vuetify";

export const useSettingsStore = defineStore(
    'settings',
    () => {
        const runtimeConfig = useRuntimeConfig()
        const vuetifyTheme = useTheme();

        const offlineClient = computed(() => {
            return runtimeConfig.public.offlineMode;
        });
        const theme = ref('dark');

        watch(theme, (newTheme) => {
            vuetifyTheme.global.name.value = newTheme;
        })

        return { offlineClient, theme };
    },
    {
        persist: true
    }
)