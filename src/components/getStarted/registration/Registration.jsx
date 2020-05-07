import {
  Button,
  Checkbox,
  Snackbar,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  OutlinedInput,
  Select,
  Typography,
} from "@material-ui/core";
import { ErrorMessage, Formik } from "formik";
import React from "react";
import { withRouter } from "react-router-dom";
import ReactSelect from "react-select";
import * as Yup from "yup";
import { actionZipcodeVerification } from "../../../actions/ProductAction";
import APIUtil from "../../../config/APIUtil";
import UrlConstants from "../../../config/UrlConstants";
import MuiAlert from "@material-ui/lab/Alert";
import { connect } from "react-redux";
import Spinner from '../../Spinner'
import usStateData from "../../data/states_list.json";

const countryOptions = [{ value: "US", label: "United States" }];
//const formValues = JSON.parse(sessionStorage.getItem("formValues"))
class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billingSameAsShipping: false,
      billingAddressLine1: JSON.parse(sessionStorage.getItem("formValues")) ? JSON.parse(sessionStorage.getItem("formValues")).billingAddressLine1 : "",
      billingAddressLine2: JSON.parse(sessionStorage.getItem("formValues")) ? JSON.parse(sessionStorage.getItem("formValues")).billingAddressLine2 : "",
      shippingState: JSON.parse(sessionStorage.getItem("formValues"))  ? JSON.parse(sessionStorage.getItem("formValues")).shippingState : "",
      billingState: JSON.parse(sessionStorage.getItem("formValues"))  ? JSON.parse(sessionStorage.getItem("formValues")).billingState : "",
      shippingCity:JSON.parse(sessionStorage.getItem("formValues"))  ?  JSON.parse(sessionStorage.getItem("formValues")).shippingCity : "",
      billingCity: JSON.parse(sessionStorage.getItem("formValues"))  ? JSON.parse(sessionStorage.getItem("formValues")).billingCity : "",
      firstname: JSON.parse(sessionStorage.getItem("formValues")) ? JSON.parse(sessionStorage.getItem("formValues")).firstname : "",
      lastname: JSON.parse(sessionStorage.getItem("formValues")) ? JSON.parse(sessionStorage.getItem("formValues")).lastname : "",
      email: JSON.parse(sessionStorage.getItem("formValues"))  ? JSON.parse(sessionStorage.getItem("formValues")).email : "",
      contact: JSON.parse(sessionStorage.getItem("formValues"))  ? JSON.parse(sessionStorage.getItem("formValues")).contact : "",
      shippingFirstname: JSON.parse(sessionStorage.getItem("formValues"))  ? JSON.parse(sessionStorage.getItem("formValues")).shippingFirstname : "",
      shippingLastname: JSON.parse(sessionStorage.getItem("formValues"))  ?JSON.parse(sessionStorage.getItem("formValues")).shippingLastname : "",
      shippingAddressLine1: JSON.parse(sessionStorage.getItem("formValues"))  ? JSON.parse(sessionStorage.getItem("formValues")).shippingAddressLine1 : "",
      shippingAddressLine2: JSON.parse(sessionStorage.getItem("formValues"))  ? JSON.parse(sessionStorage.getItem("formValues")).shippingAddressLine2 : "",
      shippingZipCode: sessionStorage.getItem("Zipcode"),
      shippingCountry: JSON.parse(sessionStorage.getItem("formValues"))  ? JSON.parse(sessionStorage.getItem("formValues")).shippingCountry : "",
      billingFirstname: JSON.parse(sessionStorage.getItem("formValues"))  ? JSON.parse(sessionStorage.getItem("formValues")).billingFirstname : "",
      billingLastname: JSON.parse(sessionStorage.getItem("formValues")) ? JSON.parse(sessionStorage.getItem("formValues")).billingLastname : "",
      billingZipCode:JSON.parse(sessionStorage.getItem("formValues")) ?  JSON.parse(sessionStorage.getItem("formValues")).billingZipCode : "",
      billingCountry: JSON.parse(sessionStorage.getItem("formValues")) ?  JSON.parse(sessionStorage.getItem("formValues")).billingCountry : "",
      submitDisabled: false,
      ZipfailMessage: "",
    };
  }

  componentDidMount() {
    setTimeout(function () {
      window.scrollTo(0, 0);
    }, 10);
    var response = this.props.zipcodeValidData;
    console.log("response.data",response)
    if (!!response && !!response.data && response.data.success === true) {
      setTimeout(() => { this.props.getTaxtLoader(false,response.data);  }, 100);
    } else {
      setTimeout(() => { this.props.getTaxtLoader(false, null);  }, 100);
      this.setState({ submitDisabled: true });
    }
  }

  componentWillUnmount() {
    document.getElementById('body').classList.remove("has-toast");
  }

  /**
   *
   * @description Setting  Values for Billing Information
   * @memberof Registration
   * @param values : are the values that are given as input
   * @param setFieldValue : for setting the given field values.
   *
   */
  billingInformation = (values, setFieldValue) => {
    
    const billingValues =  (JSON.parse(sessionStorage.getItem("billingValues"))) ? (JSON.parse(sessionStorage.getItem("billingValues"))) : ""
    if (this.state.billingSameAsShipping === true) {
      
      setFieldValue("billingFirstname",billingValues.billingFirstname)
      setFieldValue("billingLastname", billingValues.billingLastname)
      setFieldValue("billingAddressLine1",billingValues.billingAddressLine1)
      setFieldValue("billingAddressLine2", billingValues.billingAddressLine2)
      setFieldValue("billingCountry", billingValues.billingCountry)
      setFieldValue("billingState", billingValues.billingState)
      setFieldValue("billingCity", billingValues.billingCity)
      setFieldValue("billingZipCode",billingValues.billingZipCode)
      this.setState({ billingSameAsShipping: false });
    }  else {
      sessionStorage.setItem('billingValues',JSON.stringify(values))

      setFieldValue("billingFirstname", values.shippingFirstname);
      setFieldValue("billingLastname", values.shippingLastname);
      setFieldValue("billingAddressLine1", values.shippingAddressLine1);
      setFieldValue("billingAddressLine2", values.shippingAddressLine2);
      setFieldValue("billingCountry", values.shippingCountry);
      setFieldValue("billingState", values.shippingState);
      setFieldValue("billingCity", values.shippingCity);
      setFieldValue("billingZipCode", values.shippingZipCode);
      this.setState({ billingSameAsShipping: true });
    } 
  };

  /**
   *
   * @description show Registration form
   * @memberof Registration
   *
   */
  editRegistration(e) {
    if (e === "shipping") {
      this.setState({
        editModeShipping: !this.state.editModeShipping,
      });
    } else {
      this.setState({
        editModeBilling: !this.state.editModeBilling,
      });
    }
  }
  zip = (e, setFieldValue) => {
    if (e.target.value.toString().length <= 5) {
      setFieldValue("shippingZipCode", e.target.value);
    }
    if (this.state.billingSameAsShipping) {
      setFieldValue("billingZipCode", e.target.value);
    }
    //this.setState({ submitDisabled: false });
  };

  /*
   * @description Validate the Zipcode by user input
   * @memberof Registration
   */
  handleZipFieldBlur = (e, handleBlur, values) => {
    handleBlur(e);
    this.checkTaxDetails(e, handleBlur, values)
  }

  onStatechange = (e, handleBlur, values) => {
    values.shippingState = e.value;
    this.checkTaxDetails(e, handleBlur, values)
  }

  checkTaxDetails(e, handleBlur, values){
    
    var cartItems = (!!sessionStorage.getItem("cartItems")?JSON.parse(sessionStorage.getItem("cartItems")):[]);
    //Address Data
    let addObj = {};
    addObj['addressLine1'] = (!!values.shippingAddressLine1?values.shippingAddressLine1:null);
    addObj['addressLine2'] = (!!values.shippingAddressLine2?values.shippingAddressLine2:null);
    addObj['cityName'] = (!!values.shippingCity?values.shippingCity:null);
    addObj['countryIsodName'] = (!!values.shippingCountry?values.shippingCountry:null);
    addObj['postalArea'] = (!!values.shippingZipCode?values.shippingZipCode:null);
    addObj['stateOrProvinceName'] = (!!values.shippingState?values.shippingState:null);
    //Line Items
    if(!!addObj['postalArea'] && addObj['postalArea'].length=='5' && !!addObj['stateOrProvinceName']) {
      this.props.getTaxtLoader(true,null);
      let arrData = [];
      cartItems && cartItems.length>0 && cartItems.forEach(e => {
        let lineItemsObj = {};
        lineItemsObj['lineItemNumber'] = cartItems.length;
        lineItemsObj['product'] = {
          "productClass": (!!e.productClass?e.productClass:null),
          "productID": (!!e.productId?parseInt(e.productId):null)
        };
        lineItemsObj['quantity'] = (!!e.quantity?parseInt(e.quantity):0);
        lineItemsObj['unitPrice'] = (!!e.price?parseFloat(e.price):0);
        arrData.push(lineItemsObj);
      }) 
      // Tax post data Object
      let objData = {};
      objData['destination'] = addObj;
      objData['documentDate'] = new Date();
      objData['lineItems'] = arrData;
      objData['transactionType'] = "SALE";
      let url = UrlConstants.orderTax;
      APIUtil.postMethod(url, objData, true).then((response) => {
        if (response.data.success === true) {
          sessionStorage.setItem("Zipcode",parseInt(parseInt(values.shippingZipCode)));
          response.data.zipcode = parseInt(parseInt(values.shippingZipCode));
          setTimeout(() => { this.props.getTaxtLoader(false,response.data);  }, 100);
          this.setState({submitDisabled: false})
        } else {
          response.data.zipcode = parseInt(parseInt(values.shippingZipCode));
          setTimeout(() => { this.props.getTaxtLoader(false,response.data);  }, 100);
          this.setState({ submitDisabled: true, ZipfailMessage: response.data.message }, () => {
              setTimeout(() => {
                this.setState({ ZipfailMessage: "" });
              }, 2000)}
          );
        }
      }).catch((response) => {
        this.setState({submitDisabled: true})
        response.data.zipcode = parseInt(parseInt(values.shippingZipCode));
        this.props.getTaxtLoader(false,response.data);
      });
    } else {
      this.setState({submitDisabled: true})
      //var response = {};
      //response.zipcode = !!sessionStorage.getItem("Zipcode")?parseInt(sessionStorage.getItem("Zipcode")):null;
      //this.props.getTaxtLoader(false,response);
    }
    
  }

