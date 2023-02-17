<template>
  <div class="sidebar">
    <h5>Twoje tematy</h5>
    <div class="list">
      <div
        class="topic"
        :key="topic._id"
        v-for="topic in topics"
        @click="
          selectedTopic.id = topic._id;
          selectedTopic.name = topic.name;
          selectedTopic.topic = topic.mqttTopic;
        "
        :class="{ active: selectedTopic.id === topic._id }"
      >
        <strong>{{ topic.name }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia';
import { useUserStore } from '../store/User';
import { useTopicStore } from '../store/Topics';

export default {
  props: ['active'],
  name: 'AdminView',
  methods: {
    ...mapActions(useTopicStore, ['getMyAccesses']),
  },
  computed: {
    ...mapWritableState(useUserStore, ['user']),
    ...mapWritableState(useTopicStore, ['topics', 'selectedTopic']),
  },
  created() {
    this.getMyAccesses(this.user.id);
  },
};
</script>

<style scoped>
.sidebar {
  width: 25%;
  min-height: calc(100vh - 82px);
  position: relative;
  z-index: 5;
  background-color: white;
  border-right: 1px solid #30d5c8;
  padding: 15px;
}
h5 {
  text-align: center;
  padding-bottom: 5px;
  border-bottom: 1px solid #30d5c8;
}
.list {
  margin-top: 20px;
}
.topic {
  border: 1px solid #30d5c8;
  padding: 8px;
  margin: 10px 0;
  background-color: rgb(243, 243, 243);
}
.active {
  background-color: #30d5c8;
  color: white;
}
@media only screen and (max-width: 575px) {
  .sidebar {
    max-width: 100vw;
    min-height: 5vh;
    width: 100vw;
    position: relative;
    z-index: 0;
  }
}
</style>
