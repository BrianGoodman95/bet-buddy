import { useEffect } from 'react'
import { useAppContext } from '../../context/appContext'
import { StatsContainer, ChartsContainer, Loading } from '../../components'

const Stats = () => {
  const { showStats, isLoading, monthlyBets } = useAppContext()

  useEffect(() => {
    showStats()
  }, [])

  if (isLoading) {
    return <Loading center />
  }

  return (
    <h1>
      <StatsContainer />
      {monthlyBets.length > 0 && <ChartsContainer />}
    </h1>
  )
}
  
  export default Stats