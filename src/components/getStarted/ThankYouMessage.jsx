import React, { Component } from "react";
import { Button, Typography } from "@material-ui/core";

class ThankYou extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: "",
      orderNumber: "",
      OrderData: [],
    };
  }
  /**
   * @Desc updating the removeitem from local storage on page load.
   * @memberof ThankYou
   */
  componentDidMount() {

    if (sessionStorage.getItem("_sc_re")) {
      var event = new CustomEvent("cartitem");
      document.dispatchEvent(event);
      this.setState({ OrderData: (sessionStorage.getItem("_sc_re") ? JSON.parse(sessionStorage.getItem("_sc_re")) : []) });
    }
  
  }

  /**
   * @Desc moving to homescreen.
   * @memberof ThankYou
   */
  goToHome = () => {
    this.props.history.push("/home");
  };

  /**
   * @desc Add tax to given price
   * @param {*} price
   */
  taxCalculation = price => {
    let taxPercent = 8.5; // static tax(in %)
    return Number((price * taxPercent) / 100);
  };

  render() {
    return (
      <div className="wizard-step">
        <div className="step-header thank-you">
          <div className="step-header-type"></div>
        </div>
        <div className="thankyou-container">
          <div className="thankyou">
            <div className="thankyou-header">
              <Typography variant="h2">
                Your Order Has Been Sent!
              </Typography>
            </div>
            <div className="thankyou-content">
              <div className="thankyou-image"></div>
              <div className="thankyou-line1">A confirmation email and reciept has been sent to the email provided. Thank you for shopping with Frito Lay!</div>
              <div className="thankyou-line2">If you have any questions or need to get a hold of customer support, please call 1-800-900-9000, or email customersupport@fritolay.com</div>
            </div>
          </div>
        </div>
        <div className="thankyou-action">
          <Button
            className="btn-mui btn-yellow"
            id="goToHome"
            onClick={() => {
              this.goToHome();
            }}
          >
            Done
          </Button>
        </div>
      </div>
    );
  }
}

export default ThankYou;
