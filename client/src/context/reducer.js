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
    SET_EDIT_BET,
    EDIT_BET_BEGIN,
    EDIT_BET_SUCCESS,
    EDIT_BET_ERROR,
    DELETE_BET_BEGIN,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTER_STATE,
    CHANGE_PAGE,
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
    if (action.type === HANDLE_BET_CHANGE) {
        return {
            ...state,
            [action.payload.name]: action.payload.value,
            page: 1
        }
    }
    if (action.type === CLEAR_BET_STATE) {
        const initialState = {
            isEditing: false,
            showAlert: false,
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
    if (action.type === CLEAR_FILTER_STATE) {
        const initialState = {
            isEditing: false,
            showAlert: false,
            editBetId: '',
            search: '',
            searchType: '',
            searchSource: 'all',
            searchCategory: 'all',
            searchOddsMaker: 'all',
            searchPick: 'all',
            searchStatus: 'all',
            sort: 'newest',
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
    if (action.type === SET_EDIT_BET) {
        const bet = state.bets.find(bet => bet._id === action.payload.id)
        const { _id, betSource, eventCategory, eventDescription, oddsMaker, pick, spread, wager, betStatus } = bet
        return {
            ...state,
            isEditing: true,
            editBetId: _id,
            betSource: betSource,
            eventCategory: eventCategory,
            eventDescription: eventDescription,
            oddsMaker: oddsMaker,
            pick: pick,
            spread: spread,
            wager: wager,
            betStatus: betStatus,
        }
    }
    if (action.type === EDIT_BET_BEGIN) {
        return {
            ...state,
            isLoading: true,
        }
    }
    if (action.type === EDIT_BET_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            isEditing: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'Bet Updated!'
        }
    }
    if (action.type === DELETE_BET_BEGIN) {
        return {
            ...state,
            isLoading: true,
        }
    }
    if (action.type === SHOW_STATS_BEGIN) {
        return {
            ...state,
            isLoading: true,
            showAlert: false,
        }
    }
    if (action.type === SHOW_STATS_SUCCESS) {
        return {
            ...state,
            stats: action.payload.stats,
            monthlyBets: action.payload.monthlyBets,
            isLoading: false
        }
    }
    if (action.type === TOGGLE_SIDEBAR) {
        return {
            ...state,
            showSidebar: !state.showSidebar,
        }
    }
    if (action.type === CHANGE_PAGE) {
        return {
            ...state,
            page: action.payload.page
        }
    }

    throw new Error(`no such action : ${action.type}`)
}

export default reducer