import Wrapper from '../../assets/wrappers/DashboardFormPage'
import { useAppContext } from '../../context/appContext'
import { useState } from 'react'
import { useClearAlertEffect } from '../../functions/useClearAlertEffect'
import { FormRow, Alert } from '../../components'

const Profile = () => {
  const { user, showAlert, updateUser, isLoading, clearAlert } = useAppContext()
  const [name, setName] = useState(user?.name)
  const [email, setEmail] = useState(user?.email)
  const [location, setLocation] = useState(user?.location)

  const handleSubmit = (e) => {
    e.preventDefault()
    // if (!name || !email || !location) {
    //   displayFailAlert()
    //   return
    // }
    // console.log('form submitted')
    updateUser({ name, email, location })
  }

  useClearAlertEffect(showAlert, clearAlert, [email, name, location])

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>profile</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          <FormRow
            type="text"
            labelText='Name'
            name="name"
            value={name}
            handleChange={(e) => setName(e.target.value)}
          />
          <FormRow
            type="text"
            labelText='Email'
            name="email"
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          />
          <FormRow
            type="text"
            labelText='Location'
            name="location"
            value={location}
            handleChange={(e) => setLocation(e.target.value)}
          />
          <button className='btn btn-block' type='submit' disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default Profile