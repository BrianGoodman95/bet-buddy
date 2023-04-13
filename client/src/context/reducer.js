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
    LOGIN_USER_ERROR,
    // SETUP_USER_BEGIN,
    // SETUP_USER_SUCCESS,
    // SETUP_USER_ERROR
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    HANDLE_BET_CHANGE,
    CLEAR_BET_STATE,
    CREATE_BET_BEGIN,
    CREATE_BET_SUCCESS,
    CREATE_BET_ERROR,
    GET_BETS_BEGIN,
    GET_BETS_SUCCESS,
} from "./actions"

import { initialState } from "./appContext"

const reducer = (state, action) => {
    if (action.type === REDIRECT_SUCCESS_ALERT) {
        return {
            ...state,
            showAlert: true,
            alertType: 'success',
            alertText: 'Success! Redirecting...',
        }
    }
    if (action.type === MANUAL_ERROR_ALERT) {
        return {
            ...state,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
            // alertText: 'Unsuccessful. Please Provide All Values For All Fields.',
        }
    }
    if (action.type === SERVER_ERROR_ALERT) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType:'danger',
            alertText: action.payload.msg
        }
    }
    if (action.type === CLEAR_ALERT) {
        return {
            ...state,
            showAlert:false,
            alertType:'',
            alertText: '',
        }
    }
    if (action.type === REGISTER_USER_BEGIN){
        return {
            ...state,
            isLoading: true,
        }
    }
    if (action.type === REGISTER_USER_SUCCESS){
        return {
            ...state,
            user: action.payload.user,
            token: action.payload.token,
            userLocation: action.payload.location,
            jobLocation: action.payload.location,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'Success! Redirecting...'
        }
    }
    if (action.type === REGISTER_USER_ERROR){
        return {
            ...state,
            user: null,
            token: null,
            userLocation: '',
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        }
    }
    if (action.type === LOGIN_USER_BEGIN){
        return {
            ...state,
            isLoading: true,
        }
    }
    if (action.type === LOGIN_USER_SUCCESS){
        return {
            ...state,
            user: action.payload.user,
            token: action.payload.token,
            userLocation: action.payload.location,
            jobLocation: action.payload.location,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'Success! Redirecting...'
        }
    }
    if (action.type === LOGIN_USER_ERROR){
        return {
            ...state,
            user: null,
            token: null,
            userLocation: '',
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        }
    }
    if (action.type === TOGGLE_SIDEBAR) {
        return {
            ...state,
            showSidebar: !state.showSidebar,
        }
    }
    if (action.type === LOGOUT_USER) {
        return {
            ...initialState,
            user: null,
            token: null,
            userLocation: '',
            jobLocation: '',
        }
    }
    if (action.type === UPDATE_USER_BEGIN) {
        return {
            ...state,
            isLoading: true,
        }
    }
    if (action.type === UPDATE_USER_SUCCESS) {
        return {
            ...state,
            user: action.payload.user,
            token: action.payload.token,
            userLocation: action.payload.location,
            jobLocation: action.payload.location,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'User Information Saved!'
        }
    }
    if (action.type === UPDATE_USER_ERROR) {
        return {
            ...state,
            isLoading: false
        }
    }
    if (action.type === HANDLE_BET_CHANGE) {
        return {
            ...state,
            [action.payload.name]: action.payload.value
        }
    }
    if (action.type === CLEAR_BET_STATE) {
        const initialState = {
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
            betStatusOptions: ["Won", "Lost", "Push", "Live", "Unsettled"],
        }
        return { ...state, ...initialState }
    }
    if (action.type === CREATE_BET_BEGIN) {
        return {
            ...state,
            isLoading: true,
        }
    }
    if (action.type === CREATE_BET_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'Bet Created!'
        }
    }
    if (action.type === CREATE_BET_ERROR) {
        return {
            ...state,
            isLoading: false
        }
    }
    if (action.type === GET_BETS_BEGIN) {
        return {
            ...state,
            isLoading: true,
            showAlert: false,
        }
    }
    if (action.type === GET_BETS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            bets: action.payload.bets,
            totalBets: action.payload.totalBets,
            numOfPages: action.payload.numOfPages,
        }
    }

    throw new Error(`no such action : ${action.type}`)
}

export default reducer