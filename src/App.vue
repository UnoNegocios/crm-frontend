<template>
  <v-app :dark="true">
    <v-main>
      <app v-if="token!=null"></app>
      <login v-else></login>
    </v-main>
  </v-app>
</template>
<script>
import App from "../src/views/App"
import Login from "../src/views/Login"
import axios from "axios"
export default {
  name: 'App',
  data: () => ({
    token:localStorage.getItem("token"),
  }),
  components:{ 
    'app':App, 
    'login':Login,
  },
  mounted(){
    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/current").then(response => {
      this.$store.commit("currentUser/setUser", response.data.data);
    }).catch(error => {
      localStorage.removeItem("token");
      this.token = null
    });
  }
};
</script>
<style>
.v-application {
    font-family: "Poppins";
}
</style>
