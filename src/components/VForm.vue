  <script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  onSubmit: (formData: Record<string, any>) => Promise<any>;
  submitButtonText?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  cancel: [];
  success: [response?: unknown];
  error: [error: unknown];
}>();

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

function getFormData(event: Event): Record<string, any> {
  const formData = new FormData(event.target as HTMLFormElement);
  return Object.fromEntries(formData.entries());
}

async function handleSubmit(event: Event) {
  event.preventDefault();

  isLoading.value = true;
  errorMessage.value = null;

  try {
    const formData = getFormData(event);
    const response = await props.onSubmit(formData); // Call the API
    emit("success", response); // Emit success event with response
  } catch (error) {
    errorMessage.value = (error as Error).message || "An error occurred.";
    emit("error", error); // Emit error event
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <form @submit="handleSubmit" class="form-container" data-test="form">
    <div class="form-fields" data-test="form-fields">
      <slot></slot>
    </div>

    <div class="form-actions">
      <button type="button" @click="emit('cancel')" data-test="cancel-button">
        CANCEL
      </button>
      <button
        class="submit"
        type="submit"
        :disabled="props.disabled || isLoading"
        data-test="submit-button"
      >
        <span v-if="isLoading" data-test="submit-loading">SAVING...</span>
        <span v-else>{{ submitButtonText ?? "SAVE" }}</span>
      </button>
    </div>

    <p
      v-if="errorMessage"
      class="error-message"
      role="alert"
      aria-live="polite"
      data-test="error-message"
    >
      {{ errorMessage }}
    </p>
  </form>
</template>
  
  <style lang="scss" scoped>
.form-container {
  display: flex;
  flex-direction: column;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: var(--modal-padding);

  button {
    height: 46px;
    padding: 0 1rem;
    min-width: 100px;
    border: 2px solid transparent;
    border-radius: 3px;
    background: hsl(0 0 100% / 0%);
    color: hsl(0 0 100% / 90%);
    font-size: 0.8rem;
    font-weight: 900;
    letter-spacing: 1px;
    transition: var(--transition);

    &:hover {
      background: hsl(0 0 100% / 14%);
      text-shadow: var(--text-shadow);
    }

    &:focus-visible {
      outline: none;
      border: 2px solid white;
    }

    &.submit {
      background: hsl(226 90% 56%);
      color: white;

      &:not(:disabled):hover {
        background: hsl(230 100% 50%);
        box-shadow: 0 4px 12px hsl(0 0 0% / 30%);
      }

      &:disabled {
        background-color: #3e3c4f;
        cursor: not-allowed;
      }
    }
  }
}

.error-message {
  color: white;
  margin-top: var(--modal-padding);
  background: red;
  border-radius: 3px;
  padding: 0.6rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: -0.5px;
}
</style>
  