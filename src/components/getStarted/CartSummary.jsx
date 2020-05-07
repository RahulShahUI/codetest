// Material imports
import { Button, Card, Grid, IconButton, Snackbar, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MuiAlert from '@material-ui/lab/Alert';
import { classes } from "istanbul-lib-coverage";
import React, { Component } from "react";
import { connect } from "react-redux";
import { actionGetMinAmount } from "../../actions/ProductAction";
import UrlConstants from "../../config/UrlConstants";
import Spinner from '../Spinner'
/** * @desc Class component for cart summary details */
class CartSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: JSON.parse(sessionStorage.getItem("cartItems"))
        ? JSON.parse(sessionStorage.getItem("cartItems"))
        : [],
      open: false,
      message: "The cart is empty",
      showDeletPrompt: false,
      itemIndex: undefined,
      cartData: [],
      totalPrice: 0,
      minPrice: "",
      inventoryInvalidData: [],
      deleteClicked: false,
      snackOpen : true
    };

    this.changeQuantity = this.changeQuantity.bind(this);

  }

  componentDidMount() {
    this.props.actionGetMinAmount("", "", "", "").then(() => {
      if (Object.keys(this.props.minPrice).length > 0) {
        this.setState({ minPrice: this.props.minPrice.minimumOrderAmount },() => this.getData(true))
      }
    })
    setTimeout(function () { window.scrollTo(0, 0) }, 10);
  }
  componentWillReceiveProps() {
    if (this.props.inventoryData.length > 0) {
      this.setState({ inventoryInvalidData: (this.props.inventoryData.length > 0 ? this.props.inventoryData : []) })
    }
  }

  componentWillUnmount() {
    document.getElementById('body').classList.remove("has-toast");
  }

  //clear the cart Data
  clearCart = () => {
    sessionStorage.removeItem('total');
    sessionStorage.removeItem("cartItems");
    this.setState({ cartData: [], cartItems: [], totalPrice: '0.00', showDeletPrompt: false }, () => {
      this.getData();
      //fire custom event to change cart item count
      var event = new CustomEvent("cartitem");
      document.dispatchEvent(event);
    });

    Promise.resolve(null).then(() => {
      this.props.clearCart();
    });
  };

  getData = (isLoad) => {
    let cartItems = this.state.cartItems;
    var totalPrice = 0
    var error=null;
    if (cartItems.length > 0) {
      cartItems.map(items => {
        var total = ((items.price) * (items.quantity));
        totalPrice = totalPrice + total;
        return true;
      });
      if(totalPrice >= this.state.minPrice) {
        if(!isLoad){
          this.props.handleclose();
        }
      } else {
        error = "Minimum Order total $" + parseFloat(this.state.minPrice).toFixed(2);
        document.getElementById('body').classList.add("has-toast");
      }
    } else {
      this.props.handleclose();
    }
    this.props.cartDetails(totalPrice,this.state.minPrice,error);
    sessionStorage.setItem('total', parseFloat(totalPrice).toFixed(2));
    this.setState({ totalPrice: parseFloat(totalPrice).toFixed(2) });
  };
  /**
   *
   * @desc remove item from cart
   */
  removeCartItem() {
    let index = this.state.itemIndex;
    if (index !== undefined && index !== null) {
      let cartItems = JSON.parse(sessionStorage.getItem("cartItems"));
      cartItems.splice(index, 1);

      sessionStorage.setItem("cartItems", JSON.stringify(cartItems));

      this.setState(
        { cartItems: cartItems, showDeletPrompt: false, cartData: cartItems },
        () => {
          sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
          this.getData();
        }
      );
      this.props.setLength(cartItems.length);
      if (cartItems.length <= 0) {
        sessionStorage.removeItem('total');
        sessionStorage.removeItem("cartItems");
        sessionStorage.removeItem('total');
        this.setState({ cartData: [], cartItems: [], totalPrice: '0.00' });
        this.getData()

      }
    }
    //fire custom event to change cart item count
    var event = new CustomEvent("cartitem");
    document.dispatchEvent(event);
  }


  checkAvailableQty(index, action, val, product) {
    var inventoryInvalidData = (this.state.inventoryInvalidData ? this.state.inventoryInvalidData : []);
    var qty = product.quantity;
    if (inventoryInvalidData.length > 0 && inventoryInvalidData[product.productId]) {
      if (action === 'increment') {
        qty = qty + 1;
      } else if (action === 'decrement') {
        qty = qty - 1;
        if (parseInt(qty) > inventoryInvalidData[product.productId].availableQty) {
          this.changeQuantity(index, action, val, product);
        }
      } else if (action === 'input') {
        qty = val;
      }
      if (parseInt(qty) > inventoryInvalidData[product.productId].availableQty) {
        let string = UrlConstants.qtyAvailableMsg;
        let qty = inventoryInvalidData[product.productId].availableQty;
        inventoryInvalidData[product.productId].msg = string.replace(/##QTY##/g, function () { return parseInt(qty); });
        this.setState({ inventoryInvalidData }, () => {
          setTimeout(() => {
            inventoryInvalidData[product.productId].msg = null;
            this.setState({ inventoryInvalidData })
          }, 3000);
        })
      } else {
        inventoryInvalidData[product.productId].msg = null;
        this.setState({ inventoryInvalidData })
        this.changeQuantity(index, action, val, product);
      }
    } else {
      this.changeQuantity(index, action, val, product);
    }
  }

  changeQuantity(index, action, val, product) {
    let selectedItems = [...this.state.cartItems];
    //If quantity increase
    if (action === 'increment') {
      selectedItems[index] = { ...selectedItems[index], quantity: ++selectedItems[index].quantity }
      sessionStorage.setItem("cartItems", JSON.stringify(selectedItems))
      this.setState({ selectedItems }, () => {
        this.getData()
        var event = new CustomEvent("cartitem");
        document.dispatchEvent(event);
      });
    }
    //If quantity decrease
    if (action === "decrement") {
      selectedItems[index] = {
        ...selectedItems[index],
        quantity: selectedItems[index].quantity > 0 ?
          --selectedItems[index].quantity
          : 0
      }
      selectedItems = selectedItems.filter(data => data.quantity > 0)
      sessionStorage.setItem("cartItems", JSON.stringify(selectedItems))
      this.setState({ selectedItems,cartItems:selectedItems }, () => {
        this.getData();
        var event = new CustomEvent("cartitem");
        document.dispatchEvent(event);
      });
    }
    //If quantity changed with input field
    return selectedItems
  }



  renderProdInfo(products) {
    let returnHtml = [];
    for (var i in products) {
      if (!!products[i]) {
        returnHtml.unshift(
          <Grid container item key={"prod" + i}>
            <Grid item xs={12} sm container>
              <Typography variant="h4">
                {products[i].productDescription
                  .replace(/(<([^>]+)>)/gi, "")
                  .replace("&nbsp;", " ")}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4">{products[i].quantity}</Typography>
            </Grid>
          </Grid>
        );
      }
    }
    return returnHtml;
  }

  /**
   * @desc Render function for cart item data with actions
   * @param {object} cartItem
   * @param {int} index
   */
  renderItem(cartItem, index) {
    let totalPrice = 0;
    let itemImage = typeof (cartItem.image)


    /** total price calculation based on product count group */
    totalPrice = cartItem.price * cartItem.quantity;
    var inventoryInvalidData = (this.state.inventoryInvalidData[cartItem.productId] ? this.state.inventoryInvalidData[cartItem.productId] : []);
    return (
      <Card key={index} className="bundle-card-summary">

        {/* <ProductList /> */}
        <div className="product-list-desktop">
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <div className="summary-img">{itemImage === "string" ?
              <img alt="Product" src={cartItem.image} /> : <img alt="Product" src={cartItem.image.Product_Image} />
            }
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            sm
            container
            alignItems="center"
          >
            <Grid item xs={5} sm={5} md={5}>
              <Typography variant="h3" className="title-product">
                {cartItem.productDescription ? cartItem.productDescription : cartItem.shortDescription}
              </Typography>
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
                <Grid container spacing={0} className="counter-grid mx-auto">
                  <div className="counter-wrapper">
                    <Grid container spacing={0} alignItems="center">
                      <Grid item>
                        <IconButton
                          className={classes.IconButton}

                          //disabled={(cartItem.quantity === 1) || (parseInt(this.state.totalPrice) < this.state.minPrice) ? true : false}
                          onClick={() => {
                            this.checkAvailableQty(index, "decrement", null, cartItem);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                          >
                            <path d="M15 30a15 15 0 1115-15 15.017 15.017 0 01-15 15zm0-28.125A13.125 13.125 0 1028.125 15 13.139 13.139 0 0015 1.875zm0 0" />
                            <path d="M21.269 15.895H8.735a.9.9 0 110-1.791h12.538a.9.9 0 010 1.791zm0 0" />
                          </svg>
                        </IconButton>
                      </Grid>
                      <Grid item sm xs container>
                        <input
                          type="text"
                          disabled
                          onChange={event =>
                            this.checkAvailableQty(
                              index,
                              "input",
                              event.target.value,
                              cartItem
                            )
                          }
                          value={cartItem.quantity}
                        />
                      </Grid>

                      <Grid item>
                        <IconButton
                          className={classes.IconButton}
                          onClick={() => {
                            this.checkAvailableQty(index, "increment", null, cartItem);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                          >
                            <path d="M15 30a15 15 0 1115-15 15.017 15.017 0 01-15 15zm0-28.125A13.125 13.125 0 1028.125 15 13.139 13.139 0 0015 1.875zm0 0" />
                            <path d="M21.269 15.895H8.735a.9.9 0 110-1.791h12.538a.9.9 0 010 1.791zm0 0" />
                            <path d="M15.004 22.164a.9.9 0 01-.9-.9V8.735a.9.9 0 111.791 0v12.538a.9.9 0 01-.891.891zm0 0" />
                          </svg>
                        </IconButton>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            <Grid
                item
                xs={3}
                sm={3}
                md={3}
                align="start"
              >
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    sm
                    container
                    alignItems="center"
                    justify="center"
                  >
                    <Typography variant="subtitle1" className="price">
                      ${totalPrice > 0 ? totalPrice.toFixed(2) : 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            <Grid
                item
                xs={1}
                sm={1}
                md={1}
                className="card-summary-action"
              >
                <IconButton
                  //disabled ={parseInt(this.state.totalPrice) < this.state.minPrice ? true : false }
                  aria-label="delete"
                  className={classes.margin + " btn-trash"}
                  onClick={() => {
                    this.setState({
                      showDeletPrompt: true,
                      itemIndex: index,
                      deleteClicked: true
                    });
                  }}
                >
                  <i className="fa fa-trash-alt"></i>
                </IconButton>
              </Grid>
          </Grid>
        </Grid>
        </div>

        <div className="product-list-mobile">
        <Grid container spacing={2}>
          <Grid item xs={3} alignItems="flex-start">
            <div className="summary-img">{itemImage === "string" ?
              <img alt="Product" src={cartItem.image} /> : <img alt="Product" src={cartItem.image.Product_Image} />
            }
            </div>
          </Grid>
          <Grid item xs={7}>
          <Typography variant="h3" className="title-product">
              {cartItem.productDescription ? cartItem.productDescription : cartItem.shortDescription}
            </Typography>
            <div className="counter-wrapper">
              <Grid container spacing={0} alignItems="center">
                <Grid item>
                  <IconButton
                    className={classes.IconButton}

                    //disabled={(cartItem.quantity === 1) || (parseInt(this.state.totalPrice) < this.state.minPrice) ? true : false}
                    onClick={() => {
                      this.checkAvailableQty(index, "decrement", null, cartItem);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                    >
                      <path d="M15 30a15 15 0 1115-15 15.017 15.017 0 01-15 15zm0-28.125A13.125 13.125 0 1028.125 15 13.139 13.139 0 0015 1.875zm0 0" />
                      <path d="M21.269 15.895H8.735a.9.9 0 110-1.791h12.538a.9.9 0 010 1.791zm0 0" />
                    </svg>
                  </IconButton>
                </Grid>
                <Grid item sm xs container>
                  <input
                    type="text"
                    disabled
                    onChange={event =>
                      this.checkAvailableQty(
                        index,
                        "input",
                        event.target.value,
                        cartItem
                      )
                    }
                    value={cartItem.quantity}
                  />
                </Grid>

                <Grid item>
                  <IconButton
                    className={classes.IconButton}
                    onClick={() => {
                      this.checkAvailableQty(index, "increment", null, cartItem);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                    >
                      <path d="M15 30a15 15 0 1115-15 15.017 15.017 0 01-15 15zm0-28.125A13.125 13.125 0 1028.125 15 13.139 13.139 0 0015 1.875zm0 0" />
                      <path d="M21.269 15.895H8.735a.9.9 0 110-1.791h12.538a.9.9 0 010 1.791zm0 0" />
                      <path d="M15.004 22.164a.9.9 0 01-.9-.9V8.735a.9.9 0 111.791 0v12.538a.9.9 0 01-.891.891zm0 0" />
                    </svg>
                  </IconButton>
                </Grid>
              </Grid>
            </div>
            <Typography variant="subtitle1" className="price">
              ${totalPrice > 0 ? totalPrice.toFixed(2) : 0}
            </Typography>
          </Grid>
          <Grid item xs={2} className="card-summary-action">
            <IconButton
              //disabled ={parseInt(this.state.totalPrice) < this.state.minPrice ? true : false }
              aria-label="delete"
              className={classes.margin + " btn-trash"}
              onClick={() => {
                this.setState({
                  showDeletPrompt: true,
                  itemIndex: index,
                  deleteClicked: true
                });
              }}
            >
              <i className="fa fa-trash-alt"></i>
            </IconButton>
            </Grid>
        </Grid>
        </div>
        {inventoryInvalidData.msg ?
          <div className="font-14 text-danger cart-summary-error">{inventoryInvalidData.msg}</div> : ""}
      </Card>
    );
  }


  
  render() {

    let cartItems = this.state.cartItems;
    const msg = this.props.errorMsg;
    return (
      <div className="card-summary-wrapper" >
       
          <Snackbar 
          open={msg ? true : false} 
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} className="snackbar snackbar-full">
            <MuiAlert variant="filled" onClose={this.props.handleclose} severity="error"> {msg} </MuiAlert>
          </Snackbar>
          <div className="card-summary-header">
          <Typography variant="h2">
            Your Cart
          </Typography>
          <span onClick={() => this.setState({ showDeletPrompt: true }) }>Clear Cart</span>
        </div>
        <div className="cart-summary-container">
          {!cartItems.length === 0 ? (

            <Grid container spacing={2} alignItems="center" className="cart-summary-head">
              <Grid item>
                <div className="summary-img"></div>
              </Grid>
              <Grid
                item
                xs={12}
                sm
                container
                alignItems="center"
              >
                <Grid item xs={5} sm={5} md={5}>
                  <Typography variant="h4" className="cart-summary-title">
                    Product Name
                    </Typography>
                </Grid>
                <Grid item xs={3} sm={3} md={3} className="text-center">
                  <Typography variant="h4" className="cart-summary-title">
                    Quantity
                    </Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  align="start"
                  className="card-summary-action"
                >
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={12}
                      sm
                      container
                      alignItems="center"
                      justify="center"
                    >
                      <Typography variant="h4" className="cart-summary-title cost-title">Cost</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={1} sm={1} md={1}></Grid>
              </Grid>
            </Grid>
          )
            : (""
            )}
          <div className="cart-summary-loop">
            {cartItems.length === 0 ? (
              <div className="cart-no-item">{this.state.message}</div>
            ) : (
                cartItems.map((item, index) => {
                  if (item) {
                    return this.renderItem(item, index);
                  } else {
                    return "";
                  }
                })
              )}
            {cartItems.length === 0 ? ("") :
              (<div className="cart-summary-total">
                <span className="title">Total</span>
                <span className="amount"><i>$</i>{this.state.totalPrice}</span>
              </div>)}
          </div>

          {/* Dialog for delete confirmation */}
          <Dialog
            open={this.state.showDeletPrompt}
            onClose={() => {
              this.setState({ showDeletPrompt: false, deleteClicked: false });
            }}
            classes={{
              root: "modal-stack-top"
            }}
          >
            <DialogContent>
              {this.state.deleteClicked ?
                ' Are you sure you would like to remove this item from the cart?'
                : 'Are you sure you would like to remove all items from the cart?'}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  this.state.deleteClicked ? this.removeCartItem() : this.clearCart();
                }}
                id="emptyCartYes"
                color="secondary"
              >
                Yes
            </Button>
              <Button
                id="emptyCartNo"
                onClick={() => {
                  this.setState({ showDeletPrompt: false, deleteClicked: false });
                }}
                color="primary"
              >
                Cancel
            </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    minPrice: state.reducer.minAmount
  };
};



export default connect(mapStateToProps, { actionGetMinAmount })(CartSummary)
