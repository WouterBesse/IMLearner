<template>
  <div class="layout">
    <NuxtPage />
    <footer>
      <p>Made by Wouter Besse, Isis de Valk and Zion Krullaars for a VU project</p>
      <p>Source code: <a href="https://github.com/WouterBesse/IMLearner">github.com/WouterBesse/IMLearner</a></p>
    </footer>
  </div>
</template>

<style>
.layout {
  font-family: sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
header, footer {
  text-align: center;
  /* margin: 1rem 0; */
}
body {
  padding: 0px !important;
  margin: 0px !important;
}

footer {
  height: 100px;
}
</style>
