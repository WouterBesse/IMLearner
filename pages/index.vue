<template>
    <div class="container">
      <client-only>
        <template #default>
          <div v-if="!isModelReady" class="loading">
            <h2>Loading Language Model...</h2>
            <progress :value="loadingProgress" max="100"></progress>
            <div>{{ loadingStatus }}</div>
          </div>
          <div class="ui" v-else>
            <h1 class="title">Instant Message Teacher</h1>
            <p>Just chat casually with your friendly English texting buddy, and learn the lingo that is used online!</p>
            <div class="chat">
                <div v-for="(msg, index) in messages" :key="index" class="message">
                    <ChatBubble :role="msg.role" :content="msg.content" />
                </div>
            </div>
            <input
              v-model="userInput"
              @keyup.enter="sendMessage(false)"
              placeholder="Type your message..."
            />
          </div>
        </template>
        <template #fallback>
          <div class="loading">
            <h2>Loading Language Model...</h2>
            <progress max="100"></progress>
            <div>Loading...</div>
          </div>
        </template>
      </client-only>
    </div>
  </template>
  
<script setup>
import ChatBubble from '@/components/ChatBubble.vue'
import { ref, computed } from 'vue'
import { onMounted } from 'vue'

const SYSTEM_PROMPT = `
You are a friendly English texting buddy helping the user learn SMS and instant messaging (IM) slang.  
Your job is to reply as if you're casually texting with a friend in English, using common SMS-style slang and abbreviations (like “brb” for “be right back”, “wyd” for “what are you doing”, etc.).  
Keep your messages short, casual, and realistic—just like real text messages.  
Make it feel natural and conversational, as if you're chatting about everyday life or making casual plans. 

For each message, do the following:

1. Write a short reply using casual SMS slang.
2. Give a translation of your reply in formal English.
3. Identify and explain all slang terms used in your response.

Your output must follow this exact format:

Sentence: "<short slang-style reply>"
Slang in response:  ["term1": "definition", "term2": "definition"]
SentenceFormal: "<formal translation>"

Only include slang terms — do not explain regular English words or punctuation.  
Do not include emojis or tone descriptions. Keep your response short, natural, and realistic.

---

*Examples*

Input:  
"wyd tmrw? idk if I can link lol"  

Output:  
Sentence: "prolly chillin, lmk if u down"  
Slang in response: ["prolly": "probably", "chillin": "relaxing", "lmk": "let me know", "u": "you", "down": "interested or willing"]
SentenceFormal: "I will probably be relaxing. Let me know if you are interested."

---

Here are a few common English SMS abbreviations and slang terms for reference:
•⁠⁠  "brb": "be right back"  
•⁠⁠  "ttyl": "talk to you later"  
•⁠⁠  "wyd": "what are you doing"  
•⁠⁠  "idk": "I don't know"  
•⁠⁠  "smh": "shaking my head"  
•⁠⁠  "g2g": "got to go"  
•⁠⁠  "lol": "laughing out loud"  
•⁠⁠  "ikr": "I know, right?"  
•⁠⁠  "tbh": "to be honest"  
•⁠⁠  "btw": "by the way"  
•⁠⁠  "no cap": "not lying / being honest"  
•⁠⁠  "link up": "meet up"  
•⁠⁠  "lmk": "let me know"  
•⁠⁠  "rn": "right now"  
•⁠⁠  "tho": "though"  
•⁠⁠  "prolly": "probably"  
•⁠⁠  "l8r": "later"  
•⁠⁠  "u": "you"  
•⁠⁠  "omw": "on my way"
•⁠⁠  "fomo": "fear of missing out"
•⁠⁠  "fam": "family or close friends"
•⁠⁠  "bff": "best friends forever"

Please lead the conversation in an interesting topic, send a question to the user that looks like it could be a real text message from a friend.
`
  
const { $engine, $loadingProgress, $loadingStatus, $isModelReady, $loadModel } = useNuxtApp()

let engine = $engine

const messages = ref([])
const userInput = ref('')

const isModelReady = $isModelReady
const loadingProgress = $loadingProgress
const loadingStatus = $loadingStatus

const showProgress = computed(() => process.client)

const sendMessage = async (isInitial = false) => {
    console.log(isInitial)
    if (!engine || !engine.chat || !engine.chat.completions) {
        messages.value.push({ role: 'system', content: '⚠️ Chat engine is not available or has an error 😢.' })
        return
    }

    let userMessage = isInitial ? '' : userInput.value
    if (!isInitial && !userMessage.trim()) return

    // Always start with the system prompt
    const chatMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.value,
        { role: 'user', content: userMessage }
    ]

    if (!isInitial) {
        messages.value.push({ role: 'user', content: userMessage })
    }

    console.log(isInitial ? 'Initial message' : 'User message:', userMessage)

    // Show "typing..." after 0.5s if reply not ready yet
    let typingIndex = null
    let typingTimeout = setTimeout(() => {
        messages.value.push({ role: 'assistant', content: 'typing...' })
        typingIndex = messages.value.length - 1
    }, 500)

    const reply = await engine.chat.completions.create({
        messages: chatMessages,
    })

    clearTimeout(typingTimeout)

    if (typingIndex === null) {
        messages.value.push({ role: 'assistant', content: reply.choices[0].message.content })
    } else {
        messages.value[typingIndex] = { role: 'assistant', content: reply.choices[0].message.content }
    }

    if (!isInitial) {
        userInput.value = ''
    }
}

onMounted(async () => {
    engine = await $loadModel()
    console.log('Engine:', engine)
    await sendMessage(true) // Send initial message
})

</script>
  
<style scoped>
.container {
    width: 100%;
    padding: 2rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    /* Do NOT set flex: 1 1 auto here */
}
input {
    width: 100%;
    margin: 0 20px;
    padding: 0.5rem;
    margin-top: 1rem;
}
.loading {
    text-align: center;
    padding: 4rem;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1 1 auto; /* Only loading fills available space */
}
progress {
    width: 100%;
    margin-top: 1rem;
    height: 20px;
}

.message {
    word-wrap: break-word;
    display: flex;
}

.title {
    font-size: 2rem;
    text-align: left;
    height: fit-content;
}
.chat {
    width: 100%;
    overflow-y: auto;
    flex-grow: 1;
}
.ui {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    max-height: 70vh; /* or any value you want */
    flex: 1 1 auto;
    /* Remove height: 100%; */
}
</style>
  