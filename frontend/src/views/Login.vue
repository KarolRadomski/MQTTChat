<template>
  <!-- Section: Design Block -->
  <section class="background text-center text-lg-start">
    <!-- Jumbotron -->

    <div class="container py-4">
      <div class="row g-0 pt-4">
        <div class="col-lg-6 mx-auto mt-5 mb-5 mb-lg-0">
          <!-- <div class="card cascading-right" style="background: hsla(0, 0%, 100%, 0.55); backdrop-filter: blur(30px); z-index: 20"> -->
          <div class="card loginCard">
            <div class="card-body p-5 shadow-5">
              <h1 class="fw-bold mb-2 text-center">Zaloguj się</h1>
              <!-- 2 column grid layout with text inputs for the first and last names -->

              <!-- Email input -->
              <div class="form-outline mb-2">
                <label class="form-label" for="email"><i class="bi bi-at" style="font-size: 24px; position: relative; top: 3px"></i>Email:</label>
                <input type="email" v-model="form.email.value" :state="validateEmail" id="email" placeholder="przyklad@domena.pl" class="form-control" :class="validateEmail" />
              </div>

              <!-- Password input -->
              <div class="form-outline mb-1">
                <label class="form-label" for="password"><i class="bi bi-lock-fill" style="font-size: 20px"></i>Hasło:</label>
                <input type="password" v-model="form.password.value" id="password" placeholder="**********" class="form-control" />
              </div>
              <div class="error" v-if="userError || validationError">
                <i class="bi bi-exclamation-octagon-fill errorIcon"></i>
                {{ userError }} {{ validationError }}
              </div>
              <div class="w-100 mt-3 d-flex justify-content-center">
                <button @click="handleLogin" class="loginButton btn btn-block mb-4">Zaloguj się</button>
              </div>
              <div class="w-100 mt-3 d-flex justify-content-center">
                <router-link :to="{ path: '/register' }" style="text-decoration: none">
                  <h5 class="registerButton">Nie masz konta? <u>Zarejestruj się</u></h5>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Jumbotron -->
  </section>
  <!-- Section: Design Block -->
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useUserStore } from '../store/User';

export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        email: {
          value: '',
          valid: null,
        },
        password: {
          value: '',
          valid: null,
        },
      },
      validationError: '',
    };
  },
  methods: {
    ...mapActions(useUserStore, ['login']),
    async handleLogin() {
      this.validationError = '';
      if (this.form.email.valid && this.form.password.value.length !== 0) {
        await this.login(this.form.email.value, this.form.password.value);
        if (!this.userError) this.$router.push('/');
      } else {
        this.validationError = 'Uzupełnij wszystkie pola';
      }
    },
    saveStateChange(formCopy) {
      this.form.email = formCopy;
      return this.form.email.valid;
    },
  },
  computed: {
    ...mapState(useUserStore, ['user', 'userError']),
    validateEmail() {
      const formCopy = this.form.email;
      var validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (formCopy.value.length > 0 && formCopy.value.match(validRegex)) {
        formCopy.valid = true;
      } else if (formCopy.value.length === 0) {
        formCopy.valid = null;
      } else {
        formCopy.valid = false;
      }
      switch (this.saveStateChange(formCopy)) {
        case true:
          return 'is-valid';
        case null:
          return '';

        case false:
          return 'is-invalid';
      }
    },
  },
  created() {
    if (localStorage.getItem('user')) {
      this.$router.push('/');
    }
  },
};
</script>

<style scoped>
.registerButton {
  color: black;
}

.background {
  /* background: #f88888; */
  /* background: rgb(248, 136, 136);
  background: radial-gradient(circle, rgba(248, 136, 136, 1) 47%, rgba(242, 87, 87, 1) 66%); */

  background: rgb(255, 213, 213);
  background: radial-gradient(circle, rgba(255, 213, 213, 1) 7%, rgba(242, 87, 87, 1) 69%);
  height: 100vh;
}
.cascading-right {
  margin-right: -50px;
}
.loginPicture img {
  /* background-color: #f25757; */
  /* From https://css.glass */
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}
.loginCard {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 20;
}
label {
  font-size: 20px;
  font-weight: 600;
}
.error {
  display: flex;
  align-items: center;
  border-radius: 7px;
  background-color: white;
  color: red;
}
.errorIcon {
  color: #f25757;
  font-size: 35px;
  margin: 10px;
}
.loginButton {
  width: 100%;
  background-color: #f25757;
  color: white;
  font-size: 20px;
  font-weight: 600;
}
@media (max-width: 991.98px) {
  .cascading-right {
    margin-right: 0;
  }
}
</style>
