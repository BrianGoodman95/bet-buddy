import styled from 'styled-components'

const Wrapper = styled.main`
  nav{
    // width: var(--fluid-width);
    // max-width: 1125px;
    /* max-width: 570px; */
    /* height: 300px; */
    // height: var(--nav-height);
    height: 175px;
    display: flex;
    margin-left: -3rem;
    margin-bottom: 3rem;
  }
  .page{
    min-height: calc(90vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: 0rem;

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
  .landing-img{
    display: none;
  }
  @media (min-width: 992px){
    .page{
      grid-template-columns: 1fr 1fr;
      column-gap: 3rem;
    }
    .landing-img{
      display: block;
      margin-top: 3rem;
    }
  }
`
export default Wrapper
