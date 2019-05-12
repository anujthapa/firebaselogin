import React, { Component } from "react"
const firebase = require("firebase")

const firebaseConfig = {
  apiKey: "AIzaSyDwWyy_FYq7tURBkLcVnvuqY68ONy4HWvQ",
  authDomain: "survey-7e280.firebaseapp.com",
  databaseURL: "https://survey-7e280.firebaseio.com",
  projectId: "survey-7e280",
  storageBucket: "survey-7e280.appspot.com",
  messagingSenderId: "296922201658",
  appId: "1:296922201658:web:d9842f9b7e39d2cc"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

class Authen extends Component {
  state = {
    email: "",
    password: "",
    err: "",
    auth: false
  }

  loginHandaler = e => {
    const email = this.refs.email.value
    const password = this.refs.password.value
    const auth = firebase.auth()
    const promise = auth.signInWithEmailAndPassword(email, password)
    promise.then(user => {
      const err = "Welcome to Portal " + user.user.email
      this.setState({ err, auth: true })
    })

    promise.catch(e => {
      const err = e.message
      this.setState({ err })
    })
  }

  signupHandaler = e => {
    const email = this.refs.email.value
    const password = this.refs.password.value

    const auth = firebase.auth()
    const promise = auth.createUserWithEmailAndPassword(email, password)
    promise.then(user => {
      console.log(user.user.email)
      const err = "Welcome " + user.user.email
      firebase
        .database()
        .ref("/users" + user.user.uid)
        .set({ email: user.user.email })
      this.setState({ err })
    })
    promise.catch(e => {
      const err = e.message
      this.setState({ err })
    })
  }

  logoutHandaler = () => {
    const auth = firebase.auth()
    auth.signOut()
    const err = ""
    this.setState({ err, auth: false })
  }

  googleSignHandler = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(user => {
        const err = "Welcome " + user.user.displayName
        firebase
          .database()
          .ref("/users/" + user.user.uid)
          .set({ email: user.user.email })
        this.setState({ err, auth: true })
      })
      .catch(err => {
        this.setState({ err })
      })
  }

  render() {
    return (
      <div>
        <input
          type="email"
          id="email"
          ref="email"
          placeholder="Enter your Email"
        />
        <input
          type="password"
          id="password"
          ref="password"
          placeholder="Enter your Password"
        />
        <p>{this.state.err}</p>
        {this.state.auth ? (
          <button onClick={this.logoutHandaler}> Log Out</button>
        ) : (
          <button onClick={this.loginHandaler}>Log In</button>
        )}

        <button onClick={this.signupHandaler}>Sign Up</button>
        <button onClick={this.googleSignHandler} className="google">
          Signin with google
        </button>
      </div>
    )
  }
}
export default Authen
