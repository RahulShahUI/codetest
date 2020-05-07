import React from "react";
import { Route } from "react-router-dom";
import NavBar from "./commonComponents/header/header";
import Footer from "./commonComponents/footer/Footer";

const RouteRapper = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>        
          <React.Fragment>
            <NavBar />
            <main 
              className={
                "main-contain" + " " +
                (window.location.hash  === '#/home' || window.location.hash  === '#/' ? "main-contain-home" : "")
              }
            >
              <div className="main-contain-inner">
                <Component {...props} />
              </div>
            </main>
            <Footer />
          </React.Fragment>
        
    }
  />
);
export default RouteRapper;
