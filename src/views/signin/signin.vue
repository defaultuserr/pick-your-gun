<template>
  <authenticator :sign-up-attributes="['nickname']" :social-providers="['amazon', 'apple',  'google']">
    <template v-slot="{ user, signOut }">
      <h1>Hello {{ user.username }}!</h1>
      <button @click="signOut">Sign Out</button>
    </template>
  </authenticator>
</template>
<script>import '@aws-amplify/ui-vue/styles.css';
</script>