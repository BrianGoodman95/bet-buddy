import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { FormRow, FormRowSelect, Alert } from '../../components';
import { JobsContainer, SearchContainer } from '../../components';
import { useClearAlertEffect } from '../../functions/useClearAlertEffect'


const AllBets = () => {
  const {
    handlebetChange,
    clearBetState,
    createBet,
    showAlert,
    clearAlert,
    isLoading,
    isEditing,
    betSource,
    betSourceOptions,
    eventCategory,
    eventCategoryOptions,
    eventDescription,
    eventDescriptionOptions,
    oddsMaker,
    oddsMakerOptions,
    spread,
    spreadOptions,
    pick,
    pickOptions,
    wager,
    jobLocation,
    betStatus,
    betStatusOptions,
  } = useAppContext();

  useClearAlertEffect(showAlert, clearAlert, [eventCategory, eventDescription, oddsMaker, spread, pick, wager, jobLocation])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      return
    }
    createBet({
      eventCategory,
      eventDescription,
      oddsMaker,
      spread,
      pick,
      wager,
      jobLocation,
      betStatus
    })
    console.log('created bet!')
  }

  const handleClear = (e) => {
    e.preventDefault();
    clearBetState();
    console.log('bet cleared!')
  }

  const handleBetInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    handlebetChange({ name, value });
  }

  return (
    <Wrapper>
      <form className="form">
        <h3>Filter Bets</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          {/* BET SOURCE */}
          <FormRowSelect
            type="text"
            name="betSource"
            labelText="Bet Source"
            value={betSource}
            handleChange={handleBetInput}
            options={betSourceOptions}
          />
          {/* EVENT CATEGAORY */}
          <FormRowSelect
            type="text"
            name="eventCategory"
            labelText="Event Category"
            value={eventCategory}
            handleChange={handleBetInput}
            options={eventCategoryOptions}
          />
          {/* EVENT DESCRIPTION */}
          <FormRowSelect
            type="text"
            name="eventDescription"
            labelText="Event Description"
            value={eventDescription}
            handleChange={handleBetInput}
            options={eventDescriptionOptions}
          />
          {/* ODDS MAKER */}
          <FormRowSelect
            type="text"
            name="oddsMaker"
            labelText="Odds Maker"
            value={oddsMaker}
            handleChange={handleBetInput}
            options={oddsMakerOptions}
          />
          {/* SPREAD */}
          <FormRowSelect
            type="text"
            name="spread"
            labelText="Spread"
            value={spread}
            handleChange={handleBetInput}
            options={spreadOptions}
          />
          {/* PICK */}
          <FormRowSelect
            type="text"
            name="pick"
            labelText="Pick"
            value={pick}
            handleChange={handleBetInput}
            options={pickOptions}
          />
          {/* WAGER */}
          <FormRow
            type="Number"
            name="wager"
            labelText="Wager ($)"
            value={wager}
            handleChange={handleBetInput}
          />
          {/* BET STATUS */}
          <FormRowSelect
            type="text"
            name="betStatus"
            labelText="Bet Status"
            value={betStatus}
            handleChange={handleBetInput}
            options={betStatusOptions}
          />
          {/* submit button */}
          <div className='btn-container'>
            <button
              className='btn btn-block submit-btn'
              type='submit'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
            <button
              className='btn btn-block clear-btn'
              type='clear'
              onClick={handleClear}
              disabled={isLoading}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  )
}

export default AllBets