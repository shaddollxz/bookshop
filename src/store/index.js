import { createStore } from "vuex";
import state from "./root/state";
import getters from "./root/getters";
import mutations from "./root/mutations";
import actions from "./root/actions";

export default createStore({
    state,
    getters,
    mutations,
    actions,
    modules: {},
});
