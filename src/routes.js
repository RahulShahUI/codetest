import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import productdetail from "./components/getStarted/ProductDetail";
import CyberSource from "./components/CyberSource/Pay";
import InvalidZip from "./components/errorPage/InvalidZip";
import SignUpSteps from "./components/getStarted/SignUpSteps";
import thankyou from "./components/getStarted/ThankYouMessage";
import Home from "./components/home/Home";

import ContactUs from "./components/ContactUs/contactUs";
import TermsOfService from "./components/policyPages/termsOfService";
import PrivacyPolicy from "./components/policyPages/privacyPolicy";
import AdsTracking from "./components/policyPages/adsTracking";
import RouteRapper from "./components/RouteRapper";
import ScrollToTop from "./components/ScrollTop";

export class Routes extends Component {


  render() {
 

    return (
      <ScrollToTop>
        <Switch>
          <RouteRapper path="/" exact component={Home} />
          <RouteRapper path="/home" exact component={Home} />
          <Route exact path="/cybersource" component={CyberSource} />
          <RouteRapper exact path="/invalidzip" component={InvalidZip} />
          <RouteRapper exact path="/signupsteps" component={SignUpSteps} />
          <RouteRapper exact path="/productdetail" component={productdetail} />
          <RouteRapper exact path="/thankyou" component={thankyou} />
          <RouteRapper path="/contactus" component={ContactUs} />
          <RouteRapper path="/terms-of-service" component={TermsOfService} />
          <RouteRapper path="/privacy-policy" component={PrivacyPolicy} />
          <RouteRapper path="/ads-tracking" component={AdsTracking} />
          <Redirect from="/" to="/home" />
        </Switch>
      </ScrollToTop>
    );
  }
}
export default Routes;
