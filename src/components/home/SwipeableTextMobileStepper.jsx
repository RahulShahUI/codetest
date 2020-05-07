
import React, { Component } from 'react';
import {
  withStyles,
  Container,
  Button,
  MobileStepper

} from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles';
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { actionLabelList } from "../../actions/ProductAction";
import { connect } from "react-redux";
import Spinner from "../Spinner";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);



let theme = createMuiTheme();
const styles = theme => ({
  root: {
    width: "100%",
    flexGrow: 1
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default
  },
  img: {
    height: "",
    display: "block",
    overflow: "hidden",
    width: "100%"
  },
  dot: {
    width: "13px",
    height: "13px",
    margin: "0 3px",
    border: "1px solid #fff",
    backgroundColor: "transparent"
  },
  dotActiv: {
    backgroundColor: "#FFCC00"
  },
  dotsMain: {
    position: "absolute",
    bottom: "42px",
    width: "100%",
    justifyContent: "center",
    left: "0"
  }
});
class SwipeableTextMobileStepper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      lableListing: []
    };
  }
  componentWillMount() {
    this.getlabelList()
  }


  /**
   *@desc api calling for labels and images for banner
   *
   * @memberof SwipeableTextMobileStepper
   */
  getlabelList() {
    this.props
      .actionLabelList()
      .then(() => {
        this.props.labelList.Home.forEach(HomeLabel => {
          HomeLabel.Banner.forEach(bannerLabel => {

            this.setState({
              lableListing: bannerLabel.labelData
            });
          })

        })
      }).catch(() => {
        return <p> Some Technical Issue</p>
      });

  }

  /**
   * 
   *@description swipes for next image
   * @memberof SwipeableTextMobileStepper
   * 
   */
  handleNext = () => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  /**
   * 
   *@description swipes to previous image
   * @memberof SwipeableTextMobileStepper
   * 
   */
  handleBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 })
  };
  
  /**
   * 
   *@description handles the image change using the angle in image banner 
   * @memberof SwipeableTextMobileStepper
   * 
   */
  handleStepChange = step => {
    this.setState({ activeStep: step })
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        {this.state.lableListing.length !== 0 ? (
          <div className={classes.root + " banner-slider"}>
            <AutoPlaySwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={this.state.activeStep}
              onChangeIndex={this.handleStepChange}
              enableMouseEvents
            >
              {this.state.lableListing.map((step, index) => (
                <div key={index}>
                  {Math.abs(this.state.activeStep - index) <= 2 ? (
                    <div className={"banner-layer " + step.slide}>
                      <div
                        className="banner-layer-img"
                        style={{ backgroundImage: `url(${step.labelImage})` }}
                      ></div>
                      <div className="banner-desc">
                        <Container className="container-root">
                          <div className="banner-inner">
                            <div>
                              <div className="page-header">
                                {<h1>{step.labelHeading}</h1>}
                              </div>
                            </div>

                            <div className="new-p-para">
                              <div>
                                <div className="page-header">
                                  <p>{step.label}</p>
                                </div>
                              </div>
                            </div>
                            {!step.buttonText == "" ?
                              <Button id="exploreMore" href={step.buttonUrl} className="btn-yellow btn-mui get-started-btn">
                                {step.buttonText}
                              </Button>
                              : ""}
                          </div>
                        </Container>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </AutoPlaySwipeableViews>
            <MobileStepper
              variant="dots"
              steps={2}
              position="static"
              classes={{
                dot: classes.dot,
                dotActive: classes.dotActiv,
                dots: classes.dotsMain
              }}
              activeStep={this.state.activeStep}
              className={classes.root + " slider-Btn"}
              nextButton={
                <Button
                  size="small"
                  className="left-btn"
                  onClick={this.handleNext}
                  disabled={this.state.activeStep === 1}
                  id="sliderNext"
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                  ) : (
                      <KeyboardArrowRight />
                    )}
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  className="right-btn"
                  onClick={this.handleBack}
                  disabled={this.state.activeStep === 0}
                  id="sliderBack"
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                  ) : (
                      <KeyboardArrowLeft />
                    )}
                </Button>
              }
            />
          </div>
        ) : (
            <Spinner />
          )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    labelList: state.reducer.labelList || []
  };
};

export default connect(mapStateToProps, { actionLabelList })(
  withStyles(styles)(SwipeableTextMobileStepper)
);