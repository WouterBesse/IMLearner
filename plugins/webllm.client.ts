import { defineNuxtPlugin } from '#app'
import { CreateMLCEngine } from '@mlc-ai/web-llm'
import { ref } from 'vue'

const loadingProgress = ref(0)
const loadingStatus = ref('Initializing...')
const isModelReady = ref(false)
import type { MLCEngine } from '@mlc-ai/web-llm'

let engine: MLCEngine | null = null

const initProgressCallback = (initProgress: any) => {
    if (initProgress.text.includes("Loading model from cache")) {
        // text is Loading model from cache[56/58]: 0MB loaded. 0% completed, 0 secs elapsed., we want to get the number in the brackets
        const match = initProgress.text.match(/\[(\d+)\/(\d+)\]/)
        if (match) {
            const loaded = parseInt(match[1])
            const total = parseInt(match[2])
            loadingProgress.value = Math.round((loaded / total) * 100)
        }
        loadingStatus.value = 'Loading model from cache...'
    } else {
        loadingProgress.value = Math.round((initProgress.progress || 0) * 100)
        loadingStatus.value = initProgress.text || 'Loading...'
    }
    
    console.log(initProgress)
}

async function loadModel(selectedModel = 'Hermes-3-Llama-3.2-3B-q4f16_1-MLC') {
  loadingStatus.value = 'Initializing...'
  loadingProgress.value = 0
  isModelReady.value = false
  engine = await CreateMLCEngine(selectedModel, { initProgressCallback })
  isModelReady.value = true
  return engine
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      engine: () => engine,
      loadingProgress,
      loadingStatus,
      isModelReady,
      loadModel,
    },
  }
})