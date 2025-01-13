<script setup lang="ts">
import VModal from "@/components/VModal.vue";
import { useModalStore } from "@/stores/modal";
import { computed, readonly, ref, watch } from "vue";
import VInput from "../VInput.vue";
import type { GridOption } from "@/types";

const props = defineProps<{
  workspaceId: string;
}>();

const modalStore = useModalStore();

const searchText = ref("");
const searchActionsInputRef = ref<HTMLInputElement | null>(null);
const options = ref<GridOption[]>([
  {
    label: "Create Project",
    action: () => modalStore.openModal("create-project-modal"),
  },
  {
    label: "Rename Project",
    action: () => modalStore.openModal("rename-project-modal"),
  },
  {
    label: "Start Chat",
  },
  {
    label: "Add Property",
  },
]);

const filteredOptions = computed<GridOption[]>(() =>
  searchText.value.length > 0
    ? options.value.filter((option) => {
        const regex = new RegExp(`\\b${searchText.value.toLowerCase()}`);
        return regex.test(option.label.toLowerCase());
      })
    : options.value
);

function focusSearchInput() {
  searchActionsInputRef.value?.focus();
}
</script>

<template>
  <VModal heading="Quick Access" :on-show="focusSearchInput">
    <VInput
      v-model="searchText"
      ref="searchActionsInputRef"
      name="searchActions"
      placeholder="Search actions..."
    />

    <p class="no-results" v-if="filteredOptions.length === 0">
      No actions for search.
    </p>

    <section class="suggestions" v-if="filteredOptions.length > 0">
      <h3 class="section-heading">Actions</h3>
      <ul class="options-grid">
        <li
          v-for="option in filteredOptions"
          class="option"
          :key="option.label"
        >
          <button :disabled="!option.action" @click="option.action?.()">
            {{ option.label }}
          </button>
        </li>
      </ul>
    </section>
  </VModal>
</template>

<style lang="scss" scoped>
.search-actions-input {
  width: 100%;
  height: 60px;
  padding: 0 1rem;
  border-radius: 6px;
  border: 2px solid hsl(0 0 100% / 8%);
  background: linear-gradient(to bottom, hsl(0 0 80% / 5%), hsl(0 0 80% / 8%));
  box-shadow: 0 3px 10px hsl(0 0 0% / 30%);
  color: white;

  &::placeholder {
    font-style: italic;
    color: hsl(0 0 100% / 60%);
    text-shadow: var(--text-shadow);
  }
}

.no-results {
  color: white;
  margin-top: 0.8rem;
  color: hsl(0 0 100% / 80%);
}

section.suggestions {
  margin-top: 1.5rem;
  color: white;

  .section-heading {
    margin-bottom: 0.6rem;
  }
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  list-style: none;
  padding: 0;

  .option {
    display: flex;

    button {
      display: flex;
      flex: 1 1 auto;
      align-items: center;
      justify-content: center;
      height: 50px;
      border-radius: 3px;
      background: hsl(0 0 100% / 80%);
      color: black;
      font-weight: 600;
      letter-spacing: -0.5px;
      box-shadow: 0 2px 10px hsl(0 0 0% / 30%);
      border: 2px solid white;
      text-shadow: var(--text-shadow-light);
      transition: var(--transition);

      &:hover:not(:disabled),
      &:focus {
        background: hsl(0 0 100% / 100%);
        color: blue;
      }

      &:disabled {
        cursor: not-allowed;
      }
    }
  }
}
</style>