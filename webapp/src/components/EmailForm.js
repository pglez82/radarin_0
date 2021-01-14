import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {addUser,getUsers} from '../api/api'

class EmailForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {email: '', remail: '', enabled: false, welcomeMsg: ''}
  }

  componentDidMount(){
    this.fetchUsers()
  }

  changeEmail(e) {
    const email = e.target.value ;
    this.setState({email: email});
  }

  changeUserName(e) {
    const username = e.target.value ;
    this.setState({username: username});
  }

  async registerUser(){
      let response = await addUser(this.state.username,this.state.email)
      console.log(response)
      if (response.name !== this.state.username)
        this.setState({welcomeMsg:'ERROR: Something is wrong with the api!'})
      //Refresh the users
      this.fetchUsers()
  }

  async fetchUsers(){
    let users = await getUsers()
    this.props.refreshUsers(users)
  }

  async handleSubmit(e) {
    e.preventDefault()
    //Add the user to the database
    if (this.state.username && this.state.email){
      this.registerUser()
    }
    else
        this.setState({welcomeMsg:'ERROR: You must fill both fields!'})
  }

  render(){
    return(
          <Form  onSubmit={this.handleSubmit.bind(this)}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={this.changeEmail.bind(this)} value={this.state.email}/>
              <Form.Text className="text-muted">
                Do not worry about sharing your email with us. It will be safe!.
              </Form.Text>
            </Form.Group>
        
            <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="string" placeholder="Name" onChange={this.changeUserName.bind(this)} value={this.state.username} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <div>
              <span hidden={this.state.welcomeMsg===''}>{this.state.welcomeMsg}</span>
            </div>
          </Form>
    )
  }
}

export default EmailForm