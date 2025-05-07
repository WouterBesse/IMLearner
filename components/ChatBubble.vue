<template>
    <div :class="['chat-bubble', role]">
      <strong>{{ role }}:</strong> {{ content }}
    </div>
  </template>
  
  <script setup>
  defineProps({
    role: String,
    content: String
  })
  </script>
  
  <style scoped>
  .chat-bubble {
    padding: 1rem;
    margin: 0.5rem 0;
    border-radius: 12px;
    max-width: 70%;
    word-wrap: break-word;
  }
  
  .chat-bubble.user {
    background-color: #d1e7dd;
    align-self: flex-end;
    margin-left: auto;
  }
  
  .chat-bubble.assistant {
    background-color: #f8d7da;
    align-self: flex-start;
    margin-right: auto;
  }
  </style>
  