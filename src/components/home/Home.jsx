import React, { Component } from "react";
import { Button } from '@material-ui/core';
import ZipCode from "../zipcode/ZipCode";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedBtn: "",
      dailogOpen : false
    };
  }
  zipValidation = () => {
    let zipcodeVerified = sessionStorage.getItem("Zipcode");
    if (zipcodeVerified) {
      this.props.history.push("/signupsteps");
    } else {
      this.setState({ dailogOpen: true, clickedBtn: "getStarted" });
    }
  };

  hideDialog() {
    this.setState({ dailogOpen: false });
  }
  
  componentDidMount() {
    let loginClicked = localStorage.getItem("loginClicked");
    if (loginClicked === "checkout") {
      localStorage.removeItem("loginClicked");
    }
  }
  render() {
    return (
      <React.Fragment>
        <div id="content">
          {/* <SwipeableTextMobileStepper /> */}
          <div className="hero">
            <img className="hero-background" src="images/hero_background.png" alt="hero background" />
            <img className="hero-left" src="images/hero_left.png" alt="hero left" />
            <img className="hero-right" src="images/hero_right.png" alt="hero right" />
            <div className="hero-text">
              <div className="hero-header">
                <img src="/images/homepage-hero-type.png" alt="hero type" />
              </div>
              <div className="hero-subheader">Create a snack pack full of your favorite Frito-Lay products</div>
              <div className="get-started text-center">
                <Button
                    variant="contained"
                    color="primary"
                    id="getStartedHome"
                    className="btn-mui btn-outlined"
                    onClick={this.zipValidation}
                    >Get Started</Button>
              </div>
              <div className="hero-footnote">Create your snack pack in a few easy steps</div>
              <div className="arrow"></div>
            </div>
          </div>
        </div>
        <div className="home-step step1">
          <div className="info">
            <img src="images/home_step1.png" alt="home step 1" />
            <div className="step-title">Pick Your Snacks</div>
            <div className="step-info">Choose from your favorite Frito-Lay products to create a snack pack the way you want!</div>
          </div>
          <div className="image">
            <img src="images/home_step1_img.png" alt="home step 1" />
          </div>
        </div>
        <div className="home-step step2">
          <div className="image">
            <img src="images/home_step2_img.png" alt="home step 2" />
          </div>
          <div className="info">
            <img src="images/home_step2.png" alt="home step 2" />
            <div className="step-title">Place Your Order</div>
            <div className="step-info">Checkout is fast, easy and your order ships directly to your door.</div>
          </div>
        </div>
        <div className="home-step step3">
          <div className="info">
            <img src="images/home_step3.png" alt="home step 3" />
            <div className="step-title">Enjoy Your Snack</div>
            <div className="step-info">Your snacks will arrive fresh and ready to eat. Kick back and enjoy!</div>
          </div>
          <div className="image">
            <img src="images/home_step3_img.png" alt="home step 3" />
          </div>
        </div>
        <div className="get-started text-center">
          <Button
              variant="contained"
              color="primary"
              id="getStartedHome1"
              className="btn-mui btn-red"
              onClick={this.zipValidation}
              >Get Started</Button>
        </div>

        <ZipCode
          onClose={() => this.hideDialog()}
          dailogOpen={this.state.dailogOpen}
          clickedBtn={this.state.clickedBtn}
        />

      </React.Fragment>
    );
  }
}

export default Home;
