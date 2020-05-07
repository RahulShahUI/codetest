import { Container, Grid } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { actionCreateCustomer } from "../../actions/ProductAction";
import OrderSummary from "./OrderSummary";
import Payment from "./Payment";
import Registration from "./registration/Registration";
import ThankYouMessage from "./ThankYouMessage";
import Spinner from '../Spinner';
class check extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner:false,
      isPayment: 0,
      keyData:0,
      showLogin: true,
      showRegister: false,
      loggedinReg: false,
      errorMessage: false,
      summuryTaxData:{},
      isSummuryLoader:false,
      //zipcodeValidData:null,
    };
  }

  componentDidMount() {
    var that = this;
    document.addEventListener("showLogin", function (e) {
      let showLogin = sessionStorage.getItem("showLogin");
      if (!!showLogin) {
        that.setState({ showLogin: true, showRegister: false });
      }
      // Rerendering the component
      that.forceUpdate();
    });
    setTimeout(function () {
      window.scrollTo(0, 0);
    }, 10);

    // registration filled information
    // event listener for the change in local storage
    document.addEventListener("tokenLogin", function (e) {
      let cartItems = sessionStorage.getItem("token");

      if (cartItems) {
        that.setState({ loggedinReg: true });
      }
      // Rerendering the component
      that.forceUpdate();
    });
  }

  /**
   *@description for submiting the order and move to payment page. 
   *
   * @param {*} fileds
   * @memberof check
   */
  ordersubmission(fileds) {
    this.props.submitOrder(fileds).then(res => {
      if (this.props.submitResponse.success === true) {
        this.showPayment();
      } else {
        this.setState({ errorMessage: true });
      }
    })
  }

  /**
   * @description for filling up the registration page and move to payment page.
   * @param {*} fileds
   * @memberof check
   */
  createCustomer(fileds) {
    //let filedData = fileds
    this.setState({spinner:true});
    this.props.actionCreateCustomer(fileds).then(res => {
      if (this.props.createCustomerDetail.success === true) {
        this.setState({spinner:false});
        this.showPayment();
        //this.ordersubmission(filedData)
      } else {
        this.setState({ errorMessage: true,spinner:false });
      }
    }).catch((productData) => {
      this.setState({spinner:false});
    });
  }

  /**
   * @description Add tax to given price
   * @param {*} price
   */
  taxCalculation = price => {
    let taxPercent = 8.5; // static tax(in %)
    return Number((price * taxPercent) / 100);
  };

  /**
   * @description show Login Accordion
   * @memberof check
   * 
   */
  showLoginAccordion() {
    this.setState({
      showLogin: !this.state.showLogin,
      showRegister: false
    });
  }

  /**
   * @description show Register Accordion
   * @memberof check
   * 
   */
  showRegisterAccordion() {
    sessionStorage.removeItem("showLogin");
    this.setState({
      showRegister: !this.state.showRegister,
      showLogin: false
    });
  }

  /**
   * @description show payment screen
   * @memberof check
   */
  showPayment() {
    window.scrollTo(0, 0);
    this.setState({
      isPayment: 1
    });
  }

  /**
   * @description show login/registration accordion
   * @memberof check
   */
  goToLogin() {
    this.setState({
      isPayment: 0
    });
  }

  /**
   * 
   * @description show Thanku screen
   * @memberof check
   */
  OrderPlaced() {
    this.setState({
      isPayment: 2
    });
    this.props.isThanku();
  }

  /**
   *
   *@description for getting the field values that have been filled in the registration form.
   * @param {*} fields
   * @memberof check
   */
  getFields(fields) {
    this.setState({ formData: fields })

  }

  render() {
   
    return (
      <div>
        <div>
          {this.state.spinner?<Spinner/>:"" }
          <div className="wizard-step">
            <div className="step-header shipping-details">
              <div className="step-header-type"></div>
            </div>
            <Container className="container-root checkout-container">
           {this.state.isPayment === 0  ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} className="checkout-form-wrapper">
                  
                    
                      <div className="checkout-content-wrapper">
                        
                        {/* Registration content */}
                        <div
                          className= "checkout-content active"
                          
                        >
                          
                          
                          <div className="checkout-content-body">
                            <Registration
                              zipcodeValidData={this.props.zipcodeValidData}
                              moveToPrevStepCheckout={() =>
                                this.props.moveToPrevStep()
                              }
                              getTaxtLoader={(data,summuryData) => this.setState({isSummuryLoader:data,summuryTaxData:summuryData},() => this.setState({summuryTaxData:summuryData}))}
                              createCustomer={fileds =>this.createCustomer(fileds) }
                              spinner={this.props.spinner}
                            />
                          </div>
                          
                        </div>
                      </div>
                    
                  {this.state.errorMessage ? <h1>Some Technical Issue</h1> : ""}

                  {this.state.isPayment === 2 ? <ThankYouMessage /> : ""}

                  </Grid>

                  {/* order summary */}
                  <Grid item xs={12} sm={6} className="summary-col">
                    <OrderSummary 
                    summuryTaxData={this.state.summuryTaxData}
                    isSummuryLoader={this.state.isSummuryLoader}
                    shippingCharges = {this.props.shippingCharges}
                    editCart={this.props.editCart}
                    taxCalculation={this.taxCalculation} />
                  </Grid>
                </Grid>) : ""}
               
                <Grid container spacing={2}>             
                   {this.state.isPayment === 1 ? (
                <Grid item xs={12} className="payment-grid">
                  {/* Payment */}
                    <Payment
                      onRef={ref => (this.payment = ref)}
                      payload={e => {
                        this.setState({ payload: e });
                      }}
                      fields={this.state.formData}
                      showPayment={() => this.showPayment()}
                      goToLogin={() => this.goToLogin()}
                      OrderPlaced={() => this.OrderPlaced()}
                    />
                     
                </Grid>)
                : (
                  ""
                )}
                </Grid>

          </Container>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    submitResponse: state.reducer.submit,
    createCustomerDetail: state.reducer.createCustomer
  };
};
export default 
  connect(mapStateToProps, {  actionCreateCustomer })(
    withRouter(check)
  
);
