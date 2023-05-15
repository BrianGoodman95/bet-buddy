import main from '../assets/images/landing.svg'
import Wrapper from '../assets/wrappers/LandingPage'
import { Logo } from '../components' //because index.js is the default
import { Link, Navigate } from 'react-router-dom';
import { React } from 'react';
import { useAppContext } from '../context/appContext';

const Landing = () => {
  const { user } = useAppContext()
  return (
    <>
      {!user ? (
        <Wrapper>
          <nav>
            <Logo />
          </nav>
          <div className='container page'>
            {/* info */}
            <div className='info'>
              <h1>
                Data <span>Tracking</span> App
              </h1>
              <p>
                Track your data with ease.
                Datafy is a simple and easy to use data entry and visualization app.
              </p>
              <Link to='/register' className='btn btn-hero'>Login/Register</Link>
            </div>
            <img src={main} alt='data search' className='img landing-img' />
          </div>
        </Wrapper >
      ) : (
        <Navigate to="/" replace />
      )}
    </>
  )
}

export default Landing
