import { defineStore } from 'pinia';
import axios from 'axios';

export const useMessageStore = defineStore('Message', {
  state: () => {
    return {
      messages: {},
      messageError: '',
    };
  },
  actions: {
    //get all topic with assingment
    async getAll(topics) {
      try {
        this.messageError = '';
        topics.forEach(async (topic) => {
          const temp = await axios.post('api/messages/get', { topicID: topic._id });
          this.messages[topic._id] = temp.data.messages;
        });
      } catch (error) {
        this.messageError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },

    async saveUpcomingMessage(newMessage) {
      try {
        this.messageError = '';
        console.log('Wiadomosc: ', newMessage);
        this.messages[newMessage.topicID].push({
          firstname: newMessage.firstname,
          lastname: newMessage.lastname,
          authorID: newMessage.authorID,
          topicID: newMessage.topicID,
          value: newMessage.value,
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        this.messageError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
  },
});

/*

messages = [
  'topicID':[
    {
      message
    },
    {
      message
    }
  ],
  'topicID':[
    {
      message
    },
    {
      message
    }
  ]
]

*/
