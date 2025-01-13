import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VForm from '@/components/VForm.vue';

describe('VForm.vue', () => {
    it('emits success event when form is submitted successfully', async () => {
        const mockSubmit = vi.fn().mockResolvedValue({ message: 'Success' });
        const wrapper = mount(VForm, {
            props: {
                onSubmit: mockSubmit,
                submitButtonText: 'Submit',
            },
            slots: {
                default: '<input name="name" value="John Doe" />',
            },
        });

        await wrapper.find('[data-test="form"]').trigger('submit.prevent');
        expect(mockSubmit).toHaveBeenCalledWith({ name: 'John Doe' });
        expect(wrapper.emitted('success')).toBeTruthy();
        expect(wrapper.emitted('success')![0]).toEqual([{ message: 'Success' }]);
    });

    it('emits error event when form submission fails', async () => {
        const mockSubmit = vi.fn().mockRejectedValue(new Error('Failed'));
        const wrapper = mount(VForm, {
            props: {
                onSubmit: mockSubmit,
            },
        });

        await wrapper.find('[data-test="form"]').trigger('submit.prevent');
        expect(wrapper.emitted('error')).toBeTruthy();
        expect(wrapper.find('[data-test="error-message"]')).toBeTruthy();
    });

    it('emits cancel event when cancel button is clicked', async () => {
        const wrapper = mount(VForm);
        await wrapper.find('[data-test="cancel-button"]').trigger('click');
        expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    it('disables submit button when `disabled` prop is true', async () => {
        const wrapper = mount(VForm, {
            props: {
                disabled: true,
                onSubmit: async data => {},
            },
        });

        const submitButton = wrapper.find('[data-test="submit-button"]');
        expect(submitButton.attributes('disabled')).toBe('');
    });

    it('disables submit button and shows loading text when `isLoading` is true', async () => {
        const mockSubmit = vi.fn().mockResolvedValue({});
        const wrapper = mount(VForm, {
            props: {
                onSubmit: mockSubmit,
            },
        });

        const form = wrapper.find('[data-test="form"]');
        await form.trigger('submit.prevent'); // Trigger form submission

        expect(wrapper.find('[data-test="submit-button"]').attributes('disabled')).toBe('');
        expect(wrapper.find('[data-test="submit-loading"]').text()).toBe('SAVING...');
    });

    it('shows default submit button text when `submitButtonText` is not provided', () => {
        const wrapper = mount(VForm);
        expect(wrapper.find('[data-test="submit-button"]').text()).toBe('SAVE');
    });
});
