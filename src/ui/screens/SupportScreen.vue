<script setup lang="ts">
import { ref } from "vue";
import BackButton from "../components/BackButton.vue";
import CInput from "../components/CInput.vue";
import {
  api,
  notify,
  validateForm,
  type ValidationRules,
} from "../store/helpers";

const formData = ref({
  email: "",
  subject: "",
  message: "",
});

const isLoading = ref(false);
const rules: ValidationRules = {
  email: { required: true, type: "email" },
  subject: { required: true, minLength: 3 },
  message: { required: true, minLength: 10 },
};
const handleSFormSubmit = async () => {
  const { valid, errors } = validateForm(formData.value, rules);

  if (!valid) {
    const firstError = Object.values(errors)[0] as string;
    notify(firstError, "error");
    return;
  }

  isLoading.value = true;

  try {
    await api.post("/api/contact", formData.value);
    notify("Query Submitted Successfully", "success");
    formData.value.email = "";
    formData.value.subject = "";
    formData.value.message = "";
  } catch (error) {
    notify("Unable to send Query", "error");
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <main class="flex items-center justify-center h-screen">
    <!-- <BackButton /> -->
    <form
      @submit.prevent="handleSFormSubmit"
      class="bg-primary shadow-xl p-10 w-1/3 rounded-xl space-y-5"
    >
      <fieldset class="space-y-5 border border-white/30 rounded-md p-4">
        <legend class="text-lg font-bold px-2 text-white">Support Form</legend>

        <h2 class="text-white text-center">
          Please provide your contact email, a short subject, and a detailed
          message so our team can assist you better.
        </h2>

        <div>
          <label class="block mb-1 text-accent font-semibold"
            >Email Address</label
          >
          <CInput
            type="email"
            v-model="formData.email"
            placeholder="e.g. yourname@example.com"
            icon="mdi:email"
            width="w-full"
          />
        </div>

        <div>
          <label class="block mb-1 text-accent font-semibold">Subject</label>
          <CInput
            type="text"
            v-model="formData.subject"
            placeholder="Brief Subject"
            icon="mdi:card-text"
            width="w-full"
          />
        </div>

        <div>
          <label class="block mb-1 text-accent font-semibold">Message</label>
          <textarea
            v-model="formData.message"
            class="h-40 w-full border border-gray-300 p-2 rounded-md text-accent resize-none"
            placeholder="Describe your issue or question in detail..."
          />
        </div>

        <button
          :disabled="isLoading"
          class="bg-blue font-semibold w-full h-10 text-white rounded-md hover:bg-midDark transition"
          type="submit"
        >
          {{ isLoading ? "Sending Query to CSR Team" : "Submit" }}
        </button>
      </fieldset>
    </form>
  </main>
</template>
