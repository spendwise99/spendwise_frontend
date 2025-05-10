<script setup lang="ts">
import { ref, computed } from "vue";
import CInput from "../components/CInput.vue";
import staticData from "../store/utils";
import CButton from "../components/CButton.vue";
import BackButton from "../components/BackButton.vue";
import { useUserStore } from "../store/userInfo";
import { api, notify, uploadImage } from "../store/helpers";

interface UserFormData {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  imageUrl: string;
  age: number;
}

const userSession = useUserStore();

const originalData = computed<UserFormData>(() => ({
  userId: userSession.user?.userId,
  firstName: userSession.user?.firstName || "",
  lastName: userSession.user?.lastName || "",
  email: userSession.user?.email || "",
  phoneNumber: userSession.user?.phoneNumber || "",
  password: "",
  imageUrl: userSession.user?.imageUrl || "",
  age: userSession.user?.age || 0,
}));

const formData = ref<UserFormData>({ ...originalData.value });

const userName = computed(() => {
  return `${formData.value.firstName} ${formData.value.lastName}`.trim();
});

const fileInputRef = ref<HTMLInputElement | null>(null);

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    uploadImage(file)
      .then(() => {
        // Update the image URL if needed
        // You might want to fetch the new URL from the response
      })
      .catch((error) => {
        console.error("Image upload failed:", error);
      });
  }
}

function triggerFilePicker() {
  fileInputRef.value?.click();
}

const isFormChanged = computed(() => {
  return (
    formData.value.firstName !== originalData.value.firstName ||
    formData.value.lastName !== originalData.value.lastName ||
    formData.value.phoneNumber !== originalData.value.phoneNumber ||
    formData.value.password !== originalData.value.password ||
    formData.value.age !== originalData.value.age
  );
});

const isLoading = ref(false);

const handleUserUpdate = async () => {
  isLoading.value = true;
  try {
    const payload = {
      userName: userName.value,
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      phoneNumber: formData.value.phoneNumber,
      age: formData.value.age,
    };

    const updatedUser = await api.patch("/api/users", payload);
    console.log(updatedUser);
    notify("User Profile Updated Successfully");
    userSession.updateUserInfo();
  } catch (error) {
    notify("Error updating Profile", "error");
  } finally {
    isLoading.value = false;
  }
};
console.log(userSession.token);
</script>
<template>
  <main class="flex items-center justify-center h-screen">
    <section
      class="bg-transparent border border-accent p-5 rounded-lg flex flex-col gap-4 items-center"
    >
      <!-- Header Fieldset -->
      <fieldset
        class="border border-gray-300 rounded-md px-4 py-2 w-full max-w-2xl"
      >
        <legend class="text-accent font-semibold px-2">Profile</legend>
        <h2 class="text-xl font-semibold text-accent text-center">
          Edit Profile
        </h2>
      </fieldset>

      <!-- Editable Image -->
      <div class="relative cursor-pointer" @click="triggerFilePicker">
        <img
          :src="userSession.user?.imageUrl || staticData.userImage"
          class="w-24 h-24 rounded-full object-cover object-top border-2 border-accent"
        />
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageUpload"
        />
        <div
          class="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center text-white text-sm opacity-0 hover:opacity-100 transition"
        >
          Change
        </div>
      </div>

      <!-- Form Fieldset -->
      <form @submit.prevent="handleUserUpdate" class="w-full max-w-2xl mt-4">
        <fieldset class="border border-gray-300 rounded-md p-4">
          <legend class="text-accent font-medium px-2">User Information</legend>
          <div class="grid grid-cols-2 gap-5">
            <CInput
              icon="mdi:user"
              placeholder="First name"
              type="text"
              v-model="formData.firstName"
            />
            <CInput
              icon="mdi:user"
              placeholder="Last name"
              type="text"
              v-model="formData.lastName"
            />
            <CInput
              icon="mdi:email"
              placeholder="Email"
              type="text"
              v-model="formData.email"
              disabled
            />
            <CInput
              icon="mdi:phone"
              placeholder="Phone Number"
              type="text"
              v-model="formData.phoneNumber"
            />
            <CInput
              icon="mdi:cake"
              placeholder="Age"
              type="number"
              v-model.number="formData.age"
            />

            <div class="col-span-2">
              <CButton
                type="submit"
                :disabled="!isFormChanged"
                class="w-full opacity-100 disabled:opacity-50"
                :loading="isLoading"
              >
                Update Info
              </CButton>
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  </main>
</template>
