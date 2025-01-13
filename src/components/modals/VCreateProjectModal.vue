<script setup lang="ts">
import VModal from "@/components/VModal.vue";
import VForm from "../VForm.vue";
import VFormField from "../VInput.vue";
import { createProject } from "@/backend/createProject";
import { ref } from "vue";
import { useApiKeyStore } from "@/stores/apiKey";
import { useRoute } from "vue-router";

const apiKeyStore = useApiKeyStore();
const route = useRoute();

const modalRef = ref<typeof VModal | null>(null);
const nameInputRef = ref<HTMLInputElement | null>(null);

async function handleCreateProjectSubmit(formData: Record<string, any>) {
  const { workspaceId } = route.params;

  if (!workspaceId || typeof workspaceId !== "string") {
    throw new Error("URL param workspaceId is required to create project.");
  }

  const { projectName } = formData;

  const createdProject = await createProject({
    apiKey: apiKeyStore.token,
    workspaceId,
    projectName: projectName?.length > 0 ? projectName : null,
  });

  if (createdProject) {
    window.alert(`Project created successfully.`);
  }
}
</script>

<template>
  <VModal v-bind="$props" heading="Create Project" ref="modalRef">
    <VForm
      :on-submit="handleCreateProjectSubmit"
      @cancel="() => modalRef?.closeModal()"
      @success="() => modalRef?.closeModal()"
    >
      <VFormField
        label="Project Name"
        name="projectName"
        placeholder="Untitled Project"
      />
    </VForm>
  </VModal>
</template>