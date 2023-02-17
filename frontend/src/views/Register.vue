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
              <h1 class="fw-bold mb-2 text-center">Zarejestruj się</h1>

              <div class="row">
                <!-- First name input -->
                <div class="col-md-6 mb-2">
                  <div class="form-outline">
                    <label class="form-label" for="fname"><i class="bi bi-person-fill" style="font-size: 24px"></i> Imie:</label>
                    <input type="text" v-model="form.fname.value" id="fname" placeholder="Jan" class="form-control" :class="validateForm.fname.validClass" />
                  </div>
                </div>
                <!-- Last name input -->
                <div class="col-md-6 mb-2">
                  <div class="form-outline">
                    <label class="form-label" for="lname"><i class="bi bi-person-fill" style="font-size: 24px"></i> Nazwisko:</label>
                    <input type="text" v-model="form.lname.value" id="lname" placeholder="Nowak" class="form-control" :class="validateForm.lname.validClass" />
                  </div>
                </div>
              </div>
              <!-- Email input -->
              <div class="form-outline mb-2">
                <label class="form-label" for="email"><i class="bi bi-at" style="font-size: 24px; position: relative; top: 3px"></i> Email:</label>
                <input type="email" v-model="form.email.value" id="email" placeholder="przyklad@domena.pl" class="form-control" :class="validateForm.email.validClass" />
              </div>

              <!-- Password input -->
              <div class="form-outline mb-1">
                <label class="form-label" for="password"><i class="bi bi-lock-fill" style="font-size: 20px"></i> Hasło:</label>
                <input type="password" v-model="form.password.value" id="password" placeholder="**********" class="form-control" :class="validateForm.password.validClass" />
              </div>
              <!-- Repeat password input -->
              <div class="form-outline mb-1">
                <label class="form-label" for="password2"><i class="bi bi-lock-fill" style="font-size: 20px"></i> Powtórz hasło:</label>
                <input type="password" v-model="form.password2.value" id="password2" placeholder="**********" class="form-control" :class="validateForm.password2.validClass" />
              </div>
              <div class="error" v-if="userError || validationError">
                <i class="bi bi-exclamation-octagon-fill errorIcon"></i>
                {{ userError }} {{ validationError }}
              </div>
              <div class="w-100 mt-3 d-flex justify-content-center">
                <button @click="handleRegister" class="loginButton btn btn-block mb-4">Zarejestruj się</button>
              </div>
              <div class="w-100 mt-3 d-flex justify-content-center">
                <router-link :to="{ path: '/login' }" style="text-decoration: none">
                  <h5 class="registerButton">Masz konto? <u>Zaloguj się</u></h5>
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
  name: 'RegisterView',
  data() {
    return {
      form: {
        fname: {
          value: '',
          validClass: '',
        },
        lname: {
          value: '',
          validClass: '',
        },
        email: {
          value: '',
          validClass: '',
        },
        password: {
          value: '',
          validClass: '',
        },
        password2: {
          value: '',
          validClass: '',
        },
      },
      validationError: '',
    };
  },
  methods: {
    ...mapActions(useUserStore, ['register']),
    async handleRegister() {
      this.validationError = '';
      if (this.form.email.validClass && this.form.fname.validClass && this.form.lname.validClass && this.form.password.validClass && this.form.password2.validClass) {
        await this.register(this.form.fname.value, this.form.lname.value, this.form.email.value, this.form.password.value);
        if (!this.userError) this.$router.push('/');
      }
    },
    saveStateChange(formCopy) {
      this.form = formCopy;
      return this.form;
    },
  },
  computed: {
    ...mapState(useUserStore, ['user', 'userError']),

    validateForm() {
      const formCopy = this.form;

      for (const key in formCopy) {
        if (formCopy[key].value === '') formCopy[key].validClass = '';
        else {
          switch (key) {
            case 'email':
              var validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              if (formCopy[key].value.match(validRegex)) {
                formCopy[key].validClass = 'is-valid';
              } else {
                formCopy[key].validClass = 'is-invalid';
              }
              break;
            case 'fname':
              formCopy[key].value.length >= 3 && formCopy[key].value.length < 30 ? (formCopy[key].validClass = 'is-valid') : (formCopy[key].validClass = 'is-invalid');
              break;
            case 'lname':
              formCopy[key].value.length >= 3 && formCopy[key].value.length < 30 ? (formCopy[key].validClass = 'is-valid') : (formCopy[key].validClass = 'is-invalid');
              break;
            case 'password':
              formCopy[key].value.length >= 3 && formCopy[key].value.length < 30 ? (formCopy[key].validClass = 'is-valid') : (formCopy[key].validClass = 'is-invalid');
              break;
            case 'password2':
              formCopy[key].value === formCopy['password'].value ? (formCopy[key].validClass = 'is-valid') : (formCopy[key].validClass = 'is-invalid');
              break;
          }
        }
      }
      return this.saveStateChange(formCopy);
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
