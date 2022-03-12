// import Cookies from 'js-cookie'
// const token = this.$cookies.authToken.get();

export const state = () => ({
  token: null,
  profile: null
})

export const getters = {
  getToken: state => state.token,
  getProfile: state => state.profile
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  },
  clear(state, namespace) {
    state[namespace] = null;
  }
}

export const actions = {

  takeToken({ commit }) {
    commit("set", ["token", this.$cookies.authToken.get()]);
  },

  async fetchSelf({ commit }) {
    await this.$api.auth.profile.get()
      .then(res => {
        commit("set", ["profile", res]);
      })
      .catch(error => {
        commit("clear", "profile");
      })
  },

  async checkValid({ state, dispatch }) {
    console.log(state.token)
    console.log(state.profilez)
    if (state.token === null) {await dispatch("takeToken");}
    await dispatch("fetchSelf");
    return !!state.profile;
  },

  async login({ commit, dispatch }, {email, password}) {
    let form = new FormData();
    form.append("email", email);
    form.append("password", password);
    await this.$api.auth.login.post({body:form})
      .then(({ token }) => {
        commit("set", ["token", token]);
        this.$cookies.authToken.set(token);
        dispatch("fetchSelf");
      })
      .catch(err => {})
  },

}
