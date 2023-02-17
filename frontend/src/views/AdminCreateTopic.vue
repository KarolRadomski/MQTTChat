<template>
  <div>
    <NavBar />

    <div class="content">
      <div class="featureContainer">
        <div class="addButtonContainer">
          <button class="addButton" data-bs-toggle="modal" data-bs-target="#createTopicModal"><i class="bi bi-plus-circle"></i> Dodaj temat</button>
        </div>
        <div class="topics">
          <div class="topicsHeader">
            <h5 class="name">Nazwa</h5>
            <h5 class="counter">Ilość użytkowników</h5>
            <h5 class="manage">Zarządzaj</h5>
          </div>
          <div class="topic" :key="topic._id" v-for="topic in topics">
            <div class="name">{{ topic.name }}</div>
            <div class="counter">{{ topic.users.length }}</div>
            <div class="manage">
              <div class="dropdown">
                <button class="dropdown-toggle manageButton" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Zarządzaj</button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#renameTopicModal" @click="controlTopicID = topic._id"><i class="bi bi-pencil"></i>Zmień nazwę</button>
                  </li>
                  <li>
                    <button
                      class="dropdown-item"
                      data-bs-toggle="modal"
                      data-bs-target="#usersModal"
                      @click="
                        controlTopicID = topic._id;
                        fetchAccesses(topic._id);
                      "
                    >
                      <i class="bi bi-person-gear"></i>Użytkownicy
                    </button>
                  </li>
                  <li>
                    <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#removeTopicModal" @click="controlTopicID = topic._id"><i class="bi bi-trash"></i>Usuń</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- MODAL add topic-->
    <div class="modal fade" id="createTopicModal">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Dodawanie tematu</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Nazwa tematu" v-model="newTopicName.value" :class="validateTopicName?.valid" />
              <button class="modalButton" type="button" id="button-addon2" @click="handleTopicAdd()" data-bs-dismiss="modal" aria-label="Close">Dodaj</button>
            </div>
            <div class="messageBox" v-if="newTopicName.message !== ''">
              <i class="bi bi-exclamation-octagon-fill errorIcon"></i>
              {{ newTopicName.message }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL rename topic -->
    <div class="modal fade" id="renameTopicModal">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Zmiana nazwy tematu</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Nowa nazwa tematu" v-model="newTopicName.value" :class="validateTopicName?.valid" />
              <button class="modalButton" type="button" id="button-addon2" @click="handleTopicRename(controlTopicID)" data-bs-dismiss="modal" aria-label="Close">Zmień nazwę</button>
            </div>
            <div class="messageBox" v-if="newTopicName.message !== ''">
              <i class="bi bi-exclamation-octagon-fill errorIcon"></i>
              {{ newTopicName.message }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL remove topic -->
    <div class="modal fade" id="removeTopicModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Potwierdź usunięcie tematu</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="height: auto">
            <div class="buttonContainerModal">
              <button data-bs-toggle="modal" data-bs-target="#removeTopicModal" class="removeButtonModal" @click="handleRemoveTopic()">Usuń</button>
              <button data-bs-toggle="modal" data-bs-target="#removeTopicModal" class="cancelButtonModal">Anuluj</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- MODAL manage users -->
    <div class="modal fade" id="usersModal">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Zarządzaj użytkownikami</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body manageUsersBody">
            <div class="input-group mb-3">
              <div class="searchBar">
                <input type="text" class="form-control" v-model="searchQuery" placeholder="Wyszukaj użytkownika" />
              </div>
            </div>
            <div class="usersList">
              <div class="itemInUsersList" :key="user._id" v-for="user in returnFilteredUsers">
                {{ user.firstname }} {{ user.lastname }}
                <button v-if="!usersIdList.includes(user._id)" class="grantAccessButton" @click="handleGrantAccess(user._id)">Dodaj</button>
                <button v-else class="removeAccessButton" @click="handleRemoveAccess(user._id)">Usuń</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useTopicStore } from '../store/Topics';
import { useUserStore } from '../store/User';
import { mapState, mapActions } from 'pinia';
import NavBar from '../components/NavBar.vue';

export default {
  name: 'CreateTopic',
  data() {
    return {
      showAddTopicModal: false,
      newTopicName: {
        value: '',
        valid: undefined,
        message: '',
      },
      controlTopicID: '',
      searchQuery: '',
      usersIdList: [],
    };
  },
  methods: {
    ...mapActions(useTopicStore, ['getAll', 'createTopic', 'renameTopic', 'removeTopic']),
    ...mapActions(useUserStore, ['fetchAllUsers']),
    async handleTopicAdd() {
      if ((this.newTopicName.valid = 'is-valid')) {
        await this.createTopic(this.newTopicName.value);
        this.newTopicName = {
          value: '',
          valid: undefined,
          message: '',
        };
      }
    },
    async handleTopicRename() {
      if ((this.newTopicName.valid = 'is-valid')) {
        await this.renameTopic(this.controlTopicID, this.newTopicName.value);
        this.newTopicName = {
          value: '',
          valid: undefined,
          message: '',
        };
      }
    },
    async handleRemoveTopic() {
      await this.removeTopic(this.controlTopicID);
    },
    async fetchAccesses(topicID) {
      let accesses = await axios.post('api/access/get', { topicID: topicID });
      this.usersIdList = [];
      accesses.data.accesses.forEach((access) => {
        this.usersIdList.push(access.userID);
      });
      return this.usersIdList.length;
    },
    async handleGrantAccess(userID) {
      this.usersIdList.push(userID);
      this.topics.forEach((topic) => {
        if (topic._id === this.controlTopicID) topic.users.push(userID);
      });
      await axios.post('api/access/grant', { userID: userID, topicID: this.controlTopicID });
    },

    async handleRemoveAccess(userID) {
      this.usersIdList = this.usersIdList.filter((user) => {
        return user !== userID;
      });
      this.topics.forEach((topic) => {
        if (topic._id === this.controlTopicID)
          topic.users = topic.users.filter((user) => {
            return user !== userID;
          });
      });

      await axios.post('api/access/remove', { userID: userID, topicID: this.controlTopicID });
    },

    saveValidationChanges(newValues) {
      this.newTopicName = newValues;
      return this.newTopicName;
    },
  },
  computed: {
    ...mapState(useTopicStore, ['topics']),
    ...mapState(useUserStore, ['user', 'users']),
    validateTopicName() {
      let newTopicNameCopy = this.newTopicName;
      newTopicNameCopy.message = '';
      if (newTopicNameCopy.value.length >= 5 && newTopicNameCopy.value.length <= 50) {
        var unique = true;
        this.topics.forEach((topic) => {
          if (topic.name === newTopicNameCopy.value) {
            unique = false;
            newTopicNameCopy.valid = 'is-invalid';
            newTopicNameCopy.message = 'Taki temat już istnieje';
          }
        });
        if (unique) {
          newTopicNameCopy.valid = 'is-valid';
          newTopicNameCopy.message = '';
        }
      } else if (newTopicNameCopy.value.length === 0) {
        newTopicNameCopy.valid = '';
        newTopicNameCopy.message = '';
      } else {
        newTopicNameCopy.valid = 'is-invalid';
        newTopicNameCopy.message = 'Nazwa powinna zawierać od 5 do 50 znaków';
      }

      return this.saveValidationChanges(newTopicNameCopy);
    },

    returnFilteredUsers() {
      return this.searchQuery === '' ? this.users : this.users.filter((item) => item.firstname.toLowerCase().includes(this.searchQuery.toLowerCase()) || item.lastname.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
  },
  created() {
    if (!this.user?.id) {
      this.$router.push('/login');
    }
    if (!this.user?.isAdmin) {
      this.$router.push('/');
    }
    this.getAll();
    this.fetchAllUsers();
  },
  components: {
    NavBar,
  },
};
</script>

<style scoped>
.content {
  width: 90%;
  margin: 0px 5%;
}
.featureContainer {
  margin-top: 20px;
  padding: 30px;
  background-color: white;
  border: 1px solid #30d5c8;
}
.addButtonContainer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.addButton {
  padding: 10px 20px;
  border: none;
  background-color: #30d5c8;
  color: white;
}
.topicsHeader {
  display: flex;
  width: 100%;
  margin-top: 20px;
  background-color: #00afa3;
  color: white;
  padding: 15px 15px;
}

h5 {
  margin: 0px;
}
.topic {
  display: flex;
  padding: 10px 15px;
  border-bottom: 1px solid lightgray;
}
.topic:last-child {
  border-bottom: none;
}
.name {
  display: flex;
  width: 40%;
  align-items: center;
}
.counter {
  display: flex;
  width: 30%;
  align-items: center;
  justify-content: center;
}
.manage {
  width: 30%;
  text-align: end;
}
.manageButton {
  padding: 10px 15px;
  border: none;
  background-color: #c8f2ec;
}
.manageButton:hover {
  background-color: #30d5c8;
}

/* modal */
.modal-header {
  border-bottom: none;
}

.modal-content {
  border: 2px solid #30d5c8;
  padding: 20px 0;
}
.modal-body {
  height: 140px;
}
.modalButton {
  padding: 10px 20px;
  border: none;
  background-color: #30d5c8;
  color: white;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.messageBox {
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

.buttonContainerModal {
  width: 80%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.removeButtonModal {
  padding: 10px 20px;
  border: none;
  background-color: red;
  color: white;
}
.cancelButtonModal {
  padding: 10px 20px;
  border: none;
  background-color: green;
  color: white;
}

.searchBar {
  width: 80%;
  margin: 0 auto;
  display: flex;
  align-items: center;
}
.manageUsersBody {
  height: auto;
}

.usersList {
  width: 80%;
  margin: 0 auto;
}
.itemInUsersList {
  display: flex;
  flex-direction: row;
  padding: 10px;
  border: 1px solid lightgray;
  border-radius: 3px;
  margin: 2px 0;
  justify-content: space-between;
}

.grantAccessButton {
  padding: 5px 10px;
  width: 100px;
  border: none;
  background-color: rgb(33, 105, 33);
  color: white;
}

.removeAccessButton {
  padding: 5px 10px;
  width: 100px;
  border: none;
  background-color: rgb(177, 27, 27);
  color: white;
}
</style>
