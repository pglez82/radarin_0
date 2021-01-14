const apiEndPoint='http://localhost:5000/api'

export async function addUser(username,email){
    console.log("adding a user "+username)
    let response = await fetch(apiEndPoint+'/users/add', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({'name':username, 'email':email})
      })
    return await response.json()
}

export async function getUsers(){
    let response = await fetch(apiEndPoint+'/users/list')
    return await response.json()
}