import { type DocumentChange, type DocumentPage, WSMessageTypes } from '~/utils/types';

export const useDocumentStore = defineStore(
    'documents',
    () => {
        const runtimeConfig = useRuntimeConfig();
        const route = useRoute();
        const netConn = useNetConn();

        const inProgressDocument = ref({
            savable: false,
            changed: false
        });
        const saveInProgress = ref(false);

        const documents = ref<DocumentPage[]>([]);
        const stagedChanges = ref<DocumentChange[]>([]);

        const currentPageDocument = computed(() => {
            const id = route.params.document;

            if (typeof id === 'string') {
                return documents.value.find(document => document.id === id);
            }

            return undefined;
        })

        async function stageChange(change: DocumentChange) {
            if (runtimeConfig.public.offlineMode) {
                applyChange(change);
            }
            else {
                let changeCommitted = false;
                if (netConn.wsConnectionStatus === WSReadyState.OPEN) {
                    changeCommitted = await netConn.postWithCallback(WSMessageTypes.CHANGE, { change });
                }

                if (!changeCommitted && !(change.type === 'update' && 'entryReorder' in change)) {
                    stagedChanges.value.push(change);
                    applyChange(change);
                }
            }
        }
        function applyChange(change: DocumentChange) {
            switch (change.type) {
                case 'create':
                    if (Array.isArray(change.content)) {
                        documents.value.push({
                            id: change.document,
                            title: change.title,
                            entries: change.content
                        })
                    }
                    else {
                        documents.value.push({
                            id: change.document,
                            locked: false,
                            title: change.title,
                            text: change.content
                        });
                    }
                    break;
                case 'update':
                    const documentId = documents.value.findIndex(document => document.id === change.document);
                    if (documentId !== -1) {
                        const document = documents.value[documentId];

                        if (change.textChange && 'text' in document) document.text = change.textChange;
                        if (change.entryChange && 'entries' in document) {
                            const entryChange = change.entryChange;
                            const entryIndex = document.entries.findIndex(entry => entry.id === entryChange.id);

                            if (entryIndex !== -1) {
                                const entry = document.entries[entryIndex];

                                if (entryChange.newText)
                                    entry.text = entryChange.newText;
                                if (entryChange.newCrossedState === true || entryChange.newCrossedState === false)
                                    entry.crossed = entryChange.newCrossedState;
                            }
                        }
                        if (change.entryAdd && 'entries' in document) {
                            if (change.entryAdd.atTop) {
                                document.entries.unshift({
                                    id: change.entryAdd.id,
                                    text: change.entryAdd.text,
                                    crossed: change.entryAdd.crossedState
                                });
                            }
                            else {
                                document.entries.push({
                                    id: change.entryAdd.id,
                                    text: change.entryAdd.text,
                                    crossed: change.entryAdd.crossedState
                                });
                            }
                        }
                        if (typeof change.entryRemove === 'number' && 'entries' in document) {
                            const index = document.entries.findIndex(entry => entry.id === change.entryRemove);
                            if (index !== -1) {
                                document.entries.splice(index, 1);
                            }
                        }
                        if (change.entryReorder && 'entries' in document) {
                            const newEntryOrder = [];
                            for (const entryId of change.entryReorder) {
                                const entry = document.entries.find(entry => entry.id === entryId);
                                if (entry) {
                                    newEntryOrder.push(entry);
                                }
                            }
                            document.entries = newEntryOrder;
                        }
                    }
                    break;
                case 'delete':
                    documents.value = documents
                        .value
                        .filter(document => document.id !== change.document);
                    break;
            }
        }

        netConn.createStoreLink(
            (docs: DocumentPage[]) => documents.value = docs,
            applyChange,
            () => ([...stagedChanges.value]),
            () => stagedChanges.value = []
        );

        return { documents, currentPageDocument, stagedChanges, stageChange, inProgressDocument, saveInProgress };
    },
    {
        persist: {
            storage: piniaPluginPersistedstate.localStorage(),
            pick: [
                'documents',
                'stagedChanges'
            ]
        }
    }
)