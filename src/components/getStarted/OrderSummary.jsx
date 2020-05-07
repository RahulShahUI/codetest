import React, { Component } from "react";
// material imports
import { Button, Dialog, DialogContent, Grid, Typography } from "@material-ui/core";
import Spinner from "../Spinner";
/**
 * @desc class component for order summary details while checkout
 */
class OrderSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems:
      this.props.isthakyou?(sessionStorage.getItem("_sc_re")?JSON.parse(sessionStorage.getItem("_sc_re")).items:[]):JSON.parse(sessionStorage.getItem("cartItems"))
      ? JSON.parse(sessionStorage.getItem("cartItems"))
      : [],
      total: 0,
      tax: 0,
      shippingCharge: 0.0,
      shippingCurrency: "$",      
      DialougeBoxOpen: false,
      //cartData: 
    };
  }

  
  /**
   * @description calculate total,tax and sub total
   * @memberof OrderSummary
   */
  componentDidMount() {

    if(!this.props.isthakyou){
      this.getData()

          if (!!this.props.shippingCharges) {
            this.setState(
              {
                shippingCharge: parseFloat(this.props.shippingCharges)               
              },
              () => [this.totalCalculation(null)]
            );
          } else {
            this.totalCalculation(null);
          }
        
    } else {
        let payData = JSON.parse(sessionStorage.getItem("_sc_re"));
        this.setState({
          shippingCharge:(payData.shipping?parseFloat(payData.shipping):0),
          shippingCurrency:payData.currencySymbol,
        }, () =>  this.totalCalculation(null))
    }
  }
  /**
   * @description for getting the product that are in cart.
   * @memberof OrderSummary
   * 
   */
  getData = () => {
    let cartItems = this.state.cartItems;
    var totalPrice = 0;
    if (cartItems.length > 0) {
      cartItems.map((items) => {
        var total = items.price * items.quantity;
        totalPrice = totalPrice + total;
        return true;
      });
    }

  }

  /**
   * @description for calculation of the total amount of the products added in the cart.
   * @memberof OrderSummary
   */
  totalCalculation(summuryTaxData) {
    let total = 0;
    this.state.cartItems.map((cartItem, index) => {
      if (this.props.isthakyou) {
        total = total + cartItem.price * cartItem.qty;
      } else {
        total = total + cartItem.price * cartItem.quantity;
      }
      return true;
    });
    let tax = (!!summuryTaxData?summuryTaxData:0);
    let totalValue = total + this.state.shippingCharge;
    this.setState({ tax,total: totalValue });
    if (!this.props.isthakyou) {
      sessionStorage.setItem("tax", tax);
      sessionStorage.setItem("shippingCharge", this.state.shippingCharge);
      sessionStorage.setItem("total", (totalValue + tax).toFixed(2));
      sessionStorage.setItem("subtotal", total.toFixed(2));
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.someValue!==this.props.summuryTaxData){
      const summuryTaxData = (!!this.props.summuryTaxData?(!!this.props.summuryTaxData.data?this.props.summuryTaxData.data.totalTaxAmount:null):null);
      this.totalCalculation(summuryTaxData);
    }
  }


  /**
   * @description render order item data
   * @param {*} cartItem ; products that are in cart.
   * 
   */
  renderOrderItem(cartItem, index) {
    let totalPrice = 0;
 

    /** total price calculation based on product count group */
    if (!this.props.isthakyou) {
      totalPrice = cartItem.price * cartItem.quantity;
    } else {
      totalPrice = cartItem.price * cartItem.qty;
    }
    return (
      <Grid
        container
        spacing={3}
        alignItems="center"
        className="subtotal-row"
        key={"cartItem" + index}
      >
        <Grid item sm={3} xs={3}>
          <div className="summary-img">
              <img alt="Product" src={cartItem.image} /> 
          </div>
        </Grid>
        <Grid item sm={5} xs={5}>
          <div className="item-desc">
            {!this.props.isthakyou ? (cartItem.productDescription ? cartItem.productDescription : cartItem.shortDescription) : cartItem.name}
          </div>
        </Grid>

        <Grid item sm={2} xs={2}>
            <div className="item-qty text-right">
              {!this.props.isthakyou ? cartItem.quantity : cartItem.qty}
            </div>
        </Grid>

        <Grid item sm={2} xs={2}>
          <div className="count-total text-right">${totalPrice.toFixed(2)}</div>
        </Grid>
      </Grid>
    );
  }

  render() {
    // console.log("summuryTaxData",this.props.summuryTaxData);
    return (
      <div className="summary-right" id="summary-sec">
        {/* <div className="summary-header">
          {this.props.isSummuryLoader?<Spinner />:""}
          <Typography variant="h2">Your Order Summary</Typography>
          <Button
            variant="contained"
            color="primary"
            className="btn-mui btn-blue btn-outlined"
            id="editCart"
          >
            Edit Cart
          </Button>
        </div> */}
        <div className="summary-header">
          <Typography variant="h2">
            Your Order Summary
          </Typography>
          <span onClick={() => {
            this.props.editCart();
          }}>Edit Cart</span>
        </div>
        <div className="summary-bottom">
          
          {this.state.cartItems.map((cartItem, index) => {
            return this.renderOrderItem(cartItem, index);
          })}

          {/* shipping charges */}
          <div className="summary-bottom-row">
            <Grid container spacing={0} alignItems="center">
              <Grid
                item
                sm={10}
                xs={10}
                className="summary-shipping"
              >
                Shipping
              </Grid>
              <Grid item sm={2} xs={2}>
                <div>
                  {/* this.state.shippingCurrency !== "" && */
                  parseFloat(this.state.shippingCharge) > 0 ? (
                    <div className="summary-shipping-value">
                      {this.state.shippingCurrency}
                      {this.state.shippingCharge}
                    </div>
                  ) : (
                    <div className="summary-shipping-value">
                      Free
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>

          <div className="summary-bottom-row">
            <Grid container spacing={0} alignItems="center">
              <Grid
                item
                sm={10}
                xs={10}
                className="summary-tax"
              >
                Tax <span>({!!this.props.summuryTaxData && this.props.summuryTaxData.zipcode?this.props.summuryTaxData.zipcode:sessionStorage.getItem("Zipcode")})</span>
              </Grid>
              <Grid item sm={2} xs={2}>
                <div className="summary-shipping-value">
                  ${this.state.tax.toFixed(2)}
                </div>
              </Grid>
            </Grid>
          </div>

          <div className="products-total">
            <div className="products-total-inner">
              <Grid
                container
                spacing={0}
                justify="space-between"
                alignItems="center"
              >
                <Grid item className="total">Total</Grid>
                <Grid item className="total-amount">
                  <i>$</i>{(this.state.total + this.state.tax).toFixed(2)}
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
        <Dialog
          open={this.state.DialougeBoxOpen}
          onClose={() => {
            this.setState({ DialougeBoxOpen: false });
          }}
          aria-labelledby="responsive-dialog-title"
          maxWidth={false}
          classes={{
            paper: "modal-container",
            root: "modal-stack-top",
          }}
        >
          <DialogContent>
            <div style={{ textAlign: "center" }}>
              <h2>Something went Wrong</h2>
            </div>
          </DialogContent>
          <Button
            id="errorCatch"
            onClick={() => {
              this.setState({ DialougeBoxOpen: false });
            }}
          >
            Close
          </Button>
        </Dialog>
      </div>
    );
  }
}


export default OrderSummary;
