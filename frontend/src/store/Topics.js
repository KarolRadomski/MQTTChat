import { defineStore } from 'pinia';
import axios from 'axios';

export const useTopicStore = defineStore('Topic', {
  state: () => {
    return {
      topics: {},
      topicError: '',
      selectedTopic: {
        id: '',
        name: '',
        topic: '',
      },
    };
  },
  actions: {
    //get all topic with assingment
    async getAll() {
      try {
        this.topicError = '';
        const temp = await axios.get('api/topics/getAll');
        this.topics = temp.data.topics;
        this.topics.forEach(async (topic) => {
          let temp = await axios.post('api/access/get', { topicID: topic._id });
          // console.log(temp);
          temp.data.accesses.forEach((access) => {
            topic.users.push(access.userID);
          });
        });
      } catch (error) {
        this.topicError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async createTopic(topicName) {
      try {
        this.topicError = '';
        const data = {
          name: topicName,
        };
        const temp = await axios.post('api/topics/create', data);
        console.log(temp);
        this.topics.push(temp.data);
      } catch (error) {
        this.topicError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async renameTopic(id, newName) {
      try {
        this.topicError = '';
        const data = {
          id: id,
          name: newName,
        };
        const temp = await axios.put('api/topics/rename', data);
        this.topics.forEach((topic) => {
          if (topic._id === id) {
            topic.name = temp.data.name;
            topic.mqttTopic = temp.data.mqttTopic;
          }
        });
      } catch (error) {
        this.topicError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },

    async removeTopic(id) {
      try {
        this.topicError = '';
        const data = {
          id: id,
        };
        await axios.post('api/topics/remove', data);

        this.topics = this.topics.filter((topic) => {
          return topic._id !== id;
        });
      } catch (error) {
        this.topicError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },

    //user topic
    async getMyAccesses(userID) {
      try {
        this.topicError = '';
        const response = await axios.post('api/access/me', { userID });
        this.topics = response.data.accesses;
        this.selectedTopic.id = this.topics[0]?._id;
        this.selectedTopic.name = this.topics[0]?.name;
        this.selectedTopic.topic = this.topics[0]?.mqttTopic;
      } catch (error) {
        this.topicError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
  },
});