handleClose = () => {
  this.setState({ZipfailMessage : ''})
  document.getElementById('body').classList.remove("has-toast");
}
  render() {
    if(this.props.spinner){
      return <Spinner/>
    }
    return (
      <Formik
        initialValues={this.state}
        /* Validations for Form */
        validationSchema={Yup.object().shape({
          shippingAddressLine1: Yup.string().required("Required"),
          billingAddressLine1: Yup.string().required("Required"),
          firstname: Yup.string().required("FirstName Cant be Empty"),
          shippingFirstname: Yup.string().required("FirstName Cant be Empty"),
          billingFirstname: Yup.string().required("FirstName Cant be Empty"),
          lastname: Yup.string().required("LastName Cant be Empty"),
          shippingLastname: Yup.string()
            .min(3, "Name Sholud be Atleast 3 characters")
            .required("LastName Cant be Empty"),
          billingLastname: Yup.string()
            .min(3, "Name Sholud be Atleast 3 characters")
            .required("LastName Cant be Empty"),
          contact: Yup.number().required("contact is Required"),
          email: Yup.string()
            .email("Enter a valid email")
            .required("Email is required"),
          shippingZipCode: Yup.string()
            .matches(/^[0-9]{5}$/, "Must be exactly 5 digits")
            .required("ZipCode is required"),
          billingZipCode: Yup.number().required("ZipCode Cant be Empty"),
          shippingCountry: Yup.string().required("Country Cant be Empty"),
          billingCountry: Yup.string().required("Country Cant be Empty"),
          shippingState: Yup.string().required("State Cant be Empty"),
          billingState: Yup.string().required("State Cant be Empty"),
          shippingCity: Yup.string().required("City Cant be Empty"),
          billingCity: Yup.string().required("City Cant be Empty"),
        })}
        onSubmit={(fields) => {
          const field = { ...fields };
          field.billingSameAsShipping = this.state.billingSameAsShipping
            ? 1
            : 0;
          sessionStorage.setItem("regData", JSON.stringify(fields));
          this.props.createCustomer(fields);
        }}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
          } = props;

          return (
            <form
              id="startSubscriptionForm"
              name="form1"
              onSubmit={handleSubmit}
              onChange={(sessionStorage.setItem("formValues",JSON.stringify(values)))}
            >
              <div className="checkout-content-body-inner">
                <h2>Proceed to Checkout</h2>
                {/* zipcode valication */}
                <Snackbar
                  open={this.state.ZipfailMessage ? true : false}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  className="snackbar snackbar-full"
                >
                  <MuiAlert variant="filled" onClose={this.handleClose} severity="error">
                    
                    {"This facility is not available at this location"}
                  </MuiAlert>
                </Snackbar>
                {/** Contact information */}
                <fieldset className="form-card">
                  <Grid
                    container
                    spacing={0}
                    justify="space-between"
                    alignItems="center"
                    className="mb-15"
                  >
                    <Grid item>
                      <Typography variant="h4" component="h4">
                        Contact information
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} className="form-card-container">
                    {/** First Name */}
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <InputLabel className="form-label">
                          First Name
                          <span className="text-danger">*</span>
                        </InputLabel>
                        <OutlinedInput
                          id="firstname"
                          value={values.firstname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.firstname && Boolean(errors.firstname)}
                        />
                        <ErrorMessage
                          component="div"
                          name="firstname"
                          className="text-danger"
                        />
                      </FormControl>
                    </Grid>
                    {/** Last Name */}
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <InputLabel className="form-label">
                          Last Name <span className="text-danger">*</span>
                        </InputLabel>
                        <OutlinedInput
                          id="lastname"
                          value={values.lastname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.lastname && Boolean(errors.lastname)}
                        />
                        <ErrorMessage
                          component="div"
                          name="lastname"
                          className="text-danger"
                        />
                      </FormControl>
                    </Grid>
                    {/** Email  */}
                    <Grid item xs={12} sm={12}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <InputLabel className="form-label">
                          Email Address
                          <span className="text-danger">*</span>
                        </InputLabel>
                        <OutlinedInput
                          id="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.email && Boolean(errors.email)}
                        />
                        <ErrorMessage
                          component="div"
                          name="email"
                          className="text-danger"
                        />
                      </FormControl>
                    </Grid>

                    {/** Phone Number */}
                    <Grid item xs={12} sm={12}>
                      <Grid container spacing={0}>
                        <Grid item>
                          <FormControl
                            className="form-group"
                            variant="outlined"
                          >
                            <Select native className="phone-select">
                              <option value="1">+1</option>
                              <option value="2">+91</option>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item sm xs container>
                          <FormControl
                            fullWidth
                            className="form-group"
                            variant="outlined"
                          >
                            <InputLabel className="form-label">
                              Phone Number
                              <span className="text-danger">*</span>
                            </InputLabel>
                            <OutlinedInput
                              className="phone-input"
                              id="contact"
                              value={values.contact}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.contact && Boolean(errors.contact)}
                            />
                            <ErrorMessage
                              component="div"
                              name="contact"
                              className="text-danger"
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </fieldset>

                {/**  Shipping information */}
                <fieldset className="form-card">
                  <Grid
                    container
                    spacing={0}
                    justify="space-between"
                    alignItems="center"
                    className="mb-15"
                  >
                    <Grid item>
                      <Typography variant="h4" component="h4">
                        Shipping information
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} className="form-card-container">
                    {/** First Name */}
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <InputLabel className="form-label">
                          First Name
                          <span className="text-danger">*</span>
                        </InputLabel>
                        <OutlinedInput
                          id="shippingFirstname"
                          onChange={(e) => {
                            setFieldValue("shippingFirstname", e.target.value);
                            if (this.state.billingSameAsShipping) {
                              setFieldValue("billingFirstname", e.target.value);
                            }
                          }}
                          onBlur={handleBlur}
                          error={
                            touched.shippingFirstname &&
                            Boolean(errors.shippingFirstname)
                          }
                          value={values.shippingFirstname}
                        />
                        <ErrorMessage
                          component="div"
                          name="shippingFirstname"
                          className="text-danger"
                        />
                      </FormControl>
                    </Grid>
                    {/** Last Name  */}
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <InputLabel className="form-label">
                          Last Name
                          <span className="text-danger">*</span>
                        </InputLabel>
                        <OutlinedInput
                          id="shippingLastname"
                          onChange={(e) => {
                            setFieldValue("shippingLastname", e.target.value);
                            if (this.state.billingSameAsShipping) {
                              setFieldValue("billingLastname", e.target.value);
                            }
                          }}
                          onBlur={handleBlur}
                          error={
                            touched.shippingLastname &&
                            Boolean(errors.shippingLastname)
                          }
                          value={values.shippingLastname}
                        />
                        <ErrorMessage
                          component="div"
                          name="shippingLastname"
                          className="text-danger"
                        />
                      </FormControl>
                    </Grid>

                    {/** Address Line 1 */}
                    <Grid item xs={12} sm={12}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <InputLabel className="form-label">
                          Address Line 1<span className="text-danger">*</span>
                        </InputLabel>

                        <OutlinedInput
                          id="shippingAddressLine1"
                          value={values.shippingAddressLine1}
                          onChange={(e) => {
                            setFieldValue("shippingAddressLine1", e.target.value);
                            if (this.state.billingSameAsShipping) {
                              setFieldValue("billingAddressLine1", e.target.value);
                            }
                          }}
                          onBlur={handleBlur}
                          error={
                            touched.shippingAddressLine1 &&
                            Boolean(errors.shippingAddressLine1)
                          }
                        />

                        <ErrorMessage
                          component="div"
                          name="shippingAddressLine1"
                          className="text-danger"
                        />
                      </FormControl>
                    </Grid>
                    {/** Address Line 2 */}
                    <Grid item xs={12} sm={12}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <InputLabel className="form-label">
                          Address Line 2
                        </InputLabel>

                        <OutlinedInput
                          id="shippingAddressLine2"
                          value={values.shippingAddressLine2}
                          onChange={(e) => {
                            setFieldValue("shippingAddressLine2", e.target.value);
                            if (this.state.billingSameAsShipping) {
                              setFieldValue("billingAddressLine2", e.target.value);
                            }
                          }}
                          onBlur={handleBlur}
                        />

                        <ErrorMessage
                          component="div"
                          name="shippingAddressLine2"
                          className="text-danger"
                        />
                      </FormControl>
                    </Grid>
                    {/* shippingCountry Drop */}
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <ReactSelect
                          name="shippingCountry"
                          value={countryOptions.find(
                            (option) => option.value === values.shippingCountry
                          )}
                          onChange={(e) => {
                            setFieldValue("shippingCountry", e.value);
                            if (this.state.billingSameAsShipping) {
                              setFieldValue("billingCountry", e.value);
                            }
                          }}
                          onBlur={() =>
                            setFieldTouched("shippingCountry", true)
                          }
                          touched={touched.shippingCountry}
                          options={countryOptions}
                          className="react-select-theme react-select-big"
                          placeholder="Shipping Country"
                          error={errors.shippingCountry}
                        />
                        <ErrorMessage
                          component="div"
                          name="shippingCountry"
                          className="text-danger"
                        />
                      </FormControl>
                    </Grid>
                    {/** State */}
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <ReactSelect
                          id="shippingState"
                          name="shippingState"
                          value={usStateData.find(
                            (option) => option.value === values.shippingState
                          )}
                          onChange={(e) => {
                            setFieldValue("shippingState", e.value);
                            this.onStatechange(e, handleBlur, values);
                            if (this.state.billingSameAsShipping) {
                              setFieldValue("billingState", e.value);
                            }
                          }}
                          onBlur={() => setFieldTouched("shippingState", true)}
                          touched={touched.shippingState}
                          options={usStateData}
                          className="react-select-theme react-select-big"
                          placeholder="State"
                          error={errors.shippingState}
                        />

                        <ErrorMessage
                          component="div"
                          name="shippingState"
                          className="text-danger"
                        />
                      </FormControl>
                    </Grid>
                    {/** City */}
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <InputLabel className="form-label">
                          City <span className="text-danger">*</span>
                        </InputLabel>
                        <OutlinedInput
                          id="shippingCity"
                          onChange={(e) => {
                            setFieldValue("shippingCity", e.target.value);
                            if (this.state.billingSameAsShipping) {
                              setFieldValue("billingCity", e.target.value);
                            }
                          }}
                          onBlur={handleBlur}
                          error={
                            touched.shippingCity && Boolean(errors.shippingCity)
                          }
                          value={values.shippingCity}
                        />
                        <ErrorMessage
                          component="div"
                          name="shippingCity"
                          className="text-danger"
                        />
                      </FormControl>
                    </Grid>
                    {/** ZipCode */}
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <InputLabel className="form-label">
                          Zip <span className="text-danger">*</span>
                        </InputLabel>
                        <OutlinedInput
                          id="shippingZipCode"
                          ref={(input) => {
                            this.nameInput = input;
                          }}
                          autoComplete='new-password'
                          onChange={(e) => this.zip(e, setFieldValue)}
                          onBlur={(e) =>
                            this.handleZipFieldBlur(e, handleBlur, values)
                          }
                          error={
                            touched.shippingZipCode &&
                            Boolean(errors.shippingZipCode)
                          }
                          value={values.shippingZipCode}
                        />
                        <ErrorMessage
                          component="div"
                          name="shippingZipCode"
                          className="text-danger"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </fieldset>
                {/*  Billing information */}
                <fieldset className="form-card">
                  <Grid
                    container
                    spacing={0}
                    justify="space-between"
                    alignItems="center"
                    className="mb-15"
                  >
                    <Grid item>
                      <Typography variant="h4" component="h4">
                        Billing information
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} className="form-card-container">
                    <Grid item xs={12} sm={12} className="grid-checkbox">
                      <FormControlLabel
                        className="rememberCheck"
                        style={{ marginBottom: "0px" }}
                        control={
                          <Checkbox
                            className="checkBx"
                            name="isBilling"
                            color="primary"
                            onChange={() =>
                              this.billingInformation(values, setFieldValue)
                            }
                          />
                        }
                        label="Billing Information same as Shipping information"
                      />
                    </Grid>
                     {this.state.billingSameAsShipping ? (
                      " "
                    ) : (
                      <React.Fragment>
                        {/** First Name  */}
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            className="form-group"
                            variant="outlined"
                          >
                            <InputLabel className="form-label">
                              First Name
                              <span className="text-danger">*</span>
                            </InputLabel>
                            <OutlinedInput
                              id="billingFirstname"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.billingFirstname &&
                                Boolean(errors.billingFirstname)
                              }
                              value={values.billingFirstname}
                            />
                            <ErrorMessage
                              component="div"
                              name="billingFirstname"
                              className="text-danger"
                            />
                          </FormControl>
                        </Grid>
                        {/** Last Name*/}
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            className="form-group"
                            variant="outlined"
                          >
                            <InputLabel className="form-label">
                              Last Name
                              <span className="text-danger">*</span>
                            </InputLabel>
                            <OutlinedInput
                              id="billingLastname"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.billingLastname &&
                                Boolean(errors.billingLastname)
                              }
                              value={values.billingLastname}
                            />
                            <ErrorMessage
                              component="div"
                              name="billingLastname"
                              className="text-danger"
                            />
                          </FormControl>
                        </Grid>
                        {/** Address Line 1 */}
                        <Grid item xs={12} sm={12}>
                          <FormControl
                            fullWidth
                            className="form-group"
                            variant="outlined"
                          >
                            <InputLabel className="form-label">
                              Address Line 1
                              <span className="text-danger">*</span>
                            </InputLabel>

                            <OutlinedInput
                              id="billingAddressLine1"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.billingAddressLine1 &&
                                Boolean(errors.billingAddressLine1)
                              }
                              value={values.billingAddressLine1}
                            />

                            <ErrorMessage
                              component="div"
                              name="billingAddressLine1"
                              className="text-danger"
                            />
                          </FormControl>
                        </Grid>
                        {/** Address Line 2 */}
                        <Grid item xs={12} sm={12}>
                          <FormControl
                            fullWidth
                            className="form-group"
                            variant="outlined"
                          >
                            <InputLabel className="form-label">
                              Address Line 2
                            </InputLabel>

                            <OutlinedInput
                              id="billingAddressLine2"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.billingAddressLine2}

                            />
                            <ErrorMessage
                              component="div"
                              name="billingAddressLine2"
                              className="text-danger"
                            />
                          </FormControl>
                        </Grid>
                        {/** Country DropdownList */}
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            className="form-group"
                            variant="outlined"
                          >
                            <ReactSelect
                              name="billingCountry"
                              value={countryOptions.find(
                                (option) =>
                                  option.value === values.billingCountry
                              )}
                              onBlur={() =>
                                setFieldTouched("billingCountry", true)
                              }
                              onChange={(e) =>
                                setFieldValue("billingCountry", e.value)
                              }
                              error={errors.billingCountry}
                              touched={touched.billingCountry}
                              options={countryOptions}
                              className="react-select-theme react-select-big"
                              placeholder=" Billing Country"
                            />
                            <ErrorMessage
                              component="div"
                              name="billingCountry"
                              className="text-danger"
                            />
                          </FormControl>
                        </Grid>

                        {/** State */}
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            className="form-group"
                            variant="outlined"
                          >
                            <ReactSelect
                              id="billingState"
                              name="billingState"
                              value={usStateData.find(
                                (option) =>
                                  option.value === values.billingState
                              )}
                              onChange={(e) =>{
                                  setFieldValue("billingState", e.value); }
                              }
                              onBlur={() =>
                                setFieldTouched("billingState", true)
                              }
                              touched={touched.billingState}
                              options={usStateData}
                              className="react-select-theme react-select-big"
                              placeholder="State"
                              error={errors.billingState}
                            />
                            <ErrorMessage
                              component="div"
                              name="billingState"
                              className="text-danger"
                            />
                          </FormControl>
                        </Grid>
                        {/** City */}
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            className="form-group"
                            variant="outlined"
                          >
                            <InputLabel className="form-label">
                              City <span className="text-danger">*</span>
                            </InputLabel>

                            <OutlinedInput
                              id="billingCity"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.billingCity &&
                                Boolean(errors.billingCity)
                              }
                              value={values.billingCity}
                            />
                            <ErrorMessage
                              component="div"
                              name="billingCity"
                              className="text-danger"
                            />
                          </FormControl>
                        </Grid>
                        {/** ZipCode */}
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            className="form-group"
                            variant="outlined"
                          >
                            <InputLabel className="form-label">
                              Zip <span className="text-danger">*</span>
                            </InputLabel>
                            <OutlinedInput
                              name="billingZipCode"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.billingZipCode &&
                                Boolean(errors.billingZipCode)
                              }
                              value={values.billingZipCode}
                            />
                            <ErrorMessage
                              component="div"
                              name="billingZipCode"
                              className="text-danger"
                            />
                          </FormControl>
                        </Grid>
                      </React.Fragment>
                    )}
                  </Grid>
                </fieldset>
              </div>

              <div className="button-group text-right">
                <Button
                  variant="contained"
                  color="primary"
                  className={" btn-mui btn-red"}
                  id="keepShopping"
                  onClick={() => {
                    this.props.moveToPrevStepCheckout();
                  }}
                >
                  Keep Shopping
                </Button>

                <Button
                  type="submit"
                  disabled={this.state.submitDisabled}
                  variant="contained"
                  color="primary"
                  className="btn-mui btn-blue"
                  id="ContinueRegistration"
                >
                  Continue
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    zipResponse: state.reducer.zipResponse,
  };
};
export default connect(mapStateToProps, { actionZipcodeVerification })(
  withRouter(Registration)
);
