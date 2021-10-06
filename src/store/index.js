import {createStore} from 'vuex'
import workspace from './workspace'

export default createStore({
    state(){//함수로 반환 왜? 데이터기 떄문에.
        return{
            msg:'hello Vue',
            oricount:1
        }
    },
    getters:{
        reversedMsg(state){
            return state.msg.split('').reverse().join('')
        }
    },
    mutations:{//데이터를 수정하는 권한
        increaseCounts(state){
            state.oricount+=1
        },
        updateMsg(state,newMsg){
            state.msg=newMsg
        }
    },
    actions:{//constext=>state,getters,commit, dispatch 
        async fetchTodo({commit}){
        const todo = await fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        console.log(todo)
        commit('updateMsg',todo.title)
        }
    },
    modules:{
        workspace
    }
    
})