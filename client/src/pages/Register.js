import {Logo, FormRow, Alert} from '../components'
import { useNavigate } from 'react-router-dom'
import Wrapper from '../assets/wrappers/RegisterPage'
import { useState, useEffect } from 'react'
import { useAppContext } from '../context/appContext';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
}

//This is called each time the page is loaded....
const Register = () => {
  //set local state
  const [values, setValues] = useState(initialState)
  //set global state
  const { user, isLoading, showAlert, displayAlert, clearAlert, registerUser, loginUser } = useAppContext(); //setupUser too
  const navigate = useNavigate();
  
  //define the useEffect hook to do something when anything from the "values" changes
  useEffect(() => {
    // console.log(values);
    if (showAlert) { //if there's an alert, check if we should change it based on the new user values
      checkAlert();
    }
  }, [values.email, values.password, values.name]);

  useEffect(() =>{
    if (user){
      // Add timeout so doesn't jump immediately to next page. Better UX actually.
      setTimeout(() =>{
        navigate('/')
      }, 1000)
    }
  }, [user, navigate])

  const checkAlert = () => {
    const {name,email,password,isMember} = values
    if (email && password && ((isMember && !name) || (!isMember && name))) {
      clearAlert()
    }
  }

  //function to toggle between if a user should login or register
  const toggleMember = () => {
    setValues({...values, isMember: !values.isMember})
    clearAlert() //if there's an alert for missing values, clear it
  }

  const handleChange = (e) => {
    //update the local state of user values
    setValues({...values, [e.target.name]: e.target.value });
    // console.log(e.target)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const {name,email,password,isMember} = values
    // We're handling errors for missing valeus in the server instead now
      // if(!email || !password || (!isMember && !name)) {
      //   displayAlert()
      //   return
      // }
    const currentUser = {name, email, password}
    if (isMember) {
      loginUser(currentUser)
      // setupUpser(currentUser, endPoint: 'login')
    } else {
      registerUser(currentUser)
      // setupUpser(currentUser, endPoint: 'register')
    }
    console.log(values)
  }

  return (
  // Wrapper is a way to style everything with pre-set styles that are imported
  // They are imported from the assets/wrappers folder
  // ClasssName is a way to add custom styles to the imported styles
  // The classes are globally available from the index.css file
  <Wrapper className='full-page'>
    <form className='form' onSubmit={onSubmit} >
      <Logo />
      <h3>{values.isMember ? "Login":"Register"}</h3>
      {showAlert && <Alert />}
      {/* name input */}
      {!values.isMember && (
      <FormRow 
        type='text' 
        name="name" 
        value={[values].name} //square brackets to get the name since its also a native property of a js variable
        handleChange={handleChange}
      />
      )}
      {/* email input */}
      <FormRow 
        type='email' 
        name="email" 
        value={values.email}
        handleChange={handleChange}
      />
      {/* password input */}
      <FormRow 
        type='password' 
        name="password" 
        value={values.password}
        handleChange={handleChange}
      />
      <button type='submit' className='btn btn-block' disabled={isLoading}>
        submit
      </button>
    <p>
      {values.isMember ? "Not a Member yet?":"Already a Member?"}
      <button type='button' onClick={toggleMember}
        className='member-btn'>
        {values.isMember ? "Register":"Login"}
      </button>
    </p>
    </form>
  </Wrapper>
  )
}
  
export default Register