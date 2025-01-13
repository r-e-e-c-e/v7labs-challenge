<script setup lang="ts">
import { computed } from "vue";
import {
  useKeyboardShortcuts,
  type KeyboardShortcut,
} from "@/composables/useKeyboardShortcuts";
import { ModalComponents, useModalStore } from "@/stores/modal";

const props = defineProps<{
  workspaceId: string;
  projectId: string;
}>();

const modalStore = useModalStore();

const QUICK_ACCESS_MODAL_SHORTCUT_ID = "quick-access-modal";

const QUICK_ACCESS_MODAL_SHORTCUT: KeyboardShortcut = {
  name: QUICK_ACCESS_MODAL_SHORTCUT_ID,
  cmdCtrl: true,
  key: "K",
  action: () =>
    modalStore.openModal("quick-access-modal", {
      workspaceId: props.workspaceId,
    }),
} as const;

useKeyboardShortcuts([QUICK_ACCESS_MODAL_SHORTCUT]);

// Update modal component whenever modal key changes
const currentModalComponent = computed(() =>
  modalStore.currentModalKey
    ? ModalComponents[modalStore.currentModalKey]
    : null
);
</script>

<template>
  <div class="project-page">
    <router-view />

    <!-- Modal -->
    <component
      v-if="currentModalComponent"
      :is="currentModalComponent"
      v-bind="modalStore.currentModalProps"
      @close="modalStore.closeModal"
    />
  </div>
</template>