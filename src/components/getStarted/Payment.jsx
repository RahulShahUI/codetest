import React from "react";
import APIUtil from "../../config/APIUtil";
import UrlConstants from "../../config/UrlConstants";
import { setInterval } from "timers";
class Payment extends React.Component {
  instance;
  state = {
    payload: "",
    accountId: 2,
    url:UrlConstants.PaymentStatus,
    APIUtil:APIUtil,
  };

  
  /**
   * @Desc For  setting and getting the client token via props.
   * @memberof Store
   */
  componentWillMount() {
    var that = this;
    window.document.addEventListener("paymentResponse", function(e) {
      that.getPaymentResponse(that);
    })
  }

  getPaymentResponse(that){
    var myInterval = setInterval(() => {
      if(sessionStorage.getItem("orderNumber")){
        let data = {"orderNumber" : sessionStorage.getItem("orderNumber")}
        return that.state.APIUtil.postMethod(that.state.url, data, true).then(response => {
          let data = response.data.data;
          if(data.cybersourceResponse){
            if(data.cyberSourcePaymentComplete){
              clearInterval(myInterval);
              sessionStorage.setItem("_sc_re", JSON.stringify(data));
              sessionStorage.removeItem("total");
              sessionStorage.removeItem("orderNumber");
              sessionStorage.removeItem("cartItems");
              sessionStorage.removeItem("subtotal");
              sessionStorage.removeItem("tax");
              sessionStorage.removeItem("isthankyou");
              sessionStorage.removeItem("regData");
              sessionStorage.removeItem("formValues");
              sessionStorage.removeItem("billingValues");
              sessionStorage.removeItem("errorMSG");
              sessionStorage.removeItem("shippingCharge");
              var event = new CustomEvent("cartitem");
              document.dispatchEvent(event);
              window.top.location.href = process.env.REACT_APP_SITE_URL + "/#/thankyou";
            } else {
              clearInterval(myInterval);
              sessionStorage.removeItem("orderNumber");
              sessionStorage.removeItem("isthankyou");
              sessionStorage.setItem("errorMsg", UrlConstants.errorMsg);
              window.top.location.href = process.env.REACT_APP_SITE_URL + "/#/signupsteps?status=2";
              window.top.location.reload();
            }
          }
        }).catch((response) => {
          sessionStorage.setItem("errorMsg", UrlConstants.errorMsg);
          window.top.location.reload();
        });
      }
    }, 2000);
    
  }
  
  render() {  
    
      return (
        <div>
		   <iframe width="" height="" src={process.env.REACT_APP_SITE_URL + "/#/cybersource"}
                    frameBorder='0' 
                    className="iframestyle" 
                    sandbox="allow-top-navigation allow-scripts allow-forms allow-same-origin"
                    allowFullScreen
          title='payment'/>
		  
        </div>
      );
    
  }
}

export default Payment;
