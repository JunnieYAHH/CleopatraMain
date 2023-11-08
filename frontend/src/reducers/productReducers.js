import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    CLEAR_ERRORS
} from '../constants/productConstants';

const initialState = {
    loading: false,
    products: [],
    error: null
};

export const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ALL_PRODUCTS_REQUEST:
            return {
                loading: true,
                products: []
            }
        case ALL_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: action.payload.products,
                error: null
            }
        case ALL_PRODUCTS_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                loading: false,
                error: null
            }
        default:
            return state
    }
}
