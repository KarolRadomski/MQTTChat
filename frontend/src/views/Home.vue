<template>
  <div>
    <NavBar />
    <div class="home">
      <TopicSideBar />
      <div v-if="myAccesses"><ChatWindow @message="postMessage" /></div>
      <p v-else>Nie jesteś przydzielony do żadnego tematu</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../store/User';
import { useTopicStore } from '../store/Topics';
import { useMessageStore } from '../store/Messages';
import { mapWritableState, mapState, mapActions } from 'pinia';
import NavBar from '../components/NavBar.vue';
import TopicSideBar from '../components/TopicSideBar.vue';
import ChatWindow from '../components/ChatWindow.vue';
import mqtt from 'mqtt/dist/mqtt';

export default {
  name: 'Home',
  data() {
    return {
      myAccesses: [],
      function: () => {},
      client: {},
    };
  },
  methods: {
    ...mapActions(useMessageStore, ['getAll', 'saveUpcomingMessage']),
    postMessage(topic, payload) {
      // console.log(topic);
      this.client.publish(topic, JSON.stringify(payload), 0, (error) => {
        if (error) {
          console.log('Publish error', error);
        }
      });
    },
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    ...mapWritableState(useTopicStore, ['selectedTopic']),
  },
  async created() {
    if (!this.user?.id) {
      this.$router.push('/login');
    }
    const temp = await axios.post('api/access/me', { userID: this.user.id });

    this.myAccesses = temp.data.accesses;

    var options = {
      clientId: `service-${this.user.id}`,
      hostname: 'broker.hivemq.com',
      path: '/mqtt',
      port: 8000,
      connectTimeout: 5000,
    };
    console.log('Łączę');
    this.client = mqtt.connect(options);
    // this.client.on('connect', function () {
    //   console.log('connected');
    // });

    this.myAccesses.forEach((access) => {
      this.client.subscribe(access.mqttTopic);
      console.log(access.mqttTopic);
    });

    this.client.on('message', (topic, message) => {
      console.log(`Received message ${message} from topic ${topic}`);
      this.saveUpcomingMessage(JSON.parse(message));
    });

    //Fetch old messages for my Acceses
    this.getAll(this.myAccesses);
  },
  components: {
    NavBar,
    TopicSideBar,
    ChatWindow,
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: row;
}
</style>
