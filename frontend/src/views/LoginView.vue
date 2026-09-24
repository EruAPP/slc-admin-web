<script setup>
import { computed, ref } from "vue";
import AnimatedCharacters from "../components/login/AnimatedCharacters.vue";
import InteractiveHoverButton from "../components/login/InteractiveHoverButton.vue";

import { useRouter } from "vue-router";
import { login } from "../services/authService.js";
import "../assets/login.css";

const form = ref({
  username: "",
  password: "",
  remember: false,
});

const router = useRouter();
const showPassword = ref(false);
const isTyping = ref(false);
const isLoading = ref(false);
const error = ref("");

const usernameError = computed(() => {
  if (!form.value.username) return "";
  const ok = /^[a-zA-Z0-9_.]{3,}$/.test(form.value.username);
  return ok
    ? ""
    : "Username must be at least 3 characters and contain only letters, numbers, underscores, or dots.";
});

const passwordError = computed(() => {
  if (!form.value.password) return "";
  return form.value.password.length >= 6
    ? ""
    : "Password must be at least 6 characters.";
});

const onSubmit = async (e) => {
  e.preventDefault();
  error.value = "";

  if (!form.value.username || usernameError.value) {
    error.value = usernameError.value || "Please enter a valid email address.";
    return;
  }

  if (!form.value.password || passwordError.value) {
    error.value =
      passwordError.value || "Password must be at least 6 characters.";
    return;
  }

  isLoading.value = true;
  try {
    const res = await login(username.value, password.value);
    if (res.success) {
      router.push("/dashboard");
    } else {
      error.value = res.message;
    }
  } catch (err) {
    error.value =
      err.response?.data?.message || "Terjadi kesalahan pada server";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="login-page login-shell min-h-screen max-h-screen overflow-hidden grid lg:grid-cols-2"
  >
    <div
      class="relative hidden lg:flex flex-col justify-between p-12 text-white dark:text-gray-900"
    >
      <div class="relative z-20">
        <a
          href="#"
          class="flex items-center gap-2 text-lg font-semibold tracking-wide"
        >
          <img
            src="../assets/logo.png"
            alt="CareerCompass logo"
            width="250"
            height="250"
            class="bg-white/10 backdrop-blur-sm p-1 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.14)]"
          />
        </a>
      </div>

      <div class="relative z-20 flex items-end justify-center h-[500px]">
        <AnimatedCharacters
          :is-typing="isTyping"
          :show-password="showPassword"
          :password-length="form.password.length"
        />
      </div>

      <div
        class="relative z-20 flex items-center gap-8 text-sm text-white/70 dark:text-gray-700"
      >
        <!-- <a
          href="#"
          class="hover:text-white dark:hover:text-black transition-colors"
          >Privacy Policy</a -->
        >
        <!-- <a
          href="#"
          class="hover:text-white dark:hover:text-black transition-colors"
          >Terms of Service</a
        > -->
      </div>

      <div class="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]"
      />
      <div
        class="absolute top-1/4 right-1/4 size-64 bg-gray-400/20 dark:bg-gray-300/30 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]"
      />
      <div
        class="absolute bottom-1/4 left-1/4 size-96 bg-gray-300/20 dark:bg-gray-200/20 rounded-full blur-3xl animate-[float_16s_ease-in-out_infinite_reverse]"
      />
    </div>

    <div
      class="relative flex items-center justify-center p-6 sm:p-8 bg-background"
    >
      <div class="login-card w-full max-w-[420px]">
        <div
          class="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-10"
        >
          <img
            src="../assets/logo.png"
            alt="CareerCompass logo"
            width="250"
            height="250"
            class="dark:bg-white dark:p-1 dark:rounded-md"
          />
        </div>

        <div class="text-center mb-10">
          <p class="text-xs uppercase tracking-[0.32em] text-primary/75 mb-3">
            Sign in
          </p>
          <h1 class="text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
          <p class="text-muted-foreground text-sm">Please enter your details</p>
        </div>

        <form class="space-y-5" @submit.prevent="onSubmit">
          <div class="space-y-2">
            <label class="text-sm font-medium" for="username">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="ken"
              class="login-input flex w-full rounded-full border px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-12 bg-background border-border/60 focus:border-primary"
              @focus="isTyping = true"
              @blur="isTyping = false"
            />
            <p v-if="usernameError" class="text-sm text-destructive">
              {{ usernameError }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium" for="password">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                class="login-input flex w-full rounded-full border px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-12 pr-10 bg-background border-border/60 focus:border-primary"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle password visibility"
                @click="showPassword = !showPassword"
              >
                <svg
                  v-if="showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-5"
                >
                  <path d="m15 18-.722-3.25" />
                  <path d="M2 8a10.645 10.645 0 0 0 20 0" />
                  <path d="m20 15-1.726-2.05" />
                  <path d="m4 15 1.726-2.05" />
                  <path d="m9 18 .722-3.25" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-5"
                >
                  <path
                    d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
            <p v-if="passwordError" class="text-sm text-destructive">
              {{ passwordError }}
            </p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <input
                id="remember"
                v-model="form.remember"
                type="checkbox"
                class="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <label for="remember" class="text-sm font-normal cursor-pointer"
                >Remember for 30 days</label
              >
            </div>
            <!-- <a href="#" class="text-sm text-primary hover:underline font-medium"
              >Forgot password?</a
            > -->
          </div>

          <div
            v-if="error"
            class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg"
          >
            {{ error }}
          </div>

          <InteractiveHoverButton
            type="submit"
            :text="isLoading ? 'Signing in...' : 'Log in'"
            class="w-full h-12 text-base font-medium"
            :disabled="isLoading"
          />
        </form>
      </div>
    </div>
  </div>
</template>
