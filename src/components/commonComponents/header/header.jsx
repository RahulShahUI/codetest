import { AppBar, Button, Container, Drawer, Grid, IconButton, List, ListItem, Toolbar, withStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import ZipCode from "../../zipcode/ZipCode";

const styles = theme => ({
  menuButton: {
    display: "none",
    width: "auto",
    [theme.breakpoints.down("sm")]: {
      display: "block"
    }
  },
  cSelect: {
    position: "relative",
    paddingRight: "15px",
    "&:after": {
      content: '" "',
      right: "5px",
      position: "absolute",
      width: "0",
      height: "0",
      borderLeft: "5px solid transparent",
      borderRight: "5px solid transparent",
      borderTop: "5px solid rgba(0, 0, 0, 0.54)",
      fontSize: "0",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none"
    }
  },
  selectMenu: {
    appearance: "none",
    backgroundColor: "transparent",
    border: "nonMenue",
    color: Toolbar, withStyles: "#333",
    fontSize: "16px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px"
    }
  },
  dropdownList: {
    display: "block"
  },
  customDropdown: {
    position: "absolute",
    border: "1px solid rgba(0, 0, 0, 0.15)",
    top: "100%",
    zIndex: "9",
    backgroundColor: "#fff",
    minWidth: "150px"
  },
  accButton: {
    position: "relative",
    paddingRight: "15px",
    "&:after": {
      content: '" "',
      right: "0px",
      position: "absolute",
      width: "0",
      height: "0",
      borderLeft: "5px solid transparent",
      borderRight: "5px solid transparent",
      borderTop: "5px solid rgba(0, 0, 0, 0.54)",
      fontSize: "0",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none"
    }
  },
  closeDrawer: {
    position: "absolute",
    top: "0",
    right: "0",
    zIndex: "9"
  }
});

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDrawer: false,
      clickAway: false,
      count: 0,
      clickedBtn: "",
      dailogOpen : false
    };
  }


  /**
   * 
   * @description For the mobile View
   * @memberof Header
   * 
   */
  toggleDrawer = () => {
    this.setState({ showDrawer: !this.state.showDrawer });
  };

  /**
   * 
   * @description validation for Zipcode dialog
   * @memberof Header
   * 
   */
  zipValidation = () => {
    let zipcodeVerified = sessionStorage.getItem("Zipcode");
    if (zipcodeVerified) {
      this.props.history.push("/signupsteps");
    } else {
      this.setState({ dailogOpen: true, clickedBtn: "getStarted" });
    }
  };

  /**
   * 
   * @description Checking for zipcodeVerified or not and based on verification route to cart page
   * @memberof Header
   * 
   */
  cartZipValidation = () => {
    let zipcodeVerified = sessionStorage.getItem("Zipcode");
    if (zipcodeVerified) {
      this.props.history.push("/signupsteps?status=2");
    } else {
      this.setState({ dailogOpen: true, clickedBtn: "cartIcon" });
    }
  };

  /**
   * 
   * @description To hide the Zip dialog
   * @memberof Header
   * 
   */
  hideDialog() {
    this.setState({ dailogOpen: false });
  }

  
  /**
   * 
   * @description for getting cart items and also the calculating sum of quantities.
   * @memberof Header
   * 
   */
  getCount() {
    let cartItems = JSON.parse(sessionStorage.getItem("cartItems"));
    let count = 0;
    cartItems &&
      cartItems.map(item => {
        count = count + parseInt(item.quantity);
        return count;
      });
    this.setState({ count: count });
  }

  componentDidMount() {
    // function called for the calculation of cartcount
    this.getCount();
    var that = this;
    // event listener for the change in local storage
    document.addEventListener("cartitem", function (e) {
      let cartItems = sessionStorage.getItem("cartItems") ? JSON.parse(sessionStorage.getItem("cartItems")) : 0;
      let count = 0;
      if (cartItems.length > 0) {
        cartItems.map(items => {
          count = count + parseInt(items.quantity);
          return count;
        });
        that.setState({ count: count })
      }
      else {
        that.setState({ count: 0 })
      }
      that.forceUpdate();
      // Rerendering the component
    });
  }



  render() {
    const { classes } = this.props;
    return (
      /* Header Section */

      <AppBar
        color="inherit"
        className={this.state.showDrawer === true ? "header open" : "header"}
      >
        <Toolbar className={classes.Toolbar}>
          <Container className="container-root">
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={4} className="logo-wrapper">
                <Link to="/home">
                  <img
                    src="images/logo.png"
                    alt="logo"
                    className={classes.logo + " logo"}
                  />
                </Link>
              </Grid>
              <Grid
                item
                xs={8}
                className="pl-0 menu-link-wrapper menu-link-web"
              >
                <List className="menu-list">
                  <ListItem className="menu-list-single hide-959">
                    <Button
                      onClick={this.zipValidation}
                      className="menu-link btn-blue btn-mui btn-sm text-capitalize"
                      id="getStart"
                    >
                      Get Started
                    </Button>
                  </ListItem>
              
                      
                  
                    

                  <ListItem className="menu-list-single cart-list">
                    <IconButton
                      className="menu-link"
                      disabled={this.state.count > 0 ? false : true}
                      onClick={() => this.cartZipValidation()}
                    >
                      <ShoppingCart />
                      {this.state.count > 0 ? <span className="cart-count">{this.state.count}</span> : ''}
                    </IconButton>
                  </ListItem>
                  <ListItem
                    className={"menu-list-single " + classes.menuButton}
                  >
                  </ListItem>
                </List>

                <ZipCode
                  onClose={() => this.hideDialog()}
                  dailogOpen={this.state.dailogOpen}
                  clickedBtn={this.state.clickedBtn}
                />
              </Grid>
            </Grid>  
          </Container>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(withStyles(styles)(Header));
