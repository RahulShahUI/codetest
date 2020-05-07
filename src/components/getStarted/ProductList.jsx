import { Button, Card, CardActions, CardContent, CardMedia, Container, Dialog, DialogContent, Grid, IconButton, Snackbar, Typography } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { classes } from "istanbul-lib-coverage";
import React, { Component } from "react";
import BottomScrollListener from 'react-bottom-scroll-listener';
import { connect } from "react-redux";
import { actionCheckProductAvailability, actionGetMinAmount, actiongetProduct } from "../../actions/ProductAction";
import UrlConstants from "../../config/UrlConstants";
import SearchDropdown from "../commonComponents/searchDropdown/SearchDropdown";
import ProductDetail from "./ProductDetail";
import Spinner from "../Spinner";
class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      totalQty: 0,
      products: undefined,
      showSearchBar: false,
      offset: 0,
      page:0,
      DialougeBoxOpen: false,
      selectedItems: [],
      selectedItemsOpen: false,
      showProductDetail: false,
      minOrder: "",
      currency: "",
      limit:UrlConstants.productsLimit,
      isfilter:false,
      Spinner:false,
      msg: null,
      isProduct:true,
      productInventory: [],
      totalProducts:null,
      productDetailIndex: "",
      filterData:{},
    };
    this.changeQuantity = this.changeQuantity.bind(this);
  }
  /**
   * @Desc updating and calling the api on page load.
   * @memberof ProductList
   */
  componentWillMount() {
    this.actionGetMinAmount();
    this.getProductList(this.state.filterData,true);
  }
  /**
   * @Desc For loading the data from the categories api.
   * @memberof ProductList
   */
  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({ showSearchBar: false });
    setTimeout(() => {
      let productGridContainer= document.getElementById("productGridContainer");
      if (
        !!productGridContainer &&
        !!document.getElementById("mixCount")
      ) {
        window.onscroll = function () {
          myFunction();
        };
        let header = document.getElementById("mixCount");
        let sticky = 280;
        function myFunction() {          
          if (window.pageYOffset > sticky) {
            let top = window.pageYOffset - sticky;
            let dh = productGridContainer.clientHeight - top;
            if (dh > 470) {
              header.style.cssText = `top: ${top}px`;
            }
          } else {
            header.style.cssText = "";
          }
        }
      }
    }, 1000);
  }

  handleOnDocumentBottom(){
      let offset = (this.state.offset+1) 
      this.setState({offset:offset},() => this.getProductList(this.state.filterData,false));
  }
  /**
   * @Desc Configure Bundel ProductList Api Calling & Search Filter Api Calling.
   * @memberof ProductList
   */

  checkAvailableQtys(productIDs, products) {
    var arrObj = {};
    arrObj['productId'] = productIDs; 
    const invData = (this.state.productInventory.length>0?this.state.productInventory:[]);
    const productsData = (!!this.state.products && this.state.products.length>0?this.state.products:[]);
    this.props.actionCheckProductAvailability(arrObj).then(() => {
      if (this.props.productInventory && this.props.productInventory.length > 0) {
        //var invData = [];
        this.props.productInventory.map((e) => {
          invData[e.productId] = e;
          return true;
        });
        if (products.length > 0) {
          products.map((e) => {
            if (invData[e.productId]) {
              if (parseInt(invData[e.productId].availableQty) <= 0) {
                e.isOutofstock = 0;
              } else {
                e.isOutofstock = 1;
              }
            }
            productsData.push(e);
            return true;
          });

          this.setState({Spinner:false, products: productsData, productInventory: invData });
        }
      }
    });
  }

  /**
   * @description to get the product list from the api.
   *
   * @memberof ProductList
   */

   
  getProductList(postData,isItemUpdate) {
     var objData = (!!postData?postData:{}); 
     objData['offset'] = (this.state.offset * this.state.limit);
     objData['limit'] = this.state.limit;
     objData['locationNumber'] = (!!sessionStorage.getItem("_lo_No")?sessionStorage.getItem("_lo_No"):null);
      let prodData = (!!this.state.products?this.state.products:[]);
      if(this.state.isProduct && ((this.state.totalProducts == 0) || (prodData.length != this.state.totalProducts))){
        this.setState({Spinner:true});
        setTimeout(() => {
          this.manageProducts(objData,isItemUpdate);  
        }, 1000);
        
      }
  }

  manageProducts(objData,isItemUpdate){
      let data = JSON.parse(sessionStorage.getItem("cartItems")) !== null? JSON.parse(sessionStorage.getItem("cartItems")).length > 0? [...JSON.parse(sessionStorage.getItem("cartItems"))]: []: [];
      this.props.actiongetProduct(objData).then((productData) => {
        var products = productData.data?productData.data:[];
        if(products.length > 0) {
          var productIDs = [];
          products.map((e) => {
            productIDs.push(e.productId);
            if(data.length > 0) {
              products = products.map( (obj) => data.find((o) => o.id === obj.id) || obj);
            }
            return true;
          });
          this.setState({
            totalProducts:(productData.totalProducts?productData.totalProducts:0),
            currency: products.length>0?(products[0].currency ? products[0].currency : "$"):"",
            showSearchBar: true,
            selectedItems: isItemUpdate?data:this.state.selectedItems,
          },() => this.checkAvailableQtys(productIDs, products));
        } else {
          this.setState({
            isProduct:false,
            Spinner:false,
            products:[],
            totalProducts:0,
            currency: "",
            showSearchBar: true,
            selectedItems: isItemUpdate?data:this.state.selectedItems,
          });
        }
        
      }).catch((productData) => {
        this.setState({
          Spinner:false,
          DialougeBoxOpen: true,
        });
      });
  }

  /**
   * @description for getting the min maount/ limit that is to considered during shopping.
   *
   * @memberof ProductList
   */
  actionGetMinAmount() {
    this.props.actionGetMinAmount("", "", "", "").then(() => {
      this.setState({
        minOrder: this.props.minPrice
          ? this.props.minPrice.minimumOrderAmount
          : "",
      });
    });
  }

  /**
   * @Desc To update the searched product list on searchbutn usings props
    @param {} productValue
   */
  updateProductList = (productValue,isfilter) => {
    this.setState({isProduct:true,isfilter:isfilter,filterData:productValue,products:[],productInventory:[],offset:0},() => {
      this.getProductList(productValue,false);
    })
  };

  /**
   * @desc function to change item quantity to cart
   * @param {int} index - index of cart item to be update
   * @param {string} action - incrementm, decrement, input
   * @param {int} val - input value of quantity
   */
  checkAvailableQty(product, action, val, index) {
    var qty = action == "input" ? val : product.quantity;
    
    if (parseInt(qty) >= 0) {
      if (
        this.state.productInventory.length > 0 &&
        this.state.productInventory[product.productId]
      ) {
        if (action === "increment") {
          qty = !isNaN(qty)?parseInt(qty)+1:1;
        } else if (action === "decrement") {
          qty = !isNaN(qty)?parseInt(qty)-1:0;
          // if (
          //   parseInt(qty) >
          //   this.state.productInventory[product.productId].availableQty
          // ) {
          //   this.changeQuantity(product, action, val, index);
          // }
        } else if (action === "input") {
          qty = val;
        }
        if (parseInt(qty) > this.state.productInventory[product.productId].availableQty) {
          let string = UrlConstants.qtyAvailableMsg;
          let qty = this.state.productInventory[product.productId].availableQty;
          this.setState({ msg: string.replace(/##QTY##/g, function () { 
            return parseInt(qty);
          })},
            () => {
              setTimeout(() => {
                this.setState({ msg: null });
              }, 3000);
            }
          );
        } else {
          this.changeQuantity(product, action, val, index);
        }
      } else {
        this.changeQuantity(product, action, val, index);
      }
    } else {
      this.changeQuantity(product, action, val, index);
    }
  }

  /**
   * @description for increment , decremnt and input value for adding products
   *
   * @param {*} product
   * @param {*} action
   * @param {*} val
   * @param {*} index
   * @returns
   * @memberof ProductList
   */
  changeQuantity(product, action, val, index) {
   
    let selectedItems = [...this.state.selectedItems];
    let products = [...this.state.products];
    let isInCart = "";
    if (selectedItems.length > 0) {
      let id = product.id;
      let cartIndex = selectedItems.findIndex((cart) => {
        return cart.id === id;
      });
      if (cartIndex === -1) {
        isInCart = false;
      } else {
        isInCart = true;
      }
    }
    
    if (isInCart) {
      //If quantity increase
      if (action === "increment") {
        let selectedItemIndex = selectedItems.findIndex(
          (item) => item.id === product.id
        );
        selectedItems[selectedItemIndex] = {...selectedItems[selectedItemIndex],
          quantity: !isNaN(selectedItems[selectedItemIndex].quantity)? parseInt(selectedItems[selectedItemIndex].quantity)+1:1,
        };
        products[index] = { ...products[index], quantity: !isNaN(products[index].quantity)?parseInt(products[index].quantity)+1:1 };
        this.setState({ selectedItems, products }, () => this.updateCartData());
      }

      //If quantity decrease
      if (action === "decrement") {
        let selectedItemIndex = selectedItems.findIndex(
          (item) => item.id === product.id
        );
        selectedItems[selectedItemIndex] = {
          ...selectedItems[selectedItemIndex],
          quantity:
            selectedItems[selectedItemIndex].quantity > 0
              ? --selectedItems[selectedItemIndex].quantity
              : 0,
        };
       
        products[index] = {
          ...products[index],
          quantity: products[index].quantity - 1,
        };
        selectedItems = selectedItems.filter((data) => data.quantity > 0);
        this.setState({ selectedItems, products }, () => this.updateCartData());
      }

      //If quantity changed with input field
      if (action === "input") {
        let selectedItemIndex = selectedItems.findIndex(
          (item) => item.id === product.id
        );
        
        selectedItems[selectedItemIndex] = {
          ...selectedItems[selectedItemIndex],
          quantity: parseInt(val) >= 0 ? parseInt(val) : null,
        };
        selectedItems = selectedItems.filter((data) => data.quantity > 0);
        products[index]["quantity"] = val >= 0 ? parseInt(val) : null;
        this.setState({ selectedItems, products }, () => this.updateCartData());
      }
    } else {
      let cart = [];
      if (action === "input") {
        cart = [
          ...selectedItems,
          { ...product, quantity: parseInt(val) > 0 ? parseInt(val) : "" },
        ];
        products[index] = {
          ...products[index],
          quantity: val >= 0 ? parseInt(val) : null,
        };
        cart = cart.filter((data) => data.quantity > 0);
        products[index]["quantity"] = val >= 0 ? parseInt(val) : null;
        this.setState({ selectedItems:cart, products }, () => this.updateCartData());
      } else {
        cart = [...selectedItems, { ...product, quantity: 1 }];
        products[index] = {
          ...products[index],
          quantity: !isNaN(products[index].quantity)?products[index].quantity+1:1,
        };
        cart = cart.filter((data) => data.quantity > 0);
        this.setState({ selectedItems: cart, products }, () => this.updateCartData());
      }
    }
    return selectedItems;
  }

  updateCartData(){
    let cart = this.state.selectedItems;
    sessionStorage.setItem("cartItems", JSON.stringify(cart));
    //fire custom event to change cart item count
    var event = new CustomEvent("cartitem");
    document.dispatchEvent(event);
  }

  /**
   * @description for adding of the product from the pop up page of product detail.
   *
   * @memberof ProductList
   */
  productDetailQuantity = (updatedObjet) => {
    if (updatedObjet.quantity > 0) {
      let selectedItems = [...this.state.selectedItems];
      let products = [...this.state.products];
      let { productDetailIndex } = this.state;
      let isInCart = "";
      if (selectedItems.length > 0) {
        // let id = updatedObjet.id
        let cartIndex = selectedItems.findIndex((cart) => {
          return cart.id === updatedObjet.id;
        });

        if (cartIndex === -1) {
          isInCart = false;
        } else {
          isInCart = true;
        }
      }
      let selectedItemIndex = selectedItems.findIndex(
        (item) => item.id === updatedObjet.id
      );
      if (isInCart) {
        selectedItems[selectedItemIndex] = {
          ...selectedItems[selectedItemIndex],
          quantity: updatedObjet.quantity,
        };
        products[productDetailIndex] = {
          ...products[productDetailIndex],
          quantity: updatedObjet.quantity,
        };
      } else {
        selectedItems = [
          ...selectedItems,
          { ...products[productDetailIndex], quantity: updatedObjet.quantity },
        ];
        products[productDetailIndex] = {
          ...products[productDetailIndex],
          quantity: updatedObjet.quantity,
        };
      }
      this.setState(
        {
          selectedItems,
          products,
          productDetailIndex: "",
          showProductDetail: false,
        },
        () => this.updateCartData());
    } else {
      this.setState({ showProductDetail: false });
    }
  };
  /**
   * @desc update counter of selected products
   */
  updateCounter() {
    let cnt = 0;
    let selectedItems = this.state.selectedItems;
    for (var i in selectedItems) {
      cnt = !!selectedItems[i] ? cnt + selectedItems[i].quantity : cnt;
    }
    this.setState({ counter: cnt });
  }
  /**
   * @desc add selected products to cart
   */
  addItemsToCart() {
    this.props.moveToNextStep();
  }
  /**
   *@description for the side card where the added product list is shown.
   *
   * @returns
   * @memberof ProductList
   */
  renderSelectedProductsCard() {
    let min = this.state.minOrder;
    let products = [];
    let selectedItems = this.state.selectedItems;

    let total = 0;
    if (Object.keys(selectedItems).length !== 0) {
      Object.keys(selectedItems).map((items) => {
        total =
          total + selectedItems[items].price * selectedItems[items].quantity;
        return true;
      });
    }
    for (var i in selectedItems) {
      products.unshift(
        <Grid container spacing={1} key={"selected-prod-" + i}>
          <Grid item xs={12} sm container>
            <Typography variant="h4">
              {selectedItems[i].productDescription
                ? selectedItems[i].productDescription
                : selectedItems[i].shortDescription
                    .replace(/(<([^>]+)>)/gi, "")
                    .replace("&nbsp;", " ")}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" className="quantity">{selectedItems[i].quantity}</Typography>
          </Grid>
        </Grid>
      );
    }

    return (
      <Card
        id="mixCount"
        className={total >= min ? "mix-count active" : "mix-count"}
      >
        <div className="mix-count-wrapper">
          <CardContent className="mix-count-content">
            <div
              className="mix-count-title"
              onClick={() => {
                this.openSelectedItems();
              }}
            >
              <Typography variant="h3" className="text-center">
              Your Order
              </Typography>
            </div>
            <div className="mix-count-minimum">
              <Typography variant="h5" className="text-center">
                Minimum Order total
              </Typography>
              <Typography
                variant="h3"
                className="text-center"
                onClick={() => {
                  this.openSelectedItems();
                }}
              >
                {this.state.minOrder
                  ? this.state.currency + this.state.minOrder
                  : "0"}
              </Typography>
            </div>
            <div
              className={
                this.state.selectedItemsOpen
                  ? "mix-count-content-inner open"
                  : "mix-count-content-inner"
              }
            >
              {products}
            </div>
            <div className="mix-count-total">
              <Typography variant="h5" className="text-center">
                Total:
              </Typography>
              <Typography variant="h2" className="text-center">
                <span className="currency">{this.state.currency}</span>
                <span>{total.toFixed(2)}</span>
              </Typography>
            </div>
          </CardContent>
        </div>
        <CardActions className="mix-count-action">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="btn-mui btn-yellow"
            id="viewCart"
            disabled={total >= min ? false : true}
            onClick={() => {
              this.addItemsToCart();
            }}
          >
            View Cart
          </Button>
          {/* <Button	
            variant="contained"	
            fullWidth	
            className="btn-mui btn-red"	
            disabled={total >= min ? false : true}	
            onClick={() => {	
              this.addItemsToCart();	
            }}	
          >	
            Edit Cart	
          </Button> */}
        </CardActions>
      </Card>
    );
  }

  /**
   * @description for opening the pop up screen.
   * @memberof ProductList
   */
  openSelectedItems() {
    this.setState({ selectedItemsOpen: !this.state.selectedItemsOpen });
  }

  /**
   * @description To show product detail popup
   * @memberof ProductLibrary
   */
  productDetail(id, index) {
    this.setState({
      showProductDetail: true,
      prodId: id,
      productDetailIndex: index,
    });
  }

  render() {
    const re = /^[0-9\b]+$/;
    const { products } = this.state;
    return (
      <div className="wizard-step wizard-step-list">
        <div className="step-header">	
          <div className="step-header-type"></div>	
        </div>
        <Container className="container-root">
          <SearchDropdown handleSearch={this.updateProductList} />
          <BottomScrollListener onBottom={() => this.handleOnDocumentBottom()} />
          {this.state.Spinner ?<Spinner />:""}
          {this.state.msg ? (
            <Snackbar
              open={this.state.msg ? true : false}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              className="snackbar"
            >
              <MuiAlert variant="filled" severity="error">{this.state.msg}</MuiAlert>
            </Snackbar>
          ) : (
            ""
          )}
          <div
            id="productGridContainer"
            className="product-grid-container lists"
          >
            {products && products.length > 0 ? (
              products.map((prod, index) => {
                return (
                  <React.Fragment key={"product-" + prod.id}>
                    {prod ? (
                      <Grid item key={prod.id} xs={6} lg={4} sm={4}>
                        <Card
                          className="bundle-card bundle-card-modal"
                          key={prod.id}
                        >
                          <div onClick={() => this.productDetail(prod, index)}>
                            <div className="card-media-wrapper">
                              <CardMedia
                                component="img"
                                alt="bundle"
                                image={
                                  typeof prod.image === "string"
                                    ? prod.image
                                    : prod.image.Product_Image
                                }
                              />
                            </div>
                            <Typography variant="h3">
                              {prod.productDescription
                                ? prod.productDescription
                                    .replace(/(<([^>]+)>)/gi, "")
                                    .replace("&nbsp;", " ")
                                : prod.shortDescription
                                    .replace(/(<([^>]+)>)/gi, "")
                                    .replace("&nbsp;", " ")}
                                    <span>({prod.size})</span>
                            </Typography>
                          </div>
                          <div className="bundle-card-info">
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="text-center">
                                {prod.currency + prod.price}
                              </Grid>
                            </Grid>
                          </div>

                              <CardActions className="bundle-card-action">
                            <Grid
                              container
                              spacing={0}
                              justify={"center"}
                            >
                              
                              {prod.isOutofstock == "1" ? (
                                <Grid
                                  item
                                  sm
                                  xs
                                  container
                                  className="counter-grid"
                                >
                                  <div className="counter-wrapper">
                                    <Grid
                                      container
                                      spacing={0}
                                      alignItems="center"
                                    >
                                      <Grid item>
                                        <IconButton
                                          disabled={
                                            prod.quantity > 0 ? false : true
                                          }
                                          className={classes.IconButton}
                                          onClick={() => {
                                            this.checkAvailableQty(
                                              prod,
                                              "decrement",
                                              null,
                                              index
                                            );
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
                                          onChange={(event) => {
                                              if (re.test(event.target.value) || event.target.value == "" || event.target.value == '0') {
                                                this.checkAvailableQty(prod,"input",event.target.value,index)
                                              } else {
                                                return false;
                                              }
                                          }}
                                          //value={!!prod.quantity && prod.quantity>=0 ? prod.quantity: ""}
                                          value={re.test(prod.quantity) || parseInt(prod.quantity)>=0?prod.quantity:""}
                                        />
                                      </Grid>
                                      <Grid item>
                                        <IconButton
                                          className={classes.IconButton}
                                          onClick={() => {
                                            this.checkAvailableQty(
                                              prod,
                                              "increment",
                                              null,
                                              index
                                            );
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
                              ) : prod.isOutofstock == "0" ? (
                                <Grid
                                  container
                                  spacing={0}
                                  alignItems="center"
                                  justify="center"
                                  className="stock-out"
                                >
                                  Out of stock
                                </Grid>
                              ) : (
                                ""
                              )}
                            </Grid>
                          </CardActions>
                        </Card>
                      </Grid>
                    ) : (
                      <Grid container justify="center">
                        <Grid item>
                          <h1 className="noproducts-text">No Products</h1>
                        </Grid>
                      </Grid>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <Grid container justify="center">
                <Grid item>
                  {(this.state.products === undefined || this.state.Spinner) ? (
                    <Spinner />
                  ) : (
                    <h1 className="noproducts-text">No Products</h1>
                  )}
                </Grid>
              </Grid>
            )}

            {/* {/ mix count card /}	 */}
            {this.renderSelectedProductsCard()}
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
              id="errorCatchList"
              onClick={() => {
                this.setState({ DialougeBoxOpen: false });
              }}
            >
              Close
            </Button>
          </Dialog>

          {/* product detail */}
          <Dialog
            open={this.state.showProductDetail}
            onClose={() => {
              this.setState({ showProductDetail: false });
            }}
            aria-labelledby="responsive-dialog-title"
            maxWidth={false}
            scroll={"body"}
            classes={{
              paper: "modal-big modal-product-detail",
              root: "modal-stack-top",
            }}
          >
            <DialogContent>
              <Button
                className="icn-close"
                id="productDetailClose"
                onClick={() => {
                  this.setState({ showProductDetail: false });
                }}
              >
                <i className="fa fa-times"></i>
              </Button>
              <ProductDetail
                id={this.state.prodId}
                items={this.state.selectedItems}
                productDetailQuantity={this.productDetailQuantity}
              />
            </DialogContent>
          </Dialog>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.reducer.Products || [],
    totalProduct: state.reducer.totalProduct,
    filterProducts: state.reducer.filterProducts,
    minPrice: state.reducer.minAmount,
    productInventory: state.reducer.productInventory,
  };
};

export default connect(mapStateToProps, {
  actiongetProduct,
  actionCheckProductAvailability,
  actionGetMinAmount,
})(ProductList);
