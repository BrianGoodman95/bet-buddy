import styled from 'styled-components'

const Wrapper = styled.main`
  nav{
    width: var(--fluid-width);
    max-width: var(--max-width);
    /* max-width: 570px; */
    margin: 0 auto;
    margin-top: 5rem;
    /* height: 300px; */
    height: var(--nav-height);
    display: flex;
    align-items: left;
  }
  .page{
    min-height: calc(90vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  h1{
    font-weight: 700;
    span{
      color: var(--primary-500);
    }
  }
  p{
    color: var(--gray-500);
  }
  .main-img{
    display: none;
  }
  @media (min-width: 992px){
    .page{
      grid-template-columns: 1fr 1fr;
      column-gap: 3rem;
    }
    .main-img{
      display: block;
    }
  }
`
export default Wrapper
