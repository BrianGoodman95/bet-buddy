import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { FormRow, FormRowSelect, Alert } from '../../components';
import { useClearAlertEffect } from '../../functions/useClearAlertEffect'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';

const AddBet = () => {
  const {
    handleBetChange,
    clearBetState,
    createBet,
    showAlert,
    clearAlert,
    editBet,
    editBetId,
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
  // Here we set an effect to naviagte to a page and clear bet state when the state variable isEditing changes from true to false (which is the case when the edit bet was successful)
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!isEditing) {
  //     setTimeout(() => {
  //       clearBetState()
  //       navigate('/all-bets');
  //     }, 2000);
  //   }
  // }, [isEditing, navigate, clearBetState]);
  // const delay = ms => new Promise(res => setTimeout(() => res(), ms));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      editBet({
        betSource,
        eventCategory,
        eventDescription,
        oddsMaker,
        spread,
        pick,
        wager,
        jobLocation,
        betStatus
      });
      setTimeout(() => {
        clearBetState()
        navigate('/all-bets');
      }, 2000);
      return
    }
    createBet({
      betSource,
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
    handleBetChange({ name, value });
  }

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? 'Edit Bet' : 'Add Bet'}</h3>
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
          {betSource === "Registered" ? (
            <FormRowSelect
              type="text"
              name="eventCategory"
              labelText="Event Category"
              value={eventCategory}
              handleChange={handleBetInput}
              options={eventCategoryOptions}
            />
          ) : (
            <FormRow
              type="text"
              name="eventCategory"
              labelText="Event Category"
              value={eventCategory}
              handleChange={handleBetInput}
            />
          )}
          {/* EVENT DESCRIPTION */}
          {betSource === "Registered" ? (
            <FormRowSelect
              type="text"
              name="eventDescription"
              labelText="Event Description"
              value={eventDescription}
              handleChange={handleBetInput}
              options={eventDescriptionOptions}
            />
          ) : (
            <FormRow
              type="text"
              name="eventDescription"
              labelText="Event Description"
              value={eventDescription}
              handleChange={handleBetInput}
            />
          )}
          {/* ODDS MAKER */}
          {betSource === "Registered" ? (
            <FormRowSelect
              type="text"
              name="oddsMaker"
              labelText="Odds Maker"
              value={oddsMaker}
              handleChange={handleBetInput}
              options={oddsMakerOptions}
            />
          ) : (
            <FormRow
              type="text"
              name="oddsMaker"
              labelText="Odds Maker"
              value={oddsMaker}
              handleChange={handleBetInput}
            />
          )}
          {/* SPREAD */}
          {betSource === "Registered" ? (
            <FormRowSelect
              type="text"
              name="spread"
              labelText="Spread"
              value={spread}
              handleChange={handleBetInput}
              options={spreadOptions}
            />
          ) : (
            <FormRow
              type="text"
              name="spread"
              labelText="Spread"
              value={spread}
              handleChange={handleBetInput}
            />
          )}
          {/* PICK */}
          {betSource === "Registered" ? (
            <FormRowSelect
              type="text"
              name="pick"
              labelText="Pick"
              value={pick}
              handleChange={handleBetInput}
              options={pickOptions}
            />
          ) : (
            <FormRow
              type="text"
              name="pick"
              labelText="Pick"
              value={pick}
              handleChange={handleBetInput}
            />
          )}
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

export default AddBet