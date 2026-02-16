<script setup lang="ts">
const halfSecond = 500
const fallback = `{\n  "datetimeOnServer": loading...\n}`

let executeTimeoutId: number | null = null
let refreshTimeoutId: number | null = null

const {
  data,
  status,
  error,
  pending,
  execute: executeFetch,
  refresh: refreshFetch,
} = await useLazyFetch(
  '/api/teste',
  {
    immediate: false,
    pick: ['datetimeOnServer'],
    transform: ({ datetimeOnServer }) => ({ datetimeOnServer }),
  },
)

const execute = () => {
  if (executeTimeoutId) clearTimeout(executeTimeoutId)
  executeTimeoutId = window.setTimeout(() => {
    executeTimeoutId = null
    executeFetch()
  }, halfSecond)
}

const refresh = () => {
  if (refreshTimeoutId) clearTimeout(refreshTimeoutId)
  refreshTimeoutId = window.setTimeout(() => {
    refreshTimeoutId = null
    refreshFetch()
  }, halfSecond)
}

onMounted(execute)
</script>

<template>
  <section>
    <div>
      Nuxt module playground!
    </div>
    <button @click="() => refresh()">
      Refresh
    </button>
    <pre v-if="pending">{{ fallback }}</pre>
    <pre v-else>{{ data }}</pre>
    <div class="response-label">
      Response from /api/teste
    </div>
    <span v-if="error"> {{ error }}</span>
    <span v-else>{{ status }}</span>
  </section>
</template>

<style scoped>
section {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: "Segoe UI", Trebuchet MS, system-ui, -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
}

section::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 20% 50%,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
    circle at 80% 80%,
    rgba(139, 92, 246, 0.1) 0%,
    transparent 50%
  );
  pointer-events: none;
}

div:first-child {
  text-align: center;
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

hr {
  display: none;
}

span {
  display: block;
  text-align: center;
  font-size: 1rem;
  color: #cbd5e1;
  margin-bottom: 2rem;
  min-height: 1.5em;
}

span[style*="color"] {
  color: #f87171 !important;
  font-weight: 500;
}

.response-label {
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

pre {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 0.5rem;
  border-radius: 1rem;
  overflow: auto;

  height: 6rem;
  width: 30rem;
  /* max-height: 7rem; */
  /* max-width: 35rem; */

  white-space: wrap;
  word-break: break-all;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.875rem;
  line-height: 1.75;
  color: #e2e8f0;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    inset 0 1px 3px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  margin: 0 auto;
  padding-left: 4rem;
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  /* text-align: center; */
}

pre::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

pre::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 10px;
}

pre::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 10px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

button {
  padding: 0.75rem 2rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
  position: relative;
  overflow: hidden;
  display: inline-block;
}

button::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

button:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 20px 35px rgba(59, 130, 246, 0.35);
  transform: translateY(-2px);
}

button:hover::before {
  opacity: 1;
}

button:active {
  transform: translateY(0);
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
}

@media (max-width: 640px) {
  section {
    padding: 1rem;
  }

  div:first-child {
    font-size: 2rem;
  }

  pre {
    font-size: 0.75rem;
    padding: 0.5rem;
    width: auto;
  }

  button {
    padding: 0.5rem 1.5rem;
    font-size: 0.875rem;
  }
}
</style>
