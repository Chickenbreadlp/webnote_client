export const useNetConn = defineStore(
    'netConn',
    () => {
        const requestURL = useRequestURL();
        const runtimeConfig = useRuntimeConfig();

        if (import.meta.server) {
            //const ws = new WebSocket(`ws://${requestURL.hostname}:${runtimeConfig.public.apiPort}`);
        }

        return {};
    }
);