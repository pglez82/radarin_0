import React, {useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function EmailForm(props) {
 const [state, setState] = useState(
     {email: '', remail: '', enabled: false, welcomeMsg: ''}
 );

function changeEmail(e) {
     const email = e.target.value ;
     setState({...state, email: email});
}


//Simulate user registration. 
// In a real application this will call an api.
// We can mock the call using jest.mock
function registerUser(email) {
   if (email==='foo@test.com') //This user is already registered
      return false
   else
      return true //Everything went smooth
} 

const handleSubmit = (e) => {
    e.preventDefault()
    //Add the user to the database
    if (registerUser(state.email))
        setState({welcomeMsg:'User '+state.email+' has been registered!'})
    else
        setState({welcomeMsg:'ERROR: User '+state.email+' is already registered!'})
}


return (
  <Form>
    <Form.Group controlId="formBasicEmail">
      <Form.Label>Email address</Form.Label>
      <Form.Control type="email" placeholder="Enter email" onChange={changeEmail} value={state.email}/>
      <Form.Text className="text-muted">
        Do not worry about sharing your email with us. It will be safe!.
      </Form.Text>
    </Form.Group>

    <Form.Group controlId="formBasicName">
      <Form.Label>Name</Form.Label>
      <Form.Control type="string" placeholder="Name" />
    </Form.Group>
    <Button variant="primary" type="submit">
      Submit
    </Button>
  </Form>
 )
}