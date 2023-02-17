<template>
  <div>
    <div class="chatBox" v-if="selectedTopic.id">
      <div class="topicName">
        <h4>{{ selectedTopic.name }}</h4>
      </div>
      <div class="messagesBox overflow-auto" id="messageScroll">
        <div class="message" :key="item._id" v-for="item in messages[selectedTopic.id]">
          <div v-if="item.authorID === user.id" class="myMessage">
            <p class="time">{{ Number(item.createdAt.slice(11, 13)) + 1 + item.createdAt.slice(13, 16) }}</p>
            <p class="text">{{ item.value }}</p>
          </div>
          <div v-else class="foreignMessage">
            <p class="name">{{ item.firstname }}</p>
            <div class="d-flex mess">
              <p class="text">{{ item.value }}</p>
              <p class="time">{{ Number(item.createdAt.slice(11, 13)) + 1 + item.createdAt.slice(13, 16) }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="inputBox">
        <input type="text" v-model="message" class="write-message" placeholder="Wiadomość" />
        <button class="sendButton" @click="sendMessage()"><i class="bi bi-send-fill" style="font-size: 20px; margin-right: 4px"></i></button>
      </div>
    </div>
    <div v-else>
      <div class="noTopicsMessage">
        <p class="noTopicHeader">Nie należysz do żadnego tematu</p>
        <p class="noTopicDetails">Poczekaj aż administrator doda cię do projektu</p>
      </div>
    </div>
    <!-- <pre>{{ messages[selectedTopic.id] }}</pre> -->
  </div>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia';
import { useUserStore } from '../store/User';
import { useTopicStore } from '../store/Topics';
import { useMessageStore } from '../store/Messages';

export default {
  name: 'ChatWindow',
  data() {
    return {
      message: '',
    };
  },
  methods: {
    ...mapActions(useMessageStore, ['getAll']),
    sendMessage() {
      const payload = {
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        authorID: this.user.id,
        topicID: this.selectedTopic.id,
        value: this.message,
      };
      const topic = this.selectedTopic.topic;
      this.$emit('message', topic, payload);
      this.message = '';
    },
  },
  computed: {
    ...mapWritableState(useTopicStore, ['selectedTopic']),
    ...mapWritableState(useMessageStore, ['messages']),
    ...mapWritableState(useUserStore, ['user']),
  },
  updated() {
    var container = document.querySelector('#messageScroll');
    container.scrollTop = container.scrollHeight;
  },
};
</script>

<style scoped>
.chatBox {
  width: 65vw;
  margin: 60px 5vw 0px 5vw;
  min-height: calc(100vh - 200px);
  background-color: white;
  border: 1px solid #30d5c8;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.topicName {
  padding: 20px;
  background-color: #30d5c8;
  color: white;
}
.topicName > h4 {
  margin: 0px;
}
.messagesBox {
  max-height: calc(100vh - 350px);
  height: calc(100vh - 350px);
  /* width: 100%; */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.message {
  width: 100%;
}
.message > div {
  width: 100%;
}

.myMessage {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
}
.myMessage .text {
  max-width: 60%;
  background-color: #30d5c8;
  color: white;
  padding: 10px;
  margin-right: 10px;
  border-radius: 25px;
}

.foreignMessage {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: baseline;
}
.foreignMessage > div {
  display: flex;
  align-items: baseline;
  width: 100%;
}
.name {
  margin-bottom: 0px;
  padding-left: 15px;
  margin-top: 5px;
  font-size: 12px;
  color: gray;
}
.foreignMessage .text {
  max-width: 60%;
  background-color: lightgray;
  padding: 10px;
  margin-left: 10px;
  border-radius: 25px;
}
p.text {
  margin-bottom: 5px;
}
p.time {
  margin-bottom: 5px;
  margin: 0 3px;
  font-size: 12px;
  color: gray;
}
/* inputBox */
.inputBox {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  bottom: 0;
  background-color: transparent;
  border-top: 2px solid #eee;
}

.write-message {
  border: none !important;
  width: 80%;
  height: 50px;
  margin-left: 20px;
  padding: 10px;
}

.write-message:focus {
  outline: none !important;
  border: 2px solid #30d5c8 !important;
  border-radius: 30px;
}

.inputBox *::-webkit-input-placeholder {
  color: #c0c0c0;
  font-size: 13pt;
}
.inputBox input *:-moz-placeholder {
  color: #c0c0c0;
  font-size: 13pt;
}
.inputBox input *::-moz-placeholder {
  color: #c0c0c0;
  font-size: 13pt;
  margin-left: 5px;
}
.inputBox input *:-ms-input-placeholder {
  color: #c0c0c0;
  font-size: 13pt;
}
.sendButton {
  color: white;
  background-color: #30d5c8;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 20px;
}
.sendButton:hover {
  scale: 1.1;
  background-color: #14e6d4;
}
.noTopicsMessage {
  width: 65vw;
  margin: 60px 5vw 0px 5vw;
  padding: 40px;
  background-color: white;
  border: 1px solid #30d5c8;
}
.noTopicHeader {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
}
.noTopicDetails {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
}

.messagesBox::-webkit-scrollbar {
  width: 12px; /* width of the entire scrollbar */
}

.messagesBox::-webkit-scrollbar-track {
  background: white; /* color of the tracking area */
}

.messagesBox::-webkit-scrollbar-thumb {
  background-color: #30d5c8; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
  border: 3px solid white; /* creates padding around scroll thumb */
}
</style>
