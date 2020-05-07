import { Button, Dialog, DialogContent } from "@material-ui/core";
import { ErrorMessage, Formik } from "formik";
import React, { Component } from "react";
import OtpInput from "react-otp-input";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as Yup from "yup";
import { actionZipcodeVerification } from "../../actions/ProductAction";


class ZipCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: " ",

    };
  }

   
  
  /**
   *  
   * @description for redirecting to signupsteps page after successful validation of Zipcode 
   * @param {*} zipcode
   * 
   */
  redirect(zipcode,response) {
    //console.log("response",response)
    
    if(response.success){
      if(!!response.data){
        sessionStorage.setItem("_lo_No", response.data.locationId);
      }
      
    }
    sessionStorage.setItem("Zipcode", zipcode);
    let clickedBtn =this.props.clickedBtn
    if(clickedBtn === "getStarted" && clickedBtn !== "cartIcon"){
     this.props.history.push("/signupsteps");
    }
    else{
      this.props.history.push("/signupsteps?status=2");

    }
  }

  render() {
    return (
      <Dialog
        open={this.props.dailogOpen}
        onClose={this.props.onClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth={false}
        classes={{	
          paper: "modal-450 modal-zip",	
          root: "modal-stack-top"	
        }}
      >
        {/* Dialog Content */}
        <DialogContent>
          <div className="zipcode-div">
            <Formik
              enableReinitialize={true}
              initialValues={{ zipcode: "" }}
              // verifies for the zipcode entered by user and submits to api & based on response it redirects or shows error message  
              onSubmit={async values => {
                this.props.actionZipcodeVerification(values).then(() => {
                  let zipResponse = this.props.zipResponse;
                  if(!!zipResponse) {
                  if (zipResponse.data.success === true && zipResponse.status === 200) {
                    this.props.onClose();
                    this.redirect(values.zipcode,zipResponse.data);
                  } else {
                    this.props.history.push("/invalidzip");
                    this.props.onClose();
                  }}
                });
              }}
              //validations for zipcode
              validationSchema={Yup.object().shape({
                zipcode: Yup.string().required("Zip Code Required")
              })}
            >
              {props => {
                const {
                  values,
                  touched,
                  errors,
                  handleBlur,
                  setFieldValue,
                  handleSubmit
                } = props;
                return (
                  <form onSubmit={handleSubmit}>
                    {/* Zipcode input  */}
                    <div className="zip-info">
                      <div className="info0">Enter Your Zipcode</div>
                      <div className="info1">Please enter your zipcode before continuing to shopping.</div>
                    </div>
                    <div className="zip-input">
                      <OtpInput
                            style={{
                              width: "3rem",
                              height: "3rem",
                              margin: "0 1rem",
                              fontSize: "2rem",
                              borderRadius: 4,
                              border: "1px solid rgba(0,0,0,0.3)"
                            }}
                            name="zipcode"
                            numInputs={5}
                            isDisabled={false}
                            onChange={zipValue =>
                              setFieldValue("zipcode", zipValue)
                            }
                            onBlur={handleBlur}
                            separator={<span>-</span>}
                            value={values.zipcode}
                            isInputNum={true}
                            shouldAutoFocus
                            className={
                              errors.zipcode && touched.zipcode
                                ? "text-input error"
                                : "text-input"
                            }
                          />
                          <ErrorMessage
                            component="div"
                            name="zipcode"
                            className="text-danger font-14 mt-10"
                          />
                          <div className="text-danger font-14 mt-5">
                            {this.state.errorMessage}
                          </div>
                      <div className="submit-div">
                        <Button
                          type="submit"
                          variant="contained"
                          id="VerifyZip"
                          className="btn-mui btn-yellow verify-button"
                        >
                          Verify
                        </Button>
                      </div>
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = state => {
  return {
    zipResponse: state.reducer.zipResponse,
    validationMessage: state.reducer.validationMessage
  };
};

export default withRouter(connect(mapStateToProps, {actionZipcodeVerification})(ZipCode));
