/**
 *
 * @desc Redux reducer
 */

import * as types from "../actions/actions";

/**
 * @desc Initial state / default state value
 */
const initialState = {
  Products: [],
  loginResponse: "",
  totalProduct: 0,
  createCustomer: {},
};

const reducer = (state, action) => {
  if (typeof state === "undefined") {
    return initialState;
  }

  switch (action.type) {
    //set state data to initial state and return to action

    case types.PRODUCTS:
      return Object.assign({}, state, {
        Products: action.Products,
        totalProduct: action.totalProduct,
        ispagination: action.ispagination,
      });

    case types.PRODUCTDESCRIPTION:
      return Object.assign({}, state, {
        productdetails: action.productdetails,
      });

    case types.FILTERVALUES:
      return Object.assign({}, state, {
        filterProducts: action.filterProducts,
      });

    case types.ZIPCODE:
      return Object.assign({}, state, {
        zipResponse: action.zipResponse,
        validationMessage: action.validationMessage,
      });
    case types.LABEL_LIST:
      return Object.assign({}, state, {
        labelList: action.labelList,
      });

    case types.CREATECUSTOMER:
      return Object.assign({}, state, {
        createCustomer: action.createCustomer,
      });
    case types.MIN_AMOUNT:
      return Object.assign({}, state, {
        minAmount: action.minAmount,
      });
    case types.PRODUCT_AVAILABILITY:
      return Object.assign({}, state, {
        productInventory: action.productInventory,
      });
    default:
      // need this for default case
      return state;
  }
};
export default reducer;
