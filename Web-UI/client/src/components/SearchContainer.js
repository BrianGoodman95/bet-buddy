import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';
import { FormRow, FormRowSelect, Alert } from '../components';
import { useClearAlertEffect } from '../functions/useClearAlertEffect'
import { useState, useMemo } from 'react';

const SearchContainer = () => {

    const {
        handleBetChange,
        clearFilters,
        showAlert,
        clearAlert,
        isLoading,
        isEditing,
        filterOptions,
        searchSource,
        searchCategory,
        searchOddsMaker,
        searchPick,
        searchSpread,
        searchWager,
        searchStatus,
        searchDescription,
        sort,
        sortOptions,
    } = useAppContext();

    const [localSearch, setLocalSearch] = useState(searchDescription);

    useClearAlertEffect(showAlert, clearAlert, [searchDescription, searchSource, searchCategory, searchOddsMaker, searchPick])

    const handleClear = (e) => {
        e.preventDefault();
        setLocalSearch('')
        clearFilters();
    }

    const handleSearch = (e) => {
        // e.preventDefault();
        console.log('searching')
        const name = e.target.name;
        const value = e.target.value;
        handleBetChange({ name, value });
    }

    const debounce = (e) => {
        let timeoutId
        return (e) => {
            setLocalSearch(e.target.value)
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                handleSearch(e)
            }, 1000)
        }
    }
    const optimizedDebounce = useMemo(() => debounce(), [])

    return (
        <Wrapper>
            <form className='form' onSubmit={(e) => e.preventDefault()}>
                <h3>Filter Bets</h3>
                {showAlert && <Alert />}
                <div className="form-center">
                    {/* EVENT DESCRIPTION */}
                    <FormRow
                        type="text"
                        name="searchDescription"
                        labelText="Event Description"
                        value={localSearch}
                        handleChange={optimizedDebounce}
                    />
                    {/* BET SOURCE
                    <FormRowSelect
                        type="text"
                        name="searchSource"
                        labelText="Bet Source"
                        value={searchSource}
                        handleChange={handleSearch}
                        options={['all', ...betSourceOptions]}
                    /> */}
                    {/* EVENT CATEGAORY */}
                    <FormRowSelect
                        type="text"
                        name="searchCategory"
                        labelText="Event Category"
                        value={searchCategory}
                        handleChange={handleSearch}
                        options={filterOptions.eventCategoryOptions ? ['all', ...filterOptions.eventCategoryOptions] : ['all']}
                    />
                    {/* ODDS MAKER */}
                    <FormRowSelect
                        type="text"
                        name="searchOddsMaker"
                        labelText="Odds Maker"
                        value={searchOddsMaker}
                        handleChange={handleSearch}
                        options={filterOptions.oddsMakerOptions ? ['all', ...filterOptions.oddsMakerOptions] : ['all']}
                    />
                    {/* PICK */}
                    <FormRowSelect
                        type="text"
                        name="searchPick"
                        labelText="Pick"
                        value={searchPick}
                        handleChange={handleSearch}
                        options={filterOptions.pickOptions ? ['all', ...filterOptions.pickOptions] : ['all']}
                    />
                    {/* BET STATUS */}
                    <FormRowSelect
                        type="text"
                        name="searchStatus"
                        labelText="Bet Status"
                        value={searchStatus}
                        handleChange={handleSearch}
                        options={filterOptions.betStatusOptions ? ['all', ...filterOptions.betStatusOptions] : ['all']}
                    />
                    {/* Sorting */}
                    <FormRowSelect
                        name="sort"
                        labelText="sort"
                        value={sort}
                        handleChange={handleSearch}
                        options={sortOptions}
                    />
                    {/* Hiddne Submit button */}
                    <button
                        type="submit"
                        style={{ display: 'none' }}
                        tabIndex="-1"
                        onClick={handleSearch}
                    >
                        Submit
                    </button>
                    {/* clear button */}
                    <div className='btn-container'>
                        <button
                            className='btn btn-block btn-danger'
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

export default SearchContainer;