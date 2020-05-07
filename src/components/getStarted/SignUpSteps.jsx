import {
  Container,
  Grid,
  Step,
  StepLabel,
  Stepper,
  withStyles,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Check } from '@material-ui/icons';
import queryString from 'query-string';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  actionLabelList,
  actionGetMinAmount,
  actionCheckProductAvailability,
} from '../../actions/ProductAction';
import ZipCode from '../zipcode/ZipCode';
import CartSummary from './CartSummary';
import CheckOut from './CheckOut';
import ProductList from './ProductList';
import UrlConstants from '../../config/UrlConstants';
import Spinner from '../Spinner';
import APIUtil from '../../config/APIUtil';
const styles = (theme) => ({
  paper: {
    marginTop: '0 !important',
    marginBottom: '0 !important',
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    minHeight: '150px',
    backgroundColor: 'transparent',
    alignItems: 'center',
    '@media (max-width: 991px)': {
      padding: theme.spacing(0, 1),
      minHeight: '90px',
    },
  },
  stepperLabel: {
    fontSize: '16px',
    lineHeight: '16px',
    width: '100px',
    textAlign: 'left',
    color: '#333',
    fontWeight: '500',
    '@media (max-width: 991px)': {
      textAlign: 'center',
      display: 'none',
    },
  },
  stepperIcon: {
    width: '74px',
    marginRight: '16px',
    verticalAlign: 'middle',
    '@media (max-width: 991px)': {
      marginRight: '0px',
      width: '40px',
    },
  },
});

class SignUpSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'productList',
      isPopup: 0,
      zipcodeValidData: null,
      inventoryData: [],
      loader: true,
      activeStep: 0,
      message: 'add to cart is empty',
      errorMsg: sessionStorage.getItem('errorMsg')
        ? sessionStorage.getItem('errorMsg')
        : '',
      cartLength: 0,
      total: 0,
      isEdit: false,
      editIndex: undefined,
      label: [],
      stepImage: [],
      dailogOpen: false,
      isThanku: '',
      count: '',
      shippingCharges: '',
      totalPrice: 0,
      minPrice: 0,
      spinner: false,
    };
    this.props.history.listen((location, action) => {
      const queryParams = queryString.parse(location.search);
      if (queryParams.status) {
        this.setState(
          {
            activeStep: 1,
            isThanku: '',
          },
          () => this.checkQtyAvailable('error')
        );
      } else {
        this.setState({
          activeStep: 0,
          isThanku: '',
        });
      }
    });
    this.App = global.app;
  }

  componentWillMount() {
    let validatedZipCode = sessionStorage.getItem('Zipcode');
    if (validatedZipCode === null) {
      this.props.history.push('/home');
      this.setState({ dailogOpen: true });
    }

    const queryParams = queryString.parse(this.props.location.search);
    if (this.props.match.params.cancel === 'cancel') {
      this.props.history.push('/signupsteps?status=2');
    } else if (queryParams.status == '2') {
      this.setState(
        {
          activeStep: 1,
        },
        () => this.checkQtyAvailable('error')
      );
    } else {
      if (
        this.props.match.params === this.props.match.params.order ||
        this.props.match.params.failure
      ) {
        this.setState({
          activeStep: 3,
        });
      } else {
        this.getlabelList();
        this.setState({
          activeStep: 0,
        });
      }
    }
  }

  /**
   * @description Steps defiend for wizzard.
   * @param {*} step : steps for moving to one page to another step by step.
   * @returns
   * @memberof SignUpSteps
   */
  GetStartedSignUp(step) {
    switch (step) {
      case 0:
        return (
          <ProductList
            selectedCategory={this.state.selectedCategory}
            moveToNextStep={() => this.checkQtyAvailable()}
            // moveToNextStep={() => {
            //   window.top.location.href = '/#/thankyou';
            // }}
            cartItemForEdit={this.state.cartItemForEdit}
            isEdit={this.state.isEdit}
            editIndex={this.state.editIndex}
            goToRegistration={() => {
              this.setState({ activeTab: 'Pick Your Count' });
            }}
          />
        );
      case 1:
        return (
          <div className="summary-main">
            <div className="step-header">
              <div className="step-header-type"></div>
            </div>
            <CartSummary
              setLength={(e) => {
                this.setState({ cartLength: e });
              }}
              handleclose={() => {
                this.setState({ errorMsg: null });
                document.getElementById('body').classList.remove('has-toast');
              }}
              cartDetails={(totalprice, minprice, error) => {
                this.setState({
                  errorMsg: error,
                  totalPrice: totalprice,
                  minPrice: minprice,
                });
              }}
              errorMsg={this.state.errorMsg}
              inventoryData={this.state.inventoryData}
              editMix={this.editMix}
              taxCalculation={this.taxCalculation}
              spinner={this.state.spinner}
              clearCart={this.clearCart}
            />
          </div>
        );
      case 2:
        return (
          <CheckOut
            zipcodeValidData={this.state.zipcodeValidData}
            shippingCharges={this.state.shippingCharges}
            openDialoge={(data) => this.setState({ isPopup: 1 })}
            moveToPrevStep={() => this.moveToPrevStep()}
            isThanku={() => this.isThanku()}
            goToProductList={() => {
              this.setState({ activeTab: 'View Summary' });
            }}
            taxCalculation={this.taxCalculation}
            spinner={this.state.spinner}
            editCart={this.editCart}
          />
        );
      default:
        throw new Error('Unknown step');
    }
  }

  clearCart = () => {
    this.setState({
      activeStep: 0,
    });
  };

  editCart = () => {
    this.setState({
      activeStep: 1,
    });
  };

  /**
   * @description Add tax to given price
   * @param {*} price
   */
  taxCalculation = (price) => {
    let taxPercent = 8.5; // static tax(in %)
    return Number((price * taxPercent) / 100);
  };

  /**
   * @description For updating the cart items in local storage.
   * @memberof SignUpSteps
   */

  getlabelList() {
    let labelName = [];
    let labelStep = ['Registration'];
    let imageStep = [];
    this.props
      .actionLabelList()
      .then(() => {
        this.props.labelList['Get Started'] !== undefined &&
          this.props.labelList['Get Started'].forEach((labels) => {
            labels.Header.forEach((signLabels) => {
              signLabels.labelData.forEach((data) => {
                labelName.push(data.label);
                imageStep.push(data.labelImage);
                return this.setState({
                  label: labelName.concat(labelStep),
                  stepImage: imageStep,
                });
              });
            });
          });
      })
      .catch(() => {
        return <p>some Technical Issue</p>;
      });
  }

  /**
   * @description for idetifying the url and redirecting to the specific step
   * @memberof SignUpSteps
   */
  componentDidMount() {
    let prod = this;
    document.addEventListener('cartitem', function (e) {
      let cartItems = JSON.parse(sessionStorage.getItem('cartItems'));
      let count = 0;
      cartItems &&
        cartItems.map((item) => {
          count = count + item.quantity;
          return count;
        });
      prod.setState({ count: count });
      // Rerendering the component
      prod.forceUpdate();
    });

    //this.checkQtyAvailable('error');
    if (!!sessionStorage.removeItem('errorMsg')) {
      setTimeout(() => {
        this.setState({ errorMsg: null }, () =>
          sessionStorage.removeItem('errorMsg')
        );
      }, 6000);
    }
  }

  /**
   * @description to check the quantity that is there in cart eith respect to there product.
   * @param {*} selectedCategory
   * @memberof SignUpSteps
   */
  checkQtyAvailable(selectedCategory) {
    //alert("dfdf");
    var cartItems = JSON.parse(sessionStorage.getItem('cartItems'));
    var productIDs = [];
    if (cartItems && cartItems.length > 0) {
      this.setState({ spinner: true });
      cartItems.map((item) => {
        productIDs.push(item.productId);
        return true;
      });
      var obj = { productId: productIDs };
      this.props
        .actionCheckProductAvailability(obj)
        .then(() => {
          let inventoryData = this.state.inventoryData;
          var count = 0;
          if (
            this.props.productInventory &&
            this.props.productInventory.length > 0
          ) {
            this.props.productInventory.map((e) => {
              e.msg = null;
              inventoryData[e.productId] = e;
              return true;
            });
            cartItems.map((item) => {
              if (inventoryData[item.productId]) {
                if (
                  parseInt(item.quantity) >
                  parseInt(inventoryData[item.productId].availableQty)
                ) {
                  let string = UrlConstants.qtyAvailableMsg;
                  inventoryData[item.productId].msg = string.replace(
                    /##QTY##/g,
                    function () {
                      return parseInt(
                        inventoryData[item.productId].availableQty
                      );
                    }
                  );
                  count++;
                }
              }
              return true;
            });
            this.setState({ inventoryData });
            if (selectedCategory != 'error') {
              this.moveToNextStep(selectedCategory);
            } else {
              this.setState({ spinner: false });
            }
          } else {
            this.setState({ spinner: false });
          }
        })
        .catch((productData) => {
          this.setState({ spinner: false });
        });
    }
  }

  /**
   *@description for moving to next step/page.
   * @memberof SignUpSteps
   */
  moveToNextStep(selectedCategory) {
    var totalData = sessionStorage.getItem('total')
      ? sessionStorage.getItem('total')
      : 0;
    this.props
      .actionGetMinAmount('', '', '', '')
      .then(() => {
        this.setState({ shippingCharges: this.props.minPrice.shippingCharges });
        var minOrder = this.props.minPrice
          ? this.props.minPrice.minimumOrderAmount
          : '';
        if (
          parseFloat(totalData) >= parseFloat(minOrder) ||
          this.state.activeStep === 0
        ) {
          if (!!selectedCategory) {
            this.setState({
              selectedCategory: selectedCategory,
              isEdit: false,
            });
          }
          if (this.state.activeStep === 1) {
            this.checkZipCodeValidation();
          } else {
            this.setState({ errorMsg: null, spinner: false });
            this.setState({ activeStep: this.state.activeStep + 1 });
          }
        } else {
          if (totalData > 0) {
            this.setState(
              {
                spinner: false,
                errorMsg:
                  'Minimum Order total $' + parseFloat(minOrder).toFixed(2),
              },
              () => {
                document.getElementById('body').classList.add('has-toast');
              }
            );
          }
        }
      })
      .catch((productData) => {
        this.setState({ spinner: false });
      });
  }
  checkZipCodeValidation() {
    //alert("Fddf");
    var cartItems = !!sessionStorage.getItem('cartItems')
      ? JSON.parse(sessionStorage.getItem('cartItems'))
      : [];
    var formData = !!sessionStorage.getItem('formValues')
      ? JSON.parse(sessionStorage.getItem('formValues'))
      : null;
    //Address Data
    let addObj = {};
    addObj['addressLine1'] =
      !!formData && !!formData.shippingAddressLine1
        ? formData.shippingAddressLine1
        : null;
    addObj['addressLine2'] =
      !!formData && !!formData.shippingAddressLine2
        ? formData.shippingAddressLine2
        : null;
    addObj['cityName'] =
      !!formData && !!formData.shippingCity ? formData.shippingCity : null;
    addObj['countryIsodName'] =
      !!formData && !!formData.shippingCountry
        ? formData.shippingCountry
        : null;
    addObj['postalArea'] = !!sessionStorage.getItem('Zipcode')
      ? sessionStorage.getItem('Zipcode')
      : null;
    addObj['stateOrProvinceName'] =
      !!formData && !!formData.shippingState ? formData.shippingState : null;
    console.log('addObj', addObj);
    //Line Items
    let arrData = [];
    cartItems &&
      cartItems.length > 0 &&
      cartItems.forEach((e) => {
        let lineItemsObj = {};
        lineItemsObj['lineItemNumber'] = cartItems.length;
        lineItemsObj['product'] = {
          productClass: !!e.productClass ? e.productClass : null,
          productID: !!e.productId ? parseInt(e.productId) : null,
        };
        lineItemsObj['quantity'] = !!e.quantity ? parseInt(e.quantity) : 0;
        lineItemsObj['unitPrice'] = !!e.price ? parseFloat(e.price) : 0;
        arrData.push(lineItemsObj);
      });
    // Tax post data Object
    let objData = {};
    objData['destination'] = addObj;
    objData['documentDate'] = new Date();
    objData['lineItems'] = arrData;
    objData['transactionType'] = 'SALE';
    console.log('objData', objData);
    let url = UrlConstants.orderTax;
    APIUtil.postMethod(url, objData, true)
      .then((response) => {
        this.setState({
          errorMsg: null,
          spinner: false,
          activeStep: this.state.activeStep + 1,
          zipcodeValidData: response,
        });
      })
      .catch((response) => {
        this.setState({ errorMsg: null, spinner: false });
        console.log('Something went to wrong on response!!');
      });
  }

  /**
   *@description for moving to prev step/page.
   *
   * @memberof SignUpSteps
   */
  moveToPrevStep = () => {
    if (this.state.activeStep === 2) {
      this.setState({ activeStep: 0 });
    } else {
      this.setState({ activeStep: this.state.activeStep - 1 });
    }
  };

  /**
   * @description for hide wizard icons on thanku page
   * @memberof SignUpSteps
   */
  isThanku = () => {
    this.setState({
      isThanku: 'hide',
    });
  };

  /**
   * @description edit cart tems
   * @param {*} cartItem
   * @param {*} index
   */
  editMix = (cartItem, index) => {
    this.setState(
      {
        selectedCategory: cartItem.category,
        cartItemForEdit: cartItem,
        isEdit: true,
        editIndex: index,
        activeStep: 1,
      },
      () => {
        this.setState({
          activeStep: 1,
        });
      }
    );
  };

  /**
   * @description for hiding the dialuge .
   * @memberof SignUpSteps
   */
  hideDialog() {
    this.setState({ dailogOpen: false });
  }

  QontoStepIcon(props) {
    const { completed } = props;

    return (
      <div>
        {completed ? (
          <div className="check-circle checked">
            <Check />
          </div>
        ) : (
          <div className="check-circle unchecked">
            <Check />
          </div>
        )}
      </div>
    );
  }

  render() {
    const steps = this.state.label;
    const { classes } = this.props;
    let activeStep = this.state.activeStep;
    //console.log(this.state.totalPrice+"====="+this.state.minPrice)

    return (
      <React.Fragment>
        <CssBaseline />
        {this.state.spinner ? <Spinner /> : ''}
        <div className="stepup-container">
          <div className="content-main">
            <div>
              <Grid container spacing={0}>
                <Grid item className="stepper-col">
                  <div className={'stepper-col-header ' + this.state.isThanku}>
                    <Container className="container-root">
                      <Stepper
                        alternativeLabel
                        activeStep={this.state.activeStep}
                        className={classes.stepper + ' stepper-head '}
                      >
                        {steps.map((label, i) => (
                          <Step key={label}>
                            <StepLabel
                              className="step-head"
                              StepIconComponent={this.QontoStepIcon}
                            >
                              {i === 0 && (
                                <img
                                  src={this.state.stepImage[0]}
                                  alt="bundle"
                                  className={classes.stepperIcon}
                                />
                              )}
                              {i === 1 && (
                                <img
                                  src={this.state.stepImage[1]}
                                  alt="summary"
                                  className={classes.stepperIcon}
                                />
                              )}
                              {i === 2 && (
                                <img
                                  src={this.state.stepImage[2]}
                                  alt="checkout"
                                  className={classes.stepperIcon}
                                />
                              )}
                              {i === 3 && (
                                <img
                                  src={this.state.stepImage[2]}
                                  alt="checkout"
                                  className={classes.stepperIcon}
                                />
                              )}
                              <label className={classes.stepperLabel}>
                                {label}
                              </label>
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Container>
                  </div>

                  <React.Fragment>
                    {this.GetStartedSignUp(this.state.activeStep)}
                    <div className="text-right wizard-buttons">
                      {activeStep !== 0 && activeStep !== 2 && (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={this.moveToPrevStep}
                          className={'btn-mui btn-red'}
                          id="ContinueShopping"
                        >
                          Keep Shopping
                        </Button>
                      )}

                      {activeStep === 0 || activeStep === 2 ? (
                        ''
                      ) : (
                        <Button
                          disabled={
                            this.state.totalPrice > 0 &&
                            this.state.totalPrice >= this.state.minPrice
                              ? false
                              : true
                          }
                          variant="contained"
                          color="primary"
                          onClick={(e) => this.checkQtyAvailable(e)}
                          className={' btn-mui btn-yellow '}
                          id="ContinueCheckout"
                        >
                          Checkout
                        </Button>
                      )}
                    </div>
                  </React.Fragment>
                </Grid>
              </Grid>
            </div>
          </div>
          <ZipCode
            onClose={() => this.hideDialog()}
            dailogOpen={this.state.dailogOpen}
          />
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    labelList: state.reducer.labelList || [],
    minPrice: state.reducer.minAmount,
    productInventory: state.reducer.productInventory,
  };
};
export default connect(mapStateToProps, {
  actionLabelList,
  actionGetMinAmount,
  actionCheckProductAvailability,
})(withStyles(styles)(SignUpSteps));
