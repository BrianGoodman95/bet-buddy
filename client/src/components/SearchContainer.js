import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';
import { FormRow, FormRowSelect, Alert } from '../components';
import { useClearAlertEffect } from '../functions/useClearAlertEffect'
import { useState, useMemo } from 'react';

const SearchContainer = () => {
    const [localSearch, setLocalSearch] = useState('');

    const {
        handleBetChange,
        clearFilters,
        getBets,
        showAlert,
        clearAlert,
        isLoading,
        isEditing,
        searchSource,
        betSourceOptions,
        searchCategory,
        eventCategoryOptions,
        searchOddsMaker,
        oddsMakerOptions,
        searchPick,
        pickOptions,
        spread,
        wager,
        searchStatus,
        betStatusOptions,
        search,
        sort,
        sortOptions,
    } = useAppContext();

    useClearAlertEffect(showAlert, clearAlert, [searchSource, searchCategory, search, searchOddsMaker, searchPick])

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (isEditing) {
    //         return
    //     }
    //     getBets()
    // }

    const handleClear = (e) => {
        // e.preventDefault();
        setLocalSearch('')
        clearFilters();
    }

    const handleSearch = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        handleBetChange({ name, value });
    }

    const debounce = (e) => {
        console.log('debounce')
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
            <form className="form">
                <h3>Filter Bets</h3>
                {showAlert && <Alert />}
                <div className="form-center">
                    {/* EVENT DESCRIPTION */}
                    <FormRow
                        type="text"
                        name="search"
                        labelText="Event Description"
                        value={localSearch}
                        handleChange={optimizedDebounce}
                    />
                    {/* BET SOURCE */}
                    <FormRowSelect
                        type="text"
                        name="searchSource"
                        labelText="Bet Source"
                        value={searchSource}
                        handleChange={handleSearch}
                        options={['all', ...betSourceOptions]}
                    />
                    {/* EVENT CATEGAORY */}
                    <FormRowSelect
                        type="text"
                        name="searchCategory"
                        labelText="Event Category"
                        value={searchCategory}
                        handleChange={handleSearch}
                        options={['all', ...eventCategoryOptions]}
                    />
                    {/* ODDS MAKER */}
                    <FormRowSelect
                        type="text"
                        name="searchOddsMaker"
                        labelText="Odds Maker"
                        value={searchOddsMaker}
                        handleChange={handleSearch}
                        options={['all', ...oddsMakerOptions]}
                    />
                    {/* PICK */}
                    <FormRowSelect
                        type="text"
                        name="searchPick"
                        labelText="Pick"
                        value={searchPick}
                        handleChange={handleSearch}
                        options={['all', ...pickOptions]}
                    />
                    {/* BET STATUS */}
                    <FormRowSelect
                        type="text"
                        name="searchStatus"
                        labelText="Bet Status"
                        value={searchStatus}
                        handleChange={handleSearch}
                        options={['all', ...betStatusOptions]}
                    />
                    {/* Sorting */}
                    <FormRowSelect
                        name="sort"
                        labelText="sort"
                        value={sort}
                        handleChange={handleSearch}
                        options={sortOptions}
                    />
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