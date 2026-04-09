import React, { useState } from 'react'

const SignIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


  return (
    <div>
      <h1>sign in form</h1>
      <form action="/signin" method="POST">

      <div>
        <label htmlFor="email">Email
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      <div>
        <label htmlFor="password">Password
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
      </div>
      <button type="submit">Sign In</button>
      </form>
    </div>
  )
}

export default SignIn
