<template>
    <div :class="['chat-bubble', role]">
      <strong>{{ role }}: </strong>
      <span v-if="role === 'assistant'">
        <template v-for="(word, idx) in sentenceWords" :key="idx">
          <template v-if="lingoMap[stripPunctuation(word)]">
            <span class="lingo-tooltip">
              {{ word }}
              <span class="tooltip-text">{{lingoMap[stripPunctuation(word).trim()]}}</span>
            </span>
          </template>
          <template v-else>
            {{ word }}
            <span v-if="idx !== sentenceWords.length - 1"></span>
          </template>
          
        </template>
      </span>
      <span v-else>{{ content }}</span>
    </div>
  </template>
  
<script setup>
import { computed } from 'vue'

const props = defineProps({
    role: String,
    content: String
})

function parseLingo(str) {
    const regex = /"([^"]+)"\s*:\s*"([^"]+)"/g;
    const result = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
        result.push([match[1], match[2]]);
    }
    return result;
}

const lingoArray = computed(() => {
    if (props.role !== 'assistant') return [];
        const match = props.content.match(/Slang in response:\s*\[(.*?)\]/);
    if (!match) return [];
        return parseLingo(match[0]);
});

function stripPunctuation(word) {
    return word.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').toLowerCase();
}

const lingoMap = computed(() => {
    const map = {};
    for (const [key, value] of lingoArray.value) {
        map[key.trim()] = value.trim();
    }
    return map;
});

const sentence = computed(() => {
    console.log('props:', props.content);
    if (props.role !== 'assistant') return props.content;
    const match = props.content.match(/Sentence:\s*"([^"]+)"/);
    console.log('match:', match);
    if (match && match[1]) {
        return match[1].replace(/\\n/g, '\n');
    }
    // fallback: return the whole content if no match
    return props.content;
});

const sentenceWords = computed(() => {
    // Split by spaces, keep punctuation attached to words
    return sentence.value.split(/\s+/);
});
</script>
  
<style scoped>
.chat-bubble {
    padding: 1rem;
    margin: 0.5rem 0;
    border-radius: 12px;
    max-width: 70%;
    word-wrap: break-word;
}

.assistant {
    background-color: #e0f7fa;
    color: #00796b;
    /* align to left */
    margin-left: 0;
    text-align: left;
    /* add a border to the left side */
}

.user {
    background-color: #ffe0b2;
    color: #e65100;
    /* align to right */
    margin-right: 0;
    margin-left: auto;
}
  
.lingo-tooltip {
    position: relative;
    cursor: pointer;
    color: #007bff;
    font-weight: bold;
}
  
.lingo-tooltip .tooltip-text {
    visibility: hidden;
    width: max-content;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 0.3em 0.7em;
    position: absolute;
    z-index: 1;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.2s;
    white-space: nowrap;
}
  
.lingo-tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
}
</style>
