<template>
  <nav class="navbar bg-white">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <h1 class="d-inline-block align-middle ms-3 logoName">Komunikator</h1>
      </a>

      <div class="rightside">
        <h5 class="userDetails">{{ user.firstname }} {{ user.lastname }}</h5>
        <router-link :to="{ path: '/admin' }">
          <button class="px-5 py-2 me-2" v-if="user && user.isAdmin">Panel administratora</button>
        </router-link>
        <button class="px-5 py-2 loginButton" @click="handleLogout">Wyloguj się</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { useUserStore } from '../store/User';
import { mapWritableState, mapActions } from 'pinia';
export default {
  name: 'NavBar',
  data() {
    return {};
  },
  methods: {
    ...mapActions(useUserStore, ['logout']),
    async handleLogout() {
      await this.logout();
      this.$router.push('/login');
    },
  },
  computed: {
    ...mapWritableState(useUserStore, ['user']),
  },
};
</script>

<style scoped>
.navbar {
  box-shadow: 8px 8px 24px -15px rgba(66, 68, 90, 1);
  z-index: 2;
  position: relative;
  width: 100vw;
  margin-bottom: 0px;
}

.loginButton {
  border: none;
  background: #30d5c8;
  padding: 2px 5px;
  font-size: 18px;
  color: white;
}
.userDetails {
  margin-right: 10px;
  margin-bottom: 0px;
}
.rightside {
  display: flex;
  align-items: center;
}
@media only screen and (max-width: 767px) {
  .userName {
    display: none !important;
  }

  .logoName {
    font-size: 24px;
    padding-top: 10px;
  }
}
</style>
