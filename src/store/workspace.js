import router from '~/routes' 
const APIENDPOINT=process.env.API_ENDPOINT
const APIKEY=process.env.API_KEY

//const { API_ENDPOINT, API_KEY } = process.env
export default{
  namespaced:true,
  state(){
      return{
          workspaces: [],
          currentWorkspace: {},
          currentWorkspacePath: [],
          loadings: []
      }
  },
  getters:{
    loading(state) {
      return state.loadings.some(loading => loading)
    }
  },
  mutations:{
      assignState(state, payload){
          Object.keys(payload).forEach(key=>{
              state[key] =payload[key]
          })
      }
  },
  actions:{
      async createWorkspace({dispatch},payload={}){
          const{parentId}=payload
           const workspace = await _request({
              method:'POST',
              body:JSON.stringify({
                  title:'',
                  parent:parentId
              })
          })
          await dispatch('readWorkspaces')
          router.push({
            name: 'Workspace',
            params: {
              id: workspace.id
            }
          })
      },
      async readWorkspaces({commit,dispatch}){
        const workspaces = await _request({
            method:'GET',
        })
        console.log(workspaces)
        commit('assignState',{
            workspaces
        })
        dispatch('findWorkspacePath')
        if (!workspaces.length) {
          await dispatch('createWorkspace')
        }

    },

      async readWorkspace({commit},payload){
        const {id} = payload
        try{
          const workspace = await _request({
            id,
            method:'GET',
        })
        commit('assignState',{
            currentWorkspace:workspace
        })
        } catch(error){
          router.push('/error')

        }
      },

      
      async updateWorkspace({ dispatch }, payload) {
        const{id, title, content}=payload
        await _request({
            id,
            method:'PUT',
            body:JSON.stringify({
                title,
                content
            })
        })
        dispatch('readWorkspaces')
      },
      async deleteWorkspace({state,dispatch},payload){
          const{id}=payload
          await _request({
              id,
              method:'DELETE',
          })
          dispatch('readWorkspaces')
          if (id === parseInt(router.currentRoute.value.params.id, 10)) {
            router.push({
              name: 'Workspace',
              params: {
                id: state.workspaces[0].id
              }
            })
          }
      },
      findWorkspacePath({ state, commit }) {
        const currentWorkspaceId = parseInt(router.currentRoute.value.params.id, 10)
        function _find(workspace, parents) {
          if (currentWorkspaceId === workspace.id) {
            commit('assignState', {
              currentWorkspacePath: [...parents, workspace]
            })
          }
          if (workspace.documents) {
            workspace.documents.forEach(ws => _find(ws, [...parents, workspace]))
          }
        }
        state.workspaces.forEach(workspace => _find(workspace, []))
      },

  }
}


// async function _request(options) {
//   console.log('options:',options)
//   return await fetch('/.netlify/functions/workspace', {
//     method: 'POST',
//     body: JSON.stringify(options)
//   }).then(res => res.json())
// }
async function _request(options) {
  console.log('options:',options)
const {id=''} =options
//https://kdt.roto.codes/documents/  
//${API_ENDPOINT}
console.log(process.env.API_ENDPOINT)
console.log(process.env.API_KEY)
console.log(APIENDPOINT)
console.log(APIKEY)
  return await fetch(`https://kdt.roto.codes/documents/${id}`,{
    ...options,
      headers:{
        'Content-Type':'application/json',
        'x-username': 'jooyoung'
    }
}).then(res=>res.json())
}