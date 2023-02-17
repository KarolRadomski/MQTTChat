import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('User', {
  state: () => {
    return {
      user: JSON.parse(localStorage.getItem('user')),
      userError: '',
      users: [],
    };
  },
  actions: {
    // User login
    async login(email, password) {
      try {
        this.userError = '';
        const data = {
          email,
          password,
        };
        const temp = await axios.post('api/users/login', data);
        this.user = temp.data;
        localStorage.setItem('user', JSON.stringify(temp.data));
      } catch (error) {
        this.userError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async logout() {
      try {
        this.userError = '';
        this.user = null;
        localStorage.removeItem('user');
      } catch (error) {
        this.userError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },

    async register(firstname, lastname, email, password) {
      try {
        this.userError = '';
        const data = {
          firstname,
          lastname,
          email,
          password,
        };
        const temp = await axios.post('api/users/', data);
        this.user = temp.data;
        localStorage.setItem('user', JSON.stringify(temp.data));
      } catch (error) {
        this.userError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async fetchAllUsers() {
      try {
        this.userError = '';
        const temp = await axios.get('api/users/all');
        this.users = temp.data.users;
      } catch (error) {
        this.userError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
  },
});
