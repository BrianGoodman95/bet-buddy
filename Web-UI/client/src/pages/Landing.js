import main from '../assets/images/landing.svg'
import Wrapper from '../assets/wrappers/LandingPage'
import { LogoGreyBcg } from '../components' //because index.js is the default
import { Link, Navigate } from 'react-router-dom';
import { React } from 'react';
import { useAppContext } from '../context/appContext';

const Landing = () => {
  const { user, isLoading, loginUser } = useAppContext()
  return (
    <>
      {!user ? (
        <Wrapper>
          <div className='container page'>
            {/* logo & info */}
            <div className='info'>
              <nav>
                <LogoGreyBcg />
              </nav>
              <h1>
                Your <span>Personal</span> Bookie
              </h1>
              <p>
                Manage your bets with ease.
                Bet Buddy is here to help you track and make all your bets and incorporates advanced analytics (eventually) to help you make the best ones.
              </p>
              <Link to='/register' className='btn btn-hero'>Login / Register</Link>
              <div>
                <button
                  type='button'
                  className='btn btn-hipster btn-hero'
                  disabled={isLoading}
                  onClick={() => {
                    loginUser({ name: 'test user', email: 'testUser@test.com', password: 'secret' });
                  }}
                >
                  {isLoading ? 'loading...' : 'demo the app'}
                </button>
              </div>
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
