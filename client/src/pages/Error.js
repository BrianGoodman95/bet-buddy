import {Link} from 'react-router-dom'
import notFound from '../assets/images/notFound.svg'
import Wrapper from '../assets/wrappers/ErrorPage'

const Error = () => {
    return (
      <Wrapper> 
        <div className='Main'> 
          <img src={notFound} alt='not found' className='img error-img' />
          <h3 className='error-title'>Oops! that page doesn't exist!</h3>
          <Link to='/'> Back To Home </Link>
        </div>
      </Wrapper>
    )
  }
  
  export default Error

