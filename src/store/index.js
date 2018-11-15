import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
	state:{//state
        show: false
    },
    mutations:{
        switch_dialog(state){//这里的state对应着上面这个state
            state.show = state.show ? false : true
            //你还可以在这里执行其他的操作改变state
        }
    },
    actions:{
        switch_dialog(context){//这里的context和我们使用的$store拥有相同的对象和方法
            context.commit('switch_dialog')
            //你还可以在这里触发其他的mutations方法
        },
    }
})

/*export default new vuex.Store({
	state: {
		show: false
	},
	mutations: {
		switch_dialog(state) {
			state.show = state.show ? false : true
		}
	},
	actions: {
		switch_dialog(context) {
			context.commit('switch_dialog')
		}
	}
})*/
