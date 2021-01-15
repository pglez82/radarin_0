import runtimeEnv from '@mars/heroku-js-runtime-env'



//REACT_APP_API_URI is an enviroment variable defined in the file .env.development or .env.production
export async function addUser(username,email){
    const env = runtimeEnv()
    const apiEndPoint= env.REACT_APP_API_URI || 'http://localhost:5000/api'
    let response = await fetch(apiEndPoint+'/users/add', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({'name':username, 'email':email})
      })
    return await response.json()
}

export async function getUsers(){
    const env = runtimeEnv()
    const apiEndPoint= env.REACT_APP_API_URI || 'http://localhost:5000/api'
    console.log(env.REACT_APP_API_URI)
    console.log(apiEndPoint)
    let response = await fetch(apiEndPoint+'/users/list')
    return await response.json()
}