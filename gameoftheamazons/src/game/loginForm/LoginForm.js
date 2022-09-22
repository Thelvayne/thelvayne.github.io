import React from 'react'

function LoginForm() {
  return (
    <form >
        <div className='form-inner'>
            <h2>Login</h2>
          
            <div className='form-group'>
                <label htmlFor='name'>Name:</label>
                <input type='text' name="name" id='name'></input>


            </div>
        
            <div className='form-group'>
                <label htmlFor='password'>Passwort:</label>
                <input type='password' name="password" id='password'></input>
            </div>
            <input type='submit' value="login"></input>
        </div>
    </form>
  )
}

export default LoginForm