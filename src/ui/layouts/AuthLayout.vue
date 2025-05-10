<script setup lang="ts"></script>
<template>
  <main class="flex items-center justify-center bg- h-screen">
    <section class="w-full">
      <slot />
    </section>
  </main>
</template>

<!-- 
<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-50">
    <div
      class="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl"
    >
      <section class="w-full bgp-10">
        <div class="space-y-6 text-center">
          <h2 class="text-text text-5xl font-bold">Spend Wise</h2>
          <h4 class="text-dark text-lg max-w-2xl mx-auto">
            Secure, fast, and user-friendly banking at your fingertips. Open an
            account, manage your finances, and track your transactions—all in
            one place.
          </h4>
        </div>
      </section>

      <section
        class="w-full md:flex-1 bg-primary h-full md:h-auto flex items-center justify-center p-10"
      >
        <slot />
      </section>
    </div>
  </main>
</template> -->
