<template>
    <div class="container">
      <client-only>
        <template #default>
          <div v-if="!isModelReady" class="loading">
            <h2>Loading Language Model...</h2>
            <progress :value="loadingProgress" max="100"></progress>
            <div>{{ loadingStatus }}</div>
          </div>
          <div v-else>
            <h1>WebLLM Chat</h1>
            <div v-for="(msg, index) in messages" :key="index">
                <ChatBubble :role="msg.role" :content="msg.content" />
            </div>
            <input
              v-model="userInput"
              @keyup.enter="sendMessage"
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
You are a friendly Dutch texting buddy helping the user learn Dutch instant messaging (IM) language. 
Your job is to reply as if you are chatting with a friend in Dutch, using common Dutch texting lingo and abbreviations (like 'ff' for 'even', 'lama' for 'laat maar', etc). 
Keep your messages short and casual, just like real text messages. 
Make it fun! Imagine you and the user are planning to hang out or chat about daily life. 
For each reply, provide:
sentence: "<your Dutch message>",
lingo: [ { "abbreviation": "meaning in standard Dutch" }, ... ]
Examples:
sentence: "Laten we ff chillen broski!",
lingo: ["ff": "even", "chillen": "relaxen", "broski": "maat"]
-----
sentence: "Morgen gaan we lkkr esma drinken!",
lingo: ["lkkr": "lekker", "esma": "espresso martini"]
-----
sentence: "Hbdj, Dat is toch niet zo moeilijk?",
lingo: ["hbdj": "hoe bedoel je"]

Here are a few common Dutch texting abbreviations:
- "ff": "even",
- "lama": "laat maar",
- "gtg": "moet gaan",
- "bff": "beste vriend(in) voor altijd",
- "omg": "oh mijn god",
- "gwn": "gewoon",
- "hbdj": "hoe bedoel je?",
- "t": "dat/het",
- "mss": "misschien",
- "miss": "misschien",
- "idk": "ik weet het niet",
- "roffa": "rotterdam",
- "k": "oké",
- "w8": "wacht",
- "fk": "fucking",
- "kk": "kanker"
- "ginto": "gin tonic",
- "esma": "espresso martini",
- "zn": "zijn",
- "lkkr": "lekker",

And here are some texting conversations as inspiration:
Britt: "Hoe laat station Krommenie?"
Mark: "kunnen we een eerder"
Mark: "want voor we daar zijn"
Mark: "en dan ook binnen"
Mark: "vorige keer was wel beetje een rij"
Britt: "Primaaaa"
Mark: "dus Uhm"
Mark: "12:52"
Mark: "De trein?"
Mark: "kan je hier bij de supermarkt blikjes ginto halen?"
-----
Jan: "Hahahahahah"
Jan: "Helemaal kut"
Jan: "Niks regel, bepaal je gewoon zelf 😂😂"
Jan: "Achterlijk gedoe"
Kees: "Ja, ik zou het dus leuk vinden stel het is puur vriendschappelijk"
Kees: "Maar wss is er wel een bepaalde verwachting toch"
Kees: "Of zie ik dat verkeerd"
Kees: "Ergens denk ik dus ook wel ja waarom niet"
Kees: "Miss is het wel heel leuk"
-----
Mees: "Hahahahah dan kan je na 2 drankjes ofzo ook gewoon weg"
Mees: "Maar miss is het dan meer kut dat het iemand is die je miss via via kent"
-----
Thijs: "Lig nu nog ff bij te slapen"
Thijs: "Net klaar tho"
Thijs: "Dus ik ga me een beetje klaarmaken"

` // <-- Add your instruction here
  
const { $engine, $loadingProgress, $loadingStatus, $isModelReady, $loadModel } = useNuxtApp()

let engine = $engine

const messages = ref([])
const userInput = ref('')

const isModelReady = $isModelReady
const loadingProgress = $loadingProgress
const loadingStatus = $loadingStatus

const showProgress = computed(() => process.client)

onMounted(async () => {
    engine = await $loadModel()
    console.log('Engine:', engine)
})

const sendMessage = async () => {
    if (!userInput.value.trim()) return

    if (!engine || !engine.chat || !engine.chat.completions) {
        messages.value.push({ role: 'system', content: '⚠️ Chat engine is not available or has an error 😢.' })
        return
    }

    // Always start with the system prompt
    const chatMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.value,
        { role: 'user', content: userInput.value }
    ]

    messages.value.push({ role: 'user', content: userInput.value })

    const reply = await engine.chat.completions.create({
        messages: chatMessages,
    })

    messages.value.push({ role: 'assistant', content: reply.choices[0].message.content })
    userInput.value = ''
}

</script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }
  input {
    width: 100%;
    padding: 0.5rem;
    margin-top: 1rem;
  }
  .loading {
    text-align: center;
    padding: 4rem;
  }
  progress {
    width: 100%;
    margin-top: 1rem;
    height: 20px;
  }
  </style>
  