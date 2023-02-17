<template>
  <div class="sidebar">
    <div class="row w-100 m-0">
      <div class="col-sm-auto bg-white sticky-top w-100 p-0">
        <div class="d-flex flex-sm-column flex-row flex-nowrap bg-white align-items-center sticky-top w-100">
          <ul class="nav nav-pills nav-flush flex-sm-column ps-2 flex-row flex-nowrap mb-auto mx-auto text-center align-items-center list">
            <li>
              <a href="/admin" class="nav-link py-3 px-2" :class="{ selected: active === 'new' }" title="Dodaj temat" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="New">
                <i class="bi-calendar-plus fs-3"></i>
              </a>
            </li>
            <li>
              <a href="/assign" class="nav-link py-3 px-2" :class="{ selected: active === 'service' }" title="Dodaj użytkowników do tematu" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="New">
                <i class="bi-people fs-3"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia';
// import { useUserStore } from '../../store/User';

export default {
  props: ['active'],
  name: 'AdminView',
  computed: {
    // ...mapState(useUserStore, ['user']),
  },
};
</script>

<style scoped>
.sidebar {
  max-width: 10%;
  width: 4%;
  min-height: 100vh;
  position: fixed;
  top: 0px;
  z-index: 0;

  border-right: 1px solid #30d5c8;
}
.list {
  padding-top: 100px;
  min-height: 100vh;
  width: 100%;
}
li {
  margin: 20px 0;
}
i {
  color: #000000;
}
.selected i {
  color: #30d5c8;
}

@media only screen and (max-width: 575px) {
  .sidebar {
    max-width: 100vw;
    min-height: 5vh;
    width: 100vw;
    position: relative;
    z-index: 0;
  }
  .list {
    min-height: 5vh;
    padding-top: 0px;
    width: 100%;
    justify-content: space-around;
  }
  .list > * {
    margin-bottom: 0px;
    margin-top: 0px;
    padding-bottom: 0px;
  }
}
</style>
