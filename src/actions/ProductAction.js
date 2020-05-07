/**
 * 
 * @description: All Product Action api are called here.
 * @exports : action defined for api call.
 * @memberof: ProductAction.js 
 * 
 */

import * as types from "./actions";
import APIUtil from "../config/APIUtil";
import UrlConstants from "../config/UrlConstants";



/**
 *
 * @description action performed to get the products listing for the ProductList page.
 * @param {*} brandName used to get the brand Value that is being searched.
 * @param {*} sizeName used to get the Size of the item that is being searched.
 * @param {*} flavorsName used to get the flavour Value that is being searched.
 * @param {*} id is the unique identification number that is used for accessing products.
 * @let {*} url: For setting the url for ProductsUrl.
 * @returns filters for the products list (brand, size and flavours)
 * 
 */
export function actiongetProduct(data) {
  if(!!data && data.limit > 0){
    let url = UrlConstants.ProductsUrl;
    return function (dispatch) {
      return APIUtil.postMethod(url, data, false).then(response => {
        let products = response.data ? response.data : "";
        if (response.status === 200) {
          dispatch({
            type: types.PRODUCTS,
            Products: products,
            totalProduct: products.totalProducts
          });
        } else {
          dispatch({
            type: types.PRODUCTS,
            Products: [],
            totalProduct: 0
          });
        }
        return products;
      });
    };
  }
 
}

/**
 *
 * @description action perfomed to get the product details.
 * @param {*} id: id is the unique id for each product.
 * @let {*} postData : For storing the id of the product.
 * @let {*} url: For setting the url for product detail.
 * @returns products detail response.
 * 
 */
export function actiongetProductDetail(id) {
  let postData = {
    prodId: id
  };
  let url = UrlConstants.ProductDetailUrl;
  return function (dispatch) {
    return APIUtil.postMethod(url, postData, false).then(response => {
      let products = response.data.data;
      products = [].concat(products);

      if (response.status === 200) {
        dispatch({
          type: types.PRODUCTDETAILS,
          Products: products
        });
      } else {
        dispatch({
          type: types.PRODUCTDETAILS,
          Products: []
        });
      }
      return products;
    });
  };
}


/**
 * 
 * @description action performed to get the filter list for products.
 * @let {*} url: For setting the url for FilterProducts .
 * @returns filter list response.
 * 
 */
export function actiongetFilter() {
  let url = UrlConstants.FilterProducts;

  return function (dispatch) {
    return APIUtil.getMethod(url, true).then(response => {
      if (response.status === 200) {
        dispatch({
          type: types.FILTERVALUES,
          filterProducts: response.data.data
        });
      } else {
        dispatch({
          type: types.FILTERVALUES
        });
      }
      return "";
    });
  };
}




/**
 * @description action performed to get the zipcode value.
 * @export
 * @param {*} values for setting the zipcode.
 * @let postData for storing the ZipCode Value.
 * @let url : for setting the url for Zip Code.
 * @returns Zip code response value.
 */
export function actionZipcodeVerification(values) {
  let postData = {
    zipcode: values.zipcode
  };
  let url = UrlConstants.ZipValidation;
  return function (dispatch) {
    return APIUtil.postMethod(url, postData, true).then(response => {
      if (response.status === 200) {
        dispatch({
          type: types.ZIPCODE,
          zipResponse: response
        });
      } else {
        dispatch({
          type: types.ZIPCODE,
          zipResponse: ""
        });
      }
    });
  };
}

/**
 * @description For getting the label from the api for the ui.
 * @export
 * @let url : for setting the url for labelList.
 * @returns Label list response.
 */
export function actionLabelList() {
  let url = UrlConstants.LabelsList;
  return function (dispatch) {
    return APIUtil.postMethod(url, true).then(response => {
      if (response.status === 200) {
        dispatch({
          type: types.LABEL_LIST,
          labelList: response.data.data
        });
      } else {
        dispatch({
          type: types.LABEL_LIST,
          labelList: ""
        });
      }
    });
  };
}


/**
 * 
 * @description action performed to set a registration form for a customer and Create a customer.
 * @export
 * @let url : for setting the url for CreateCustomer.
 * @param {*} fields for the customer to fill there details for registring.
 * @let customerPostData for setting feilds to a vairable.
 * @returns customer details to api.
 * 
 */
export function actionCreateCustomer(fields) {
  let customerPostData = {
    customer: {
      customerfirstname: fields.firstname,
      customerlastname: fields.lastname,
      customeremail: fields.email,
      customercompany: "",
      customerstreet: "",
      customercountry: "",
      customerstate: "",
      customercity: "",
      customerzip: "",
      customerPhone1: fields.contact
    },
    shipping: {
      shippingFirstname: fields.shippingFirstname,
      shippingLastname: fields.shippingLastname,
      shippingAddressline1: fields.shippingAddressLine1,
      shippingAddressline2: fields.shippingAddressLine2,
      shippingCountry: fields.shippingCountry,
      shippingState: fields.shippingState,
      shippingCity: fields.shippingCity,
      shippingZip: fields.shippingZipCode
    },
    billing: {
      billingFirstname: fields.billingFirstname,
      billingLastname: fields.billingLastname,
      billingAddressline1: fields.billingAddressLine1,
      billingAddressline2: fields.billingAddressLine2,
      billingCountry: fields.billingCountry,
      billingState: fields.billingState,
      billingCity: fields.billingCity,
      billingZip: fields.billingZipCode
    }
  };

  let url = UrlConstants.CreateCustomer;
  return function (dispatch) {
    return APIUtil.postMethod(url, customerPostData, true).then(response => {
      if (response.status === 200) {
        dispatch({
          type: types.CREATECUSTOMER,
          createCustomer: response.data
        });
      } else {
        dispatch({
          type: types.CREATECUSTOMER,
          createCustomer: ""
        });
      }
    });
  };
}



/**
 * 
 * @description For Getting the Min amount to purchsase the products.
 * @let url : for setting the url for MinAmount.
 * @export
 * @returns min amount from api .
 */
export function actionGetMinAmount() {

  let url = UrlConstants.MinAmount;
  return function (dispatch) {
    return APIUtil.getMethod(url, false).then(response => {
      if (response.status === 200) {
        dispatch({
          type: types.MIN_AMOUNT,
          minAmount: response.data.data
        });
      } else {
        dispatch({
          type: types.MIN_AMOUNT,
          minAmount: {}
        });
      }
    });
  };
}


/**
 * @Desc check product availability
 *
 * @export
 * @returns
 */
export function actionCheckProductAvailability(postData) {
  
  let url = UrlConstants.ProductInventory;
  return function (dispatch) {
     return APIUtil.postMethod(url, postData, true).then(response => {
      if (response.status === 200) {
        dispatch({
          type: types.PRODUCT_AVAILABILITY,
          productInventory: response.data.data
        });
      } else {
        dispatch({
          type: types.PRODUCT_AVAILABILITY,
          productInventory: {}
        });
      }
    });
  };
}