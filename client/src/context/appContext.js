import React, {useReducer, useContext } from 'react';
import reducer from './reducer';
import axios from 'axios';

import { 
    DISPLAY_ALERT,
    CLEAR_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    // SETUP_USER_BEGIN,
    // SETUP_USER_SUCCESS,
    // SETUP_USER_ERROR,
} from "./actions"

const token = localStorage.getItem('token')
const userLocation = localStorage.getItem('location')
const user = localStorage.getItem('user')

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user? JSON.parse(user) : null,
  token: token || null,
  userLocation: userLocation || '' ,
  jobLocation: userLocation || '',
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
   
    //The useReducer hook takes a reducer function and an initial state 
    //as arguments, and returns the current state paired with a dispatch method
    //to pass in an object(action) to the custom reducer function we defined.
    const [state, dispatch] = useReducer(reducer, initialState);

    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT });
    };

    const clearAlert = () => {
        dispatch({ type: CLEAR_ALERT });
    };

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

    const registerUser = async (currentUser) => {
        // console.log(currentUser)
        // Begin registering user. This purpose is really just to disable the register button so we don't get multiple requests
        dispatch({ type: REGISTER_USER_BEGIN});
        // Try Registering the user!
        try {
            const response = await axios.post('/api/v1/auth/register', currentUser)
            // console.log(response);
            const {user, token, location} = response.data;
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
            dispatch({
                type: REGISTER_USER_ERROR,
                payload: {msg: error.response.data.msg},
            })
        }
    }

    const loginUser = async (currentUser) => {
        // Begin logging in user. This purpose is really just to disable the register button so we don't get multiple requests
        dispatch({ type: LOGIN_USER_BEGIN});
        // Try Logging in the user!
        try {
            const response = await axios.post('/api/v1/auth/login', currentUser)
            const {user, token, location} = response.data;
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
            dispatch({
                type: LOGIN_USER_ERROR,
                payload: {msg: error.response.data.msg},
            })
        }
    }

    // const setupUser = async ({currentUser, endPoint}) => {
    //     console.log(endPoint)
    //     // Begin registering user. This purpose is really just to disable the register button so we don't get multiple requests
    //     dispatch({ type: SETUP_USER_BEGIN});
    //     // Try Registering the user!
    //     try {
    //         const response = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)
    //         // console.log(response);
    //         const {user, token, location} = response.data;
    //         dispatch({
    //             type: SETUP_USER_SUCCESS,
    //             payload: {
    //                 user,
    //                 token,
    //                 location
    //             },
    //         })
    //         addUserToLocalStorage({user, token, location})
    //     // If the register fails, handle the error
    //     } catch (error){
    //         console.log(error)
    //         dispatch({
    //             type: SETUP_USER_ERROR,
    //             payload: {msg: error.response.data.msg},
    //         })
    //     }
    // }

    return (
        <AppContext.Provider
            value={{
            ...state,
            displayAlert,
            clearAlert,
            registerUser,
            loginUser,
            // setupUser,
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