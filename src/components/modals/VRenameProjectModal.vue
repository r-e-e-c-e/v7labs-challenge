<script setup lang="ts">
import VModal from "@/components/VModal.vue";
import VForm from "../VForm.vue";
import VFormField from "../VInput.vue";
import { onBeforeMount, ref, watch } from "vue";
import { useApiKeyStore } from "@/stores/apiKey";
import { useRoute } from "vue-router";
import type { SelectOption } from "@/types";
import { getProjects } from "@/backend/getProjects";
import { renameProject } from "@/backend/renameProject";

const apiKeyStore = useApiKeyStore();
const route = useRoute();

const modalRef = ref<typeof VModal | null>(null);
const selectedProjectId = ref<string>();
const newProjectName = ref<string>();
const projectsOptions = ref<SelectOption[]>([]);
const { workspaceId } = route.params;

watch(selectedProjectId, () => {
  newProjectName.value = projectsOptions.value.find(
    (option) => option.value === selectedProjectId.value
  )?.label;
});

onBeforeMount(async () => {
  if (!workspaceId || typeof workspaceId !== "string") {
    throw new Error("URL param workspaceId is required to create project.");
  }

  const projects = await getProjects({
    workspaceId,
    apiKey: apiKeyStore.token,
  });

  projectsOptions.value = projects.map((project) => {
    return { value: project.id, label: project.name ?? "Untitled Project" };
  });
});

async function handleRenameProjectSubmit(formData: Record<string, any>) {
  if (!workspaceId || typeof workspaceId !== "string") {
    throw new Error("URL param workspaceId is required to create project.");
  }

  const { projectId, newProjectName } = formData;

  const renamedProject = await renameProject({
    apiKey: apiKeyStore.token,
    workspaceId,
    projectId,
    newProjectName: newProjectName?.length > 0 ? newProjectName : null,
  });

  if (renamedProject) {
    window.alert(`Project renamed successfully.`);
  }
}
</script>

<template>
  <VModal v-bind="$props" heading="Rename Project" ref="modalRef">
    <VForm
      :on-submit="handleRenameProjectSubmit"
      @cancel="() => modalRef?.closeModal()"
      @success="() => modalRef?.closeModal()"
      :disabled="!selectedProjectId"
    >
      <VFormField
        label="Project to Rename"
        name="projectId"
        type="select"
        placeholder="Select a project..."
        v-model="selectedProjectId"
        :options="projectsOptions"
        required
      />
      <VFormField
        label="New Project Name"
        name="newProjectName"
        placeholder="Untitled Project"
        v-model="newProjectName"
      />
    </VForm>
  </VModal>
</template>