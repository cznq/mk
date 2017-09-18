import Vue from 'vue'
import Vuex from 'vuex'
import VuexSaga, { call, put, delay } from 'vuex-saga'
import { INC_MUTATION } from './mutation-types'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        count: 0,
        todos: [
            { id: 1, text: '...', done: true },
            { id: 2, text: '...', done: false }
        ]
    },
    getters: {
        doneTodos: state => {
            return state.todos.filter(todo => todo.done)
        },
        doneTodosCount: (state, getters) => {
            return getters.doneTodos.length
        }
    },
    mutations: {
        [INC_MUTATION]: state => state.count++,
        dec: state => state.count--,
        increment: state => state.count += 2,
        someMutation: state => state.count += 3,
        someOtherMutation: state => state.count += 4,
        asyncincrement (state, payload){
          state.count += payload
        }
    },
    actions: {
   
        dincrement({ commit }) {
            setTimeout(() => {
                commit('increment')
            }, 1000)
        },
        actionA({ commit }) {
            return new Promise((resolve, reject) => {
            	console.log('等待中1。。。');
                setTimeout(() => {
                	console.log('等待中2。。。');
                    commit('someMutation')
                    resolve()
                }, 2000)
            })
        },
        actionB({ dispatch, commit }) {
        	console.log('等待中。。。');
            return dispatch('actionA').then(() => {
                commit('someOtherMutation')
            })
        },
        *incrementAsync(store, payload) {

	      yield call(delay,3000)
	      yield put("asyncincrement", payload.count)
	      //return store.count
	    }
	}
})

Vue.use(VuexSaga, { store: store })

export default store;
