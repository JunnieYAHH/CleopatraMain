import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
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
                productCount: action.payload.productCount,
                resPerPage: action.payload.resPerPage,
                filteredProductsCount: action.payload.filteredProductsCount,
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

export const productDetailsReducer = (state = {product: {}}, action ) => {
    switch(action.type) {
        
        case PRODUCT_DETAILS_REQUEST:
            return{
                ...state,
                loading:true,
                
            }

        case PRODUCT_DETAILS_SUCCESS:
            // console.log('Product Details:', action.payload); // Log the payload
                return{
                    loading: false,
                    product: action.payload
                }
        
        case PRODUCT_DETAILS_FAIL:
                    return{
                        ...state,
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