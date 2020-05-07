/** material ui components */
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, IconButton, Typography, Button, Snackbar } from "@material-ui/core";
import { classes } from "istanbul-lib-coverage";
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { actiongetProductDetail, actionCheckProductAvailability } from "../../actions/ProductAction";
import Spinner from "../Spinner";
import UrlConstants from "../../config/UrlConstants";

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props,
      isLoaded: false,
      products: "",
      productItems: {},
      productItemsCopy: {},
      selectedItems: {},
      invlidProductData: [],
      msg: null
    };
    this.changeQuantity = this.changeQuantity.bind(this);
  }

  /**
   *
   * @description loading the product detail api.
   * @memberof ProductDetail
   */

  componentDidMount() {
    let productItems = this.props.items;
    const productItemsCopy = { ...this.props.items };
    this.setState({ productItems, productItemsCopy })
    if (this.props.id) {
      this.props.actiongetProductDetail(this.props.id.id).then(response => {
        if (response.length > 0) {
          var obj = { "productId": [response[0].productId] }
          this.props.actionCheckProductAvailability(obj).then(() => {
            if (parseInt(this.props.productInventory[0].availableQty) <= 0) {
              response[0].isOutofstock = 0;
            } else {
              response[0].isOutofstock = 1;
            }
            this.setState({ invlidProductData: this.props.productInventory, products: { ...response[0], quantity: this.props.id.quantity } })
          })
        }
      });
    }
  }

  /**
  * @description for increment and descremnt of the product. 
  * @param product : all the products from the product list.
  * @param action : action for increment , decremnt and input value for quantity of product.
  * @param val : manual input value of product quantity.
  * @memberof ProductDetail
  */
  checkAvailableQty(product, action, val) {
    var qty = (action === 'input' ? val : product.quantity);
    if (parseInt(qty) >= 0) {
      if (this.state.invlidProductData.length > 0) {
        if (action === 'increment') {
          qty = !isNaN(qty)?parseInt(qty)+1:1;
        } else if (action === 'decrement') {
          qty = !isNaN(qty)?parseInt(qty)-1:0;
          // if (parseInt(qty) > this.state.invlidProductData[0].availableQty) {
          //   this.changeQuantity(product, action, val);
          // }
        } else if (action === 'input') {
          qty = val;
        }
        if (parseInt(qty) > this.state.invlidProductData[0].availableQty) {
          let string = UrlConstants.qtyAvailableMsg;
          let qty = this.state.invlidProductData[0].availableQty;
          this.setState({ msg: string.replace(/##QTY##/g, function () { return parseInt(qty); }) }, () => {
            setTimeout(() => {
              this.setState({ msg: null });
            }, 3000);
          })
        } else {
          this.changeQuantity(product, action, val);
        }
      } else {
        this.changeQuantity(product, action, val);
      }
    } else {
      this.changeQuantity(product, action, val);
    }
  }


  /**
   * @description  increment and decremnt function.
   * @param {*} data 
   * @param {*} action : for increment , decremnt and input value of the product quantity.
   * @param {*} val ; manual input of the product quantity.
   * @memberof ProductDetail
   */
  changeQuantity(data, action, val) {
    //console.log("dsdsds")
    let product = { ...this.state.products }

    //If quantity increase
    if (action === 'increment') {
      product = { ...product, quantity: !isNaN(data.quantity)?parseInt(data.quantity)+1:1 }
    }

    //If quantity decrease
    if (action === "decrement") {
      product = { ...product, quantity: product.quantity > 0 ? parseInt(product.quantity) - 1 : null }
    }

    //If quantity changed with input field
    if (action === "input") {
      product["quantity"] = val >= 0 ? parseInt(val) : null
    }
    this.setState({ products: product })

  }

  componentWillReceiveProps({ someProp }) {
    this.setState({ ...this.state, someProp })
  }


  render() {
    const re = /^[0-9\b]+$/;
    return (
      <React.Fragment>
        {this.state.msg ?
          <Snackbar open={this.state.msg ? true : false} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} className="snackbar">
            <MuiAlert variant="filled" severity="error"> {this.state.msg} </MuiAlert>
          </Snackbar> : ""}
        {this.state.products !== "" ? (
          <div className="product-detail-wrapper">
            <div className="product-info-container">
              <div className="product-info-div">
                <div className="product-brand">
                  {this.state.products.brand}
                </div>
                <div
                  className="product-name"
                >
                  {this.state.products.shortDescription}
                </div>
                <div className="product-desc">
                    {this.state.products.description}
                </div>
                <ExpansionPanel className="accordion-wrapper">
                  <ExpansionPanelSummary
                    expandIcon={<i className="fa fa-angle-down"></i>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="accordion-header"
                  >
                    <Typography variant="h4">Ingredients</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className="accordion-body">
                    <Typography>{this.state.products.ingredients}</Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel className="accordion-wrapper">
                  <ExpansionPanelSummary
                    expandIcon={<i className="fa fa-angle-down"></i>}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                    className="accordion-header"
                  >
                    <Typography variant="h4">Nutrition Facts</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className="accordion-body">
                    <img src={this.state.products.image.Nutrition_Image} alt="Nutrition Facts" />
                  </ExpansionPanelDetails>
                </ExpansionPanel>


              </div>
              <div className="product-detail-image">
                <img src={this.state.products.image.Product_Image} alt="Product" />
              </div>
            </div>
            <div className="product-detail-actions">
              <div className="counter-wrapper">
                {this.state.products.isOutofstock > 0 ?
                  <Grid container spacing={0} alignItems="center">
                    <Grid item>
                      <IconButton
                        disabled={this.state.products.quantity > 0 ? false : true}
                        className={classes.IconButton}
                        onClick={() => {
                          this.checkAvailableQty(this.state.products, 'decrement', null);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                          <path d="M15 30a15 15 0 1115-15 15.017 15.017 0 01-15 15zm0-28.125A13.125 13.125 0 1028.125 15 13.139 13.139 0 0015 1.875zm0 0" />
                          <path d="M21.269 15.895H8.735a.9.9 0 110-1.791h12.538a.9.9 0 010 1.791zm0 0" />
                        </svg>
                      </IconButton>
                    </Grid>
                    <Grid item sm xs container>
                      <input
                        type="text"
                        onChange={event => {                      
                          if (re.test(event.target.value) || event.target.value == "" || event.target.value == '0') {
                            //console.log("dssdds",event.target.value)
                            this.checkAvailableQty(this.state.products, 'input', event.target.value)
                          } else {
                            return false;
                          }
                        }}
                        value={re.test(this.state.products.quantity) || parseInt(this.state.products.quantity)>=0?this.state.products.quantity:""}
                      />
                    </Grid>
                    <Grid item>
                      <IconButton
                        className={classes.IconButton}
                        onClick={() => {
                          this.checkAvailableQty(this.state.products, 'increment', null);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                          <path d="M15 30a15 15 0 1115-15 15.017 15.017 0 01-15 15zm0-28.125A13.125 13.125 0 1028.125 15 13.139 13.139 0 0015 1.875zm0 0" />
                          <path d="M21.269 15.895H8.735a.9.9 0 110-1.791h12.538a.9.9 0 010 1.791zm0 0" />
                          <path d="M15.004 22.164a.9.9 0 01-.9-.9V8.735a.9.9 0 111.791 0v12.538a.9.9 0 01-.891.891zm0 0" />
                        </svg>
                      </IconButton>
                    </Grid>
                  </Grid> : (this.state.products.isOutofstock == '0' ? <Grid container spacing={0} alignItems="center" justify="center" className="stock-out">Out of stock</Grid> : "")}
              </div>
              {this.state.products.isOutofstock > 0 ?

                <Button
                  disabled={this.state.products.quantity <= 0 ? true : false}
                  id="addToCart"
                  onClick={() => this.props.productDetailQuantity(this.state.products)}
                  className="btn-mui btn-yellow counter-grid-button"
                >
                  Add to Cart
                    </Button>
                : ""}
            </div>


          </div>
        ) : (
            <Grid container justify="center">
              <Grid item>
                {this.state.products === undefined ? (
                  <h1 className="noproducts-text">Technical Issue</h1>
                ) : (
                    <Spinner />
                  )}
              </Grid>
            </Grid>
          )}

      </React.Fragment>
    );
  }
}
ProductDetail.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};
const mapStateToProps = state => {
  return {
    products: state.reducer.products,
    productInventory: state.reducer.productInventory
  };
};
export default connect(mapStateToProps, { actiongetProductDetail, actionCheckProductAvailability })(ProductDetail);