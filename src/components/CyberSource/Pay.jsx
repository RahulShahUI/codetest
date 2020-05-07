import React, { Component } from "react";
import APIUtil from "../../config/APIUtil";
import { Grid } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import UrlConstants from "../../config/UrlConstants";
const regData = JSON.parse(sessionStorage.getItem("regData"));
const totalPrice = sessionStorage.getItem("total");
const cartItem = JSON.parse(sessionStorage.getItem("cartItems"));
const getDate = new Date().getTime();
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      clientToken: false,
      data: {}
    };
  }
 
  /**
   * 
   * @description for getting the all field value mentioned below and setting it.
   * @returns obj 
   * @memberof Home
   * 
   */
  getcyberSourceData(){
    var obj = {};
    obj.access_key = process.env.REACT_APP_CYBERSOURCE_ACCESS_KEY;
    obj.profile_id = process.env.REACT_APP_CYBERSOURCE_PROFILE_ID;
    obj.signed_field_names = "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,override_custom_receipt_page";
    obj.unsigned_field_names = "device_fingerprint_id,bill_to_forename,bill_to_address_line1,bill_to_address_city,bill_to_address_country,bill_to_address_state,bill_to_email,bill_to_surname,bill_to_address_postal_code";
    obj.locale = 'en-us';
    obj.transaction_type = 'authorization';
    obj.device_fingerprint_id = Math.floor(Math.random() * Math.floor(Math.random() * getDate));
    obj.amount = totalPrice;
    obj.currency = 'USD';
    obj.consumer_id = '1234';
    obj.payment_method = 'card';
    obj.bill_to_forename = regData.billingFirstname;
    obj.bill_to_surname = regData.billingLastname;
    obj.bill_to_email = regData.email;
    obj.bill_to_phone = regData.contact;
    obj.bill_to_address_line1 = regData.billingAddressLine1;
    obj.bill_to_address_line2 = regData.billingAddressLine2;
    obj.bill_to_address_city = regData.billingCity;
    obj.bill_to_address_state = regData.billingState;
    obj.bill_to_address_country = regData.billingCountry;
    obj.bill_to_address_postal_code = regData.billingZipCode;
    obj.auth_trans_ref_no =  obj.device_fingerprint_id;
    obj.override_custom_receipt_page = process.env.REACT_APP_CYBERSOURCE_BACK_RESPONSE;
    return obj;
  }

  /**
   * @description for getting the data for multiple product added in the cart.
   * @returns cartData.
   * @memberof Home
   */
  getMultiplexItemData(){
    let cartData = [];
    if(cartItem.length>0) {
      cartItem.map(items => {
        // console.log("items",items);
          var objData = {
            "id":items.id,
            "productId": items.productId,
            "name": items.title,
            "qty": items.quantity,
            "price": items.price,
            "total": (items.price*items.quantity)
          }
          cartData.push(objData);
          return true;
      })
    }
    return cartData;
  }

  componentDidMount() {
    let url = UrlConstants.SubmitOrder;
    var obj = this.getcyberSourceData();
    let orderSubmitionData = {
      accountId: Math.floor(Math.random() * Math.floor(Math.random() * getDate)),
      customerfirstname: regData.firstname,
      customerlastname: regData.lastname,
      customeremail: regData.email,
      customercompany: "",
      customerstreet: regData.billingAddressLine1+", "+regData.billingAddressLine2,
      customercountry: regData.billingCountry,
      customerstate: regData.billingState,
      customercity: regData.billingCity,
      customerzip: regData.billingZipCode,
      customerPhone1: regData.contact,
      shippingFirstname: regData.shippingFirstname,
      shippingLastname: regData.shippingLastname,
      shippingAddressline1: regData.shippingAddressLine1,
      shippingAddressline2: regData.shippingAddressLine2,
      shippingCountry: regData.shippingCountry,
      shippingState: regData.shippingState,
      shippingCity: regData.shippingCity,
      shippingZip: regData.shippingZipCode,
      billingFirstname: regData.billingFirstname,
      billingLastname: regData.billingLastname,
      billingAddressline1: regData.billingAddressLine1,
      billingAddressline2: regData.billingAddressLine2,
      billingCountry: regData.billingCountry,
      billingState: regData.billingState,
      billingCity: regData.billingCity,
      billingZip: regData.billingZipCode,
      signData: obj,
      items: this.getMultiplexItemData(),
      tax:sessionStorage.getItem("tax"),
      total:sessionStorage.getItem("total"),
      subtotal:sessionStorage.getItem("subtotal"),
      shipping:sessionStorage.getItem("shippingCharge")
    }
    return APIUtil.postMethod(url, orderSubmitionData, true).then(response => {
      let resData = response.data.data;
      if(response.data.success){
        if(!!resData.orderNumber){
            sessionStorage.setItem("isthankyou",true);
            sessionStorage.setItem("orderNumber",resData.orderNumber);
            var event = new CustomEvent('paymentResponse');
            window.parent.document.dispatchEvent(event);
            let signData = resData.signData.data;
            if(signData.signature){
                obj.signature = signData.signature;
                obj.reference_number = signData.reference_number;
                obj.signed_date_time = signData.signed_date_time;
                obj.transaction_uuid = signData.transaction_uuid;
                this.setState({ clientToken: true, data: obj }, () => {
                  setTimeout(() => { document.forms['cybersourcePayment'].submitbtn.click() }, 1000);
                });
          }
        } else {
          //return false;
          sessionStorage.setItem("errorMsg", UrlConstants.errorMsg);
          window.top.location.href = process.env.REACT_APP_SITE_URL + "/#/signupsteps?status=2";
          window.top.location.reload();
        }
      } else {
        //return false;
        sessionStorage.setItem("errorMsg", UrlConstants.errorMsg);
        window.top.location.href = process.env.REACT_APP_SITE_URL + "/#/signupsteps?status=2";
        window.top.location.reload();
      }
    }).catch((productData) => {
      //return false;
      sessionStorage.setItem("errorMsg", UrlConstants.errorMsg);
      window.top.location.href = process.env.REACT_APP_SITE_URL + "/#/signupsteps?status=2";
      window.top.location.reload();
    });
  }
  /**
   * @description for hiding the loader on payment page after set time interval.
   * @memberof Home
   */
  hideLoader() {
    this.setState({ clientToken: true })
  }
  
  render() {
    const data = this.state.data;
    const itemData = this.getMultiplexItemData();
    return (
      <>
        {!this.state.clientToken ?
          <Grid container spacing={3} justify="center">
            <Grid item>
              <CircularProgress className="color-primary" />
            </Grid>
          </Grid> : ""}
        <form action={process.env.REACT_APP_CYBERSOURCE_PAY} method="post" id="cybersourcePayment">
          <input type="hidden" name="access_key" value={data.access_key} />
          <input type="hidden" name="profile_id" value={data.profile_id} />
          <input type="hidden" name="transaction_uuid" value={data.transaction_uuid} />
          <input type="hidden" name="signed_field_names" value={data.signed_field_names} />
          <input type="hidden" name="unsigned_field_names" value={data.unsigned_field_names} />
          <input type="hidden" name="signed_date_time" value={data.signed_date_time} />
          {/*<input type="hidden" name="merchant_descriptor" value={data.merchant_descriptor} />
          <input type="hidden" name="auth_trans_ref_no" value={data.auth_trans_ref_no} /> */}        
          <input type="hidden" name="device_fingerprint_id" value={data.device_fingerprint_id} />
          <input type="hidden" name="locale" value={data.locale} />
          <input type="hidden" name="payment_method" value={data.payment_method} />
          <input type="hidden" name="transaction_type" value={data.transaction_type} />
          <input type="hidden" name="reference_number" value={data.reference_number} />
          <input type="hidden" name="amount" value={data.amount} />
          <input type="hidden" name="currency" value={data.currency} />
          <input type="hidden" name="consumer_id" value={data.consumer_id} />
          <input type="hidden" name="bill_to_forename" value={data.bill_to_forename} />
          <input type="hidden" name="bill_to_surname" value={data.bill_to_surname} />
          <input type="hidden" name="bill_to_email" value={data.bill_to_email} />
          <input type="hidden" name="bill_to_address_line1" value={data.bill_to_address_line1} />
          <input type="hidden" name="bill_to_address_line2" value={data.bill_to_address_line2} />
          <input type="hidden" name="bill_to_address_city" value={data.bill_to_address_city} />
          <input type="hidden" name="bill_to_address_state" value={data.bill_to_address_state} />
          <input type="hidden" name="bill_to_address_postal_code" value={data.bill_to_address_postal_code} />
          <input type="hidden" name="bill_to_address_country" value={data.bill_to_address_country} />
          <input type="hidden" name="line_item_count" value={itemData.length} />
          {
            itemData.length>0?
            itemData.map((e,index)=>{
              return(
                <React.Fragment>
                  <input type="hidden" name={`item_${index}_sku`} value={"SKU"+e.id} />
                  <input type="hidden" name={`item_${index}_code`} value={e.productId} />
                  <input type="hidden" name={`item_${index}_name`} value={e.name} />
                  <input type="hidden" name={`item_${index}_quantity`} value={e.qty} />
                  <input type="hidden" name={`item_${index}_price`} value={e.price} />
                </React.Fragment>
              )
            })
         :""}
          {/* <input type="hidden" name="date_of_birth" value ={data.date_of_birth}/>*/}
         <input type="hidden" name="override_custom_receipt_page" value={data.override_custom_receipt_page} />
          <input type="hidden" name="submit" value="Submit" />
          <input type="hidden" name="signature" value={data.signature} />
          <input style={{ display: "none" }} type="submit" name="submitbtn" value="submit" />
        </form>
      </>
    );
  }
}

export default Home;