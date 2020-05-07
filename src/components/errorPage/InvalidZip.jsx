import { Grid, Typography } from "@material-ui/core";
import React, { Component } from "react";

class InvalidZip extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
 

  render() {
    return (
      <div className="common-box">
        <Grid container className="text-center invalid-zip common-box-body">
          <Grid item xs={12}>
            <svg xmlns="http://www.w3.org/2000/svg" width="106" height="106" viewBox="0 0 106 106">
              <g transform="translate(-1 -1)">
                <path d="M105.29,26.645h-1.71V21.516a1.71,1.71,0,0,0-1.71-1.71H91.613a1.71,1.71,0,0,0-1.71,1.71v5.129H74.208L69.353,2.375A1.707,1.707,0,0,0,67.677,1H40.323a1.707,1.707,0,0,0-1.675,1.375L33.792,26.645H18.1V21.516a1.71,1.71,0,0,0-1.71-1.71H6.129a1.71,1.71,0,0,0-1.71,1.71v5.129H2.71A1.71,1.71,0,0,0,1,28.355V52.29A1.71,1.71,0,0,0,2.71,54h1.71V88.194a1.709,1.709,0,0,0,1.71,1.71H16.387a1.709,1.709,0,0,0,1.71-1.71V54H28.321l-10.19,50.955A1.709,1.709,0,0,0,19.806,107H88.194a1.709,1.709,0,0,0,1.675-2.045L79.679,54H89.9V86.484a1.709,1.709,0,0,0,1.71,1.71h10.258a1.709,1.709,0,0,0,1.71-1.71V54h1.71A1.71,1.71,0,0,0,107,52.29V28.355A1.71,1.71,0,0,0,105.29,26.645ZM6.837,50.581,27.353,30.065H36.2L15.679,50.581ZM41.03,30.065H55L34.486,50.581H20.514Zm18.806,0h8.842L48.163,50.581H39.321Zm13.677,0H87.486L66.97,50.581H53Zm18.806,0h8.842L80.647,50.581H71.8Zm1-6.839h6.839v3.419H93.323ZM41.725,4.419H52.29v6.839H55.71V4.419H66.275l4.445,22.226H37.279ZM7.839,23.226h6.839v3.419H7.839Zm14.679,6.839-18.1,18.1v-18.1ZM14.677,86.484H7.839V54h6.839Zm71.43,17.1H55.71V96.742H52.29v6.839h-30.4L31.808,54H76.192Zm14.054-18.806H93.323V54h6.839ZM85.482,50.581l18.1-18.1v18.1Z" />
                <path d="M31,49h3.419v6.839H31Z" transform="translate(21.29 34.065)" />
                <path d="M31,41h3.419v6.839H31Z" transform="translate(21.29 28.387)" />
                <path d="M31,33h3.419v6.839H31Z" transform="translate(21.29 22.71)" />
                <path d="M31,11h3.419v6.839H31Z" transform="translate(21.29 7.097)" />
              </g>
            </svg>
            <Typography variant="h4" component="h4">
              We are sorry.
            </Typography>
            <Typography variant="h5" component="h5">
              This facility is not available at this location
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default InvalidZip;
