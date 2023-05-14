import React, {useReducer, useContext } from 'react';
import reducer from './reducer';
import axios from 'axios';
// import useNavToPage from '../functions/useNavToPage';
import { useNavigate } from "react-router-dom";

import { 
    REDIRECT_SUCCESS_ALERT,
    MANUAL_ERROR_ALERT,
    SERVER_ERROR_ALERT,
    CLEAR_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    HANDLE_BET_CHANGE,
    CLEAR_BET_STATE,
    CREATE_BET_BEGIN,
    CREATE_BET_SUCCESS,
    GET_BETS_BEGIN,
    GET_BETS_SUCCESS,
    SET_EDIT_BET,
    EDIT_BET_BEGIN,
    EDIT_BET_SUCCESS,
    DELETE_BET_BEGIN,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTER_STATE,
    CHANGE_PAGE,
} from "./actions"

const token = localStorage.getItem('token')
const userLocation = localStorage.getItem('location')
const user = localStorage.getItem('user')

export const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) : null,
    token: token || null,
    userLocation: userLocation || '',
    showSidebar: false,
    jobLocation: userLocation || '',
    isEditing: false,
    editBetId: '',
    betSource: "Registered",
    betSourceOptions: ['Registered', 'Custom'],
    eventCategory: '',
    eventCategoryOptions: ['MLB', 'NFL', 'NBA'],
    eventDescription: '',
    eventDescriptionOptions: ['TOR & NYY', 'PHI @ DAL', 'LAL @ MIL'],
    oddsMaker: '',
    oddsMakerOptions: ['FanDuel', 'Bet365', 'DraftKings'],
    pick: '',
    pickOptions: ['TOR', 'NYY', 'PHI', 'DAL', 'LAL', 'MIL'],
    spread: '',
    spreadOptions: ['+180', '-250'],
    wager: '',
    betStatus: 'Unsettled',
    betStatusOptions: ["Won", "Lost", "Push", "Live", "Unsettled"], //I want to combine Live and Unsettled to Open
    bets: [],
    totalBets: 0,
    page: 1,
    numOfPages: 1,
    stats: {},
    monthlyBets: [],
    search: '',
    searchType: '',
    searchSource: 'all',
    searchCategory: 'all',
    searchOddsMaker: 'all',
    searchPick: 'all',
    searchStatus: 'all',
    sort: 'newest',
    sortOptions: ['newest', 'oldest', 'a-z', 'z-a']
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    //The useReducer hook takes a reducer function and an initial state 
    //as arguments, and returns the current state paired with a dispatch method
    //to pass in an object(action) to the custom reducer function we defined.
    const [state, dispatch] = useReducer(reducer, initialState);
    const delay = ms => new Promise(res => setTimeout(() => res(), ms));
    function useNavigateTo(url) {
        const navigate = useNavigate();
        navigate(url);
    }

    /* ####### LOCAL STORAGE FUNCTIONS ####### */
    const addUserToLocalStorage = ({user, token, location}) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('location', location)
    }

    const removeUserToLocalStorage = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('location')
    }


    /* ###### AXIOS STUFF ####### */

    // setup axios instance
    const authFetch = axios.create({
        baseURL: '/api/v1',
    });

    //Setup an axios 401 Unauthorized Interceptor for requests
    authFetch.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer ${state.token}`
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    //Setup an axios 401 Unauthorized Interceptor for responses
    authFetch.interceptors.response.use((response) => {
        return response
    }, (error) => {
        console.log(error.response)
        if (error.response.status === 401) {
            logoutUser()
        }
        return Promise.reject(error)
    })


    /* ###### ALERT STUFF ####### */
    const redirectSucessAlert = () => {
        dispatch({ type: REDIRECT_SUCCESS_ALERT });
    };

    const serverErrorAlert = async (error) => {
        dispatch({ type: SERVER_ERROR_ALERT, payload: { msg: error.response.data.msg } });
    };

    const manualErrorAlert = (errorMessage) => {
        dispatch({ type: MANUAL_ERROR_ALERT, payload: { msg: errorMessage } });
    };

    const clearAlert = () => {
        dispatch({ type: CLEAR_ALERT });
    };


    /* USER LOGIN/REGISTER FUNCTIONS ####### */
    const registerUser = async (currentUser) => {
        // Begin registering user. This purpose is really just to disable the register button so we don't get multiple requests
        dispatch({ type: REGISTER_USER_BEGIN});
        // Try Registering the user!
        try {
            const response = await axios.post('/api/v1/auth/register', currentUser)
            // console.log(response);
            const {user, token, location} = response.data;
            redirectSucessAlert()
            await delay(2000);
            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: {
                    user,
                    token,
                    location
                },
            })
            addUserToLocalStorage({user, token, location})
        // If the register fails, handle the error
        } catch (error){
            console.log(error)
            serverErrorAlert(error);
            // dispatch({
            //     type: REGISTER_USER_ERROR,
            //     payload: {msg: error.response.data.msg},
            // })
        }
    }

    const loginUser = async (currentUser) => {
        // Begin logging in user. This purpose is really just to disable the register button so we don't get multiple requests
        dispatch({ type: LOGIN_USER_BEGIN});
        // Try Logging in the user!
        try {
            const response = await axios.post('/api/v1/auth/login', currentUser)
            const {user, token, location} = response.data;
            redirectSucessAlert()
            await delay(2000);
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: {
                    user,
                    token,
                    location
                },
            })
            addUserToLocalStorage({user, token, location})
        // If the register fails, handle the error
        } catch (error){
            console.log(error)
            serverErrorAlert(error);
            // dispatch({
            //     type: LOGIN_USER_ERROR,
            //     payload: {msg: error.response.data.msg},
            // })
        }
    }

    const logoutUser = () => {
        removeUserToLocalStorage();
        dispatch({ type: LOGOUT_USER });
    };

    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN });
        try {
            const response = await authFetch.patch('/auth/updateUser', currentUser);
            const { user, token, location } = response.data;
            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: {
                    user,
                    token,
                    location
                },
            })
            addUserToLocalStorage({ user, token, location })
            await delay(2000);
            clearAlert()
            // If the register fails, handle the error
        } catch (error) {
            console.log(error)
            if (error.response.status !== 401) {
                // dispatch({ type: UPDATE_USER_ERROR })
                serverErrorAlert(error);
            }
        }
    }


    /* ###### ADD/EDIT BET FUNCTIONS ##### */
    const handleBetChange = ({ name, value }) => {
        dispatch({
            type: HANDLE_BET_CHANGE,
            payload: {
                name,
                value
            }
        })
    }

    const clearBetState = () => {
        dispatch({ type: CLEAR_BET_STATE });
    };

    const createBet = async (currentBet) => {
        // Begin logging in user. This purpose is really just to disable the register button so we don't get multiple requests
        dispatch({ type: CREATE_BET_BEGIN });
        // Try Logging in the user!
        try {
            const response = await authFetch.post('/bets', currentBet); //Don't need to put currnetUser because we add the userId to the req.user in the auth.js middleware
            dispatch({ type: CREATE_BET_SUCCESS })
            await delay(3000);
            dispatch({ type: CLEAR_BET_STATE });
        } catch (error) {
            console.log(error)
            if (error.response.status === 401) return
            // dispatch({ type: CREATE_BET_ERROR });
            serverErrorAlert(error);
        }
        // clearAlert()
    }

    const setEditBet = (id) => {
        dispatch({ type: SET_EDIT_BET, payload: { id } })
    }
    const editBet = async (bet) => {
        dispatch({ type: EDIT_BET_BEGIN });
        // Try Logging in the user!
        try {
            await authFetch.patch(`/bets/${state.editBetId}`, bet); //Don't need to put currnetUser because we add the userId to the req.user in the auth.js middleware
            dispatch({ type: EDIT_BET_SUCCESS })
        } catch (error) {
            console.log(error)
            if (error.response.status === 401) return
            // dispatch({ type: CREATE_BET_ERROR });
            serverErrorAlert(error);
        }
    }
    const deleteBet = async (betId) => {
        dispatch({ type: DELETE_BET_BEGIN });
        // Try Logging in the user!
        try {
            const response = await authFetch.delete(`/bets/${betId}`); //Don't need to put currnetUser because we add the userId to the req.user in the auth.js middleware
            // dispatch({ type: DELETE_BET_SUCCESS })
            await delay(1000);
            getBets();
        } catch (error) {
            console.log(error)
            if (error.response.status === 401) return
            // dispatch({ type: CREATE_BET_ERROR });
            serverErrorAlert(error);
        }
    }

    const getBets = async () => {
        const { search, searchSource, searchCategory, searchOddsMaker, searchPick, searchStatus, sort, page } = state
        let url = `/bets?page=${page}&betSource=${searchSource}&eventCategory=${searchCategory}&oddsMaker=${searchOddsMaker}&pick=${searchPick}&betStatus=${searchStatus}&sort=${sort}`
        if (search) {
            url = url + `&search=${search}`
        }
        dispatch({ type: GET_BETS_BEGIN });
        try {
            const response = await authFetch.get(url); //Don't need to put currnetUser because we add the userId to the req.user in the auth.js middleware
            const { bets, totalBets, numOfPages } = response.data;
            dispatch({
                type: GET_BETS_SUCCESS,
                payload: {
                    bets,
                    totalBets,
                    numOfPages,
                },
            })
        } catch (error) {
            console.log(error.response)
            if (error.response.status === 401) return
            manualErrorAlert('Something went wrong');
            // logoutUser(); //Here we just logout the user because there should be no other possible error besides 401 (logout anyway)
        }
        // clearAlert()
    }

    /* ###### SEARCH FUNCTIONALITY ####### */
    const clearFilters = async () => {
        dispatch({ type: CLEAR_FILTER_STATE });
        await delay(1000);
        getBets();
    }

    /* STATS PAGE STUFF */
    const showStats = async () => {
        dispatch({ type: SHOW_STATS_BEGIN })
        try {
            const { data } = await authFetch('/bets/stats')
            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: {
                    stats: data.defaultStats,
                    monthlyBets: data.monthlyBets,
                }
            })
        } catch (error) {
            console.log(error.response)
            if (error.response.status === 401) return
            serverErrorAlert(error);

        }
    }

    /* ###### PAGE DISPLAY FUNCTIONS ####### */
    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR });
    };

    const changePage = (page) => {
        dispatch({
            type: CHANGE_PAGE,
            payload: { page }
        });
    }


    return (
        <AppContext.Provider
            value={{
                ...state,
                clearAlert,
                registerUser,
                loginUser,
                toggleSidebar,
                logoutUser,
                updateUser,
                handleBetChange,
                clearBetState,
                createBet,
                getBets,
                setEditBet,
                editBet,
                deleteBet,
                showStats,
                clearFilters,
                changePage
            }}
        >
        {children}
        </AppContext.Provider>
    );
};
// make sure use
export const useAppContext = () => {
    return useContext(AppContext);
};

export { AppProvider };