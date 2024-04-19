"use client"
import React, { useState } from 'react'
import classes from './register.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { signIn } from 'next-auth/react'


const Register = () => {

  const [username,setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사

    if(username === "" || email === "" || password === "") {
       toast.error("Fill all Fields")
       return
    }

    if(password.length < 6){
        toast.error("password must be at least 6 characters")
        return
    }

    try {

      const res = await fetch("http://localhost:3000/api/register", {
        headers: {
          "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
          username,
          email,
          password
        })
      })

      if(res.ok){
          toast.success("successfully registered the user")
          setTimeout(() => {
            signIn()
          }, 1500)
      } else {
          toast.error("Error occured while registering")
          return
      }

    } catch(error) {
      console.log(error)
    }

  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="username..." onChange={(e) => setUsername(e.target.value)} />
          <input type="email" placeholder="email..." onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="password..." onChange={(e) => setPassword(e.target.value)} />
          <button  className={classes.submitButton}>
            Register
          </button>
          <button className={classes.registerNow} onClick={() => signIn()}>
          Don&apos;t have an account? <br /> Register new.
          </button>
        </form>
        </div>
      <ToastContainer />
    </div>
  )
}

export default Register
