import React, { Component } from "react";
import { Typography, Grid, FormControl, InputLabel, OutlinedInput, TextField, Select, Button } from "@material-ui/core";
import { Formik } from "formik";
class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="common-box">
        <div className="common-box-header">
          <Typography variant="h2">Contact Us</Typography>
        </div>
        <Formik>
          {props => {
            return (
              <>
                <div className="common-box-body">

                  <Grid
                    container
                    spacing={2}
                  >
                    {/* Subject */}
                    <Grid item xs={12} sm={12}>
                      <FormControl
                        fullWidth
                        className="form-group phone-select phone-select-full"
                        variant="outlined"
                      >
                        <InputLabel id="subject" className="form-label">Subject<span className="text-danger">*</span></InputLabel>
                        <Select native labelId="subject">
                          <option aria-label="None" value="" />
                          <option value="Refunds">Payment Refunds</option>
                          <option value="Returns">Returns</option>
                          <option value="Login issues">Login issues</option>
                          <option value="Payment issues">Payment issues</option>
                          <option value="Problems with order submit">Problems with order submit</option>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Name */}
                    <Grid item xs={12} sm={12}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <InputLabel className="form-label">Name<span className="text-danger">*</span></InputLabel>
                        <OutlinedInput
                          id="firstname"
                        />
                      </FormControl>
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} sm={12}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <InputLabel className="form-label">Email<span className="text-danger">*</span></InputLabel>
                        <OutlinedInput
                          id="email"
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
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Order ID */}
                    <Grid item xs={12} sm={12}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <InputLabel className="form-label">Order ID<span className="text-danger">*</span></InputLabel>
                        <OutlinedInput
                          id="orderId"
                        />
                      </FormControl>
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12} sm={12}>
                      <FormControl
                        fullWidth
                        className="form-group"
                        variant="outlined"
                      >
                        <TextField
                          id="outlined-multiline-static"
                          label="Description"
                          multiline
                          rows="4"
                          variant="outlined"
                          className="textarea"
                        />
                      </FormControl>
                    </Grid>

                  </Grid>

                </div>
                <div className="button-group text-right">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="btn-mui btn-blue"
                    id="submitContact"
                  >
                    Submit
                  </Button>

                </div>
              </>
            )
          }}
        </Formik>
      </div>
    );
  }
}

export default ContactUs;
