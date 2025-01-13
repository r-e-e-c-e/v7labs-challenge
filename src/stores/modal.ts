import { defineAsyncComponent, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { useApiKeyStore } from './apiKey';

// List of all modals in the app by key mapped to lazy loaded import of the component.
export const ModalComponents = {
    'quick-access-modal': defineAsyncComponent(() => import('@/components/modals/VQuickAccessModal.vue')),
    'create-project-modal': defineAsyncComponent(() => import('@/components/modals/VCreateProjectModal.vue')),
    'rename-project-modal': defineAsyncComponent(() => import('@/components/modals/VRenameProjectModal.vue')),
} as const;

export type ModalKey = keyof typeof ModalComponents; // Dynamic type based on the key from the list of all modals above.

export const useModalStore = defineStore('modal', () => {
    const currentModalKey = ref<ModalKey | null>(null);
    const currentModalProps = ref<Record<string, any> | null>(null);
    const apiKeyStore = useApiKeyStore();

    /**
     * Disable body scroll if there is an active modal.
     * Re-enable body scroll on modal close.
     */
    watch(currentModalKey, newCurrentModalKey => {
        enableBodyScroll(!newCurrentModalKey);
    });

    /**
     * Close modal on auth invalidation.
     */
    watch(
        () => apiKeyStore.isValid,
        newIsValid => {
            if (newIsValid === false) {
                closeModal();
            }
        }
    );

    /**
     * Open a modal by its key.
     * @param modalKey The key of the modal to open.
     * @param props Optional: List of props to pass to component once loaded.
     */
    function openModal(modalKey: ModalKey, props: Record<string, any> = {}) {
        currentModalKey.value = modalKey;
        currentModalProps.value = props;
    }

    /**
     * Close the currently open modal.
     */
    function closeModal() {
        currentModalKey.value = null;
        currentModalProps.value = null;
    }

    /**
     * Enables or disables scrolling on the body element.
     * @param enable Whether to allow the body element to scroll.
     */
    function enableBodyScroll(enable: boolean) {
        document.body.classList.toggle('no-scroll', !enable);
    }

    return { currentModalKey, currentModalProps, openModal, closeModal };
});
