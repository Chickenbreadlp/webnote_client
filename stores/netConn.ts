import { WSMessageTypes, WSReadyState } from '~/utils/types';

export const useNetConn = defineStore(
    'netConn',
    () => {
        const requestURL = useRequestURL();
        const runtimeConfig = useRuntimeConfig();
        const { syncPaused } = storeToRefs(useSettingsStore());

        const callbacks = ref<{ id: number, resolve: (val: boolean) => void, timeoutId: NodeJS.Timeout }[]>([]);
        const lastChangeTimestamp = ref<string | null>(null);

        let initialFetchDone = false;

        let ws: WebSocket | null = null;
        const wsConnectionStatus = ref<WSReadyState>(checkConnectionStatus());
        let wsStatusInterval: NodeJS.Timeout | null = null;
        let wsRestartTimeout: NodeJS.Timeout | null = null;

        let updateDocList: (newList: DocumentPage[]) => void;
        let applyDocChange: (change: DocumentChange) => void;
        let getStagedChanges: () => DocumentChange[];
        let clearStagedChanges: () => void;

        function createStoreLink(
            _updateDocList: (newList: DocumentPage[]) => void,
            _applyDocChange: (change: DocumentChange) => void,
            _getStagedChanges: () => DocumentChange[],
            _clearStagedChanges: () => void
        ) {
            updateDocList = _updateDocList;
            applyDocChange = _applyDocChange;
            getStagedChanges = _getStagedChanges;
            clearStagedChanges = _clearStagedChanges;
        }

        function checkConnectionStatus(): WSReadyState {
            if (ws) {
                return ws.readyState;
            }
            return WSReadyState.CLOSED;
        }
        function setupWebsocketListeners(ws: WebSocket) {
            ws.onmessage = (event: MessageEvent) => {
                let success = false;
                try {
                    const data = JSON.parse(event.data);
                    console.log(data);
                    switch (data.msgType) {
                        case 'change': {
                            if (data.change && data.change.timestamp) {
                                lastChangeTimestamp.value = data.change.timestamp;
                                applyDocChange(data.change);
                                success = true;
                            }
                            break;
                        }
                        case 'fetchList': {
                            if (data.list && data.lastTimestamp) {
                                updateDocList(data.list);
                                lastChangeTimestamp.value = data.lastTimestamp;
                                success = true;
                            }
                            break;
                        }
                        case 'offlineChangeSync': {
                            if (data.success) {
                                clearStagedChanges();
                                success = true;
                            }
                            else {
                                syncPaused.value = true;
                            }
                        }
                    }

                    const callback = callbacks.value.find(callback => callback.id === data.callbackId);
                    if (callback) {
                        clearTimeout(callback.timeoutId);
                        callback.resolve(success);
                        callbacks.value.splice(callbacks.value.indexOf(callback), 1);
                    }
                }
                catch(e) {}
            }
        }
        function createWebSocket(startTimeout = 0) {
            if (!runtimeConfig.public.offlineMode) {
                if (wsStatusInterval) clearInterval(wsStatusInterval);

                if (callbacks.value.length > 0) {
                    while (callbacks.value.length > 0) {
                        const callback = callbacks.value.shift();
                        if (callback) {
                            clearTimeout(callback.timeoutId);
                            callback.resolve(false);
                        }
                    }
                }

                wsRestartTimeout = setTimeout(() => {
                    wsRestartTimeout = null;
                    initialFetchDone = false;
                    ws = new WebSocket(`ws://${requestURL.hostname}:${runtimeConfig.public.apiPort}`);
                    setupWebsocketListeners(ws);
                    console.log('WS created');
                    wsConnectionStatus.value = checkConnectionStatus();

                    wsStatusInterval = setInterval(() => {
                        wsConnectionStatus.value = checkConnectionStatus();

                        if (!initialFetchDone && wsConnectionStatus.value === WSReadyState.OPEN) {
                            initialFetchDone = true;
                            const stagedChanges = getStagedChanges();
                            if (stagedChanges.length === 0) {
                                postWithCallback(WSMessageTypes.FETCH_LIST);
                            }
                            else {
                                postWithCallback(
                                    WSMessageTypes.OFFLINE_CHANGE_SYNC,
                                    {
                                        changes: stagedChanges,
                                        lastTimestamp: lastChangeTimestamp.value
                                    },
                                    true
                                );
                            }
                        }

                        if (wsConnectionStatus.value === WSReadyState.CLOSED && import.meta.client) {
                            const restartTimeout = Math.ceil(4000 + (Math.random() * 2000));
                            console.log(restartTimeout);
                            createWebSocket(restartTimeout);
                        }
                    }, 1000);
                }, startTimeout);
            }
        }
        function closeWebSocket() {
            if (wsStatusInterval) clearInterval(wsStatusInterval);
            if (wsRestartTimeout) clearTimeout(wsRestartTimeout);
            if (ws) ws.close();
        }

        function postWithCallback(
            msgType: WSMessageTypes,
            payload: { [key: string]: any } = {},
            killWsOnTimeout = false
        ): Promise<boolean> {
            return new Promise((resolve) => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                    let callbackId = 0;
                    if (callbacks.value.length > 0) {
                        callbackId = callbacks.value[callbacks.value.length - 1].id + 1;
                    }

                    ws.send(JSON.stringify({ msgType, callbackId, ...payload }));

                    callbacks.value.push({
                        id: callbackId,
                        resolve: (val: boolean) => { resolve(val); },
                        timeoutId: setTimeout(
                            () => {
                                resolve(false);
                                const callback = callbacks.value.find(callback => callback.id === callbackId);
                                if (callback) {
                                    callbacks.value.splice(callbacks.value.indexOf(callback), 1);
                                }
                                console.log(killWsOnTimeout);
                                if (killWsOnTimeout) syncPaused.value = true;
                            }, 5000)
                    });
                }
                else {
                    resolve(false);
                }
            });
        }

        if (import.meta.server) {
            // SSR
        }
        else if (import.meta.client) {
            // Client
            if (!syncPaused.value)
                createWebSocket();
        }

        watch(syncPaused, (newVal) => {
            if (newVal) {
                closeWebSocket();
            }
            else {
                createWebSocket();
            }
        })

        return { wsConnectionStatus, wsStatusInterval, createStoreLink, postWithCallback, callbacks, lastChangeTimestamp };
    },
    {
        persist: {
            storage: piniaPluginPersistedstate.localStorage(),
            pick: [
                'lastChangeTimestamp'
            ]
        }
    }
);