<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";

const router = useRouter();

const userData = ref({
  id: 8713787847198192,
  firstName: "Abdullah",
  lastName: "Hussain",
  email: "akaabdullah00@gmail.com",
  image: "https://randomuser.me/api/portraits/men/76.jpg",
  phoneNo: "03347155206",
  balance: "98368",
});

const handleEdit = () => {
  router.push("/profile");
};
</script>

<template>
  <section
    class="mt-10 bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center"
  >
    <div class="flex items-center gap-4 mb-6 s">
      <img
        :src="userData.image"
        alt="User Avatar"
        class="w-16 h-16 object-cover rounded-full border-2 border-accent"
      />
      <div class="space-y-1">
        <div @click="handleEdit" class="flex cursor-pointer items-center gap-3">
          <h2 class="text-xl font-semibold text-gray-800">
            {{ userData.firstName }} {{ userData.lastName }}
          </h2>
          <Icon icon="mdi:edit" />
        </div>

        <p class="text-sm font-bold">Email : {{ userData.email }}</p>

        <p class="text-sm font-bold">Account No : {{ userData.id }}</p>
      </div>
    </div>
    <div>
      <h2 class="text-3xl text-accent font-semibold">
        Rs :
        {{ userData.balance }}
      </h2>
    </div>
  </section>
</template>
