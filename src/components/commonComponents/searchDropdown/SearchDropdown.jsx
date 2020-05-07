import { Button, Grid, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ReactSelect from "react-select";
import React, { Component } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import {
  actiongetFilter,
  actiongetProduct,
  actionLabelList,
} from "../../../actions/ProductAction";
import Spinner from "../../Spinner";

class SearchDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      filterOpen: "",
      brandName: [],
      sizeName: [],
      uniqueBrandValue: [],
      uniqueSizeValue: [],
      showSearchBar: false,
      DialougeBoxOpen: false,
      clearButton: [],
      searchbutton: [],
      placeHolderName: [],
      spinner: false,
    };
  }

  /**
   * @Desc updating and calling the api on page load.
   * @memberof ProductList
   */
  componentWillMount() {
    this.getProductList();
    this.getlabelList();
  }
  /**
   * @Desc For loading the data from the categories api.
   * @memberof ProductList
   */
  componentDidMount() {
    this.setState({ showSearchBar: false });
  }

  /**
   *@Desc getting  lable from the lable api
   *
   * @memberof SearchDropdown
   */
  getlabelList() {
    let labelPlaceHolderName = [];
    let lableButtonName = [];
    this.props
      .actionLabelList()
      .then(() => {
        this.props.labelList["Products Library"] !== undefined &&
          this.props.labelList["Products Library"].forEach((labels) => {
            labels.Filter.forEach((labelsName) => {
              this.setState({
                searchbutton: lableButtonName.push(
                  labelsName.sectionButtonText
                ),
                clearButton: lableButtonName.push(labelsName.sectionButtonText),
              });

              labelsName.labelData.forEach((data) => {
                labelPlaceHolderName.push(data.label);
                return this.setState({
                  searchbutton: lableButtonName[0][0],
                  clearButton: lableButtonName[0][1],
                  placeHolderName: labelPlaceHolderName,
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
   * @Desc Configure Bundel ProductList Api Calling & Search Filter Api Calling.
   * @memberof ProductList
   */
  getProductList() {
    /* Filter Api Calling */
    this.props.actiongetFilter().then(() => {
      /** filteredValue: Filtered Products i.e allergens,brands */
      let filteredValue = this.props.filterProducts
        ? this.props.filterProducts
        : "NULL";

      /** brandDropDown: Filtered Brands */
      let brandDropDown = filteredValue.brands;

      /** filteredBrands: Array with the Filtered Brands value and label */
      const filteredBrands = [];
      brandDropDown &&
        brandDropDown.map((brandValue) => {
          var objBrands = {};
          objBrands["label"] = brandValue;
          objBrands["value"] = brandValue;
          filteredBrands.push(objBrands);
          return filteredBrands;
        });

     
      /** sizeDropDown: Filtered size*/
      let sizeDropDown = filteredValue.size;
      /** fliteredFlavours: Array with the Filtered size value and label */
      const filteredSize = [];
      if (!!sizeDropDown) {
        Object.keys(sizeDropDown).map((key) => {
          var objSize = {};
          objSize["label"] = sizeDropDown[key];
          objSize["value"] = sizeDropDown[key];
          filteredSize.push(objSize);
          return filteredSize;
        });
      }

      this.setState({
        uniqueBrandValue: filteredBrands,
        uniqueSizeValue: filteredSize,
      });
    });
  }

  /**
   * @Desc Function For Filtering The Products on click Of Search button
   * @memberof ProductList
   */
  searchbtn = () => {
    let searchBrandsArr = [];
    if (this.state.brandName !== null) {
      searchBrandsArr = [...this.state.brandName];
      searchBrandsArr = searchBrandsArr.map((brand) => brand.value);
    }
    let searchSizeArr = [];
    if (this.state.sizeName.length !== 0) {
      searchSizeArr.push(this.state.sizeName.label);
    }
  
    let bundleId = this.state.bundleId ? this.state.bundleId : undefined;
    var dataObj = {};
    dataObj['catId'] = bundleId;
    dataObj["brand"] = searchBrandsArr;
    dataObj["size"] = searchSizeArr;    
    this.props.handleSearch(dataObj,true);
  };

  /**
   * @Desc Setting the Value From the Brand DropDown
   * @memberof ProductList
   */
  searchBrandsName = (brand) => {
    this.setState({ brandName: brand });
  };

  /**
   * @Desc Setting the Value of the size dropDown
   * @memberof ProductList
   */
  searchSize = (size) => {
    if (size != null) {
      this.setState({ sizeName: size });

      // set position of clear icon in single size select
      setTimeout(() => {
        var getSingleValWidth =
          $('.select-single div[class*="-singleValue"]').width() + 10;
        $('.select-single div[class*="-indicatorContainer"]:first-child').css({
          left: getSingleValWidth + "px",
        });
      }, 50);
    } else {
      this.setState({
        sizeName: [],
      });
    }
  };


  /**
   * @Desc Clearing the Values for the DropDown
   * @memberof ProductList
   */
  clearSearch = () => {
    this.setState({
      brandName: [],
      sizeName: [],
      flavorName: [],
      allergenDescription: "",
    })
    this.props.handleSearch({},false);
  };
  

  render() {
    return (
      <div className="product-filter-wrapper">
        <Grid
          container
          spacing={3}
          alignItems="flex-start"
          className={"product-filter " + this.state.filterOpen}
        >
          <IconButton
            className="filter-btn-close"
            onClick={() => {
              this.setState({ filterOpen: "" });
            }}
          >
            <CloseIcon />
          </IconButton>
          <Grid item sm={9} xs={12}>
            <Grid item container spacing={3}>
              <Grid item xs={12} sm={6}>
                <div className="select-multi react-select-multi brand-select">
                  <ReactSelect
                    id="uniqueBrand"
                    isClearable={true}
                    isMulti
                    options={this.state.uniqueBrandValue}
                 
                    placeholder={
                      !!this.state.placeHolderName[1]
                        ? this.state.placeHolderName[1]
                        : "Brand"
                    }
                    value={this.state.brandName}
                    onChange={this.searchBrandsName}
                    displayValue="label"
                    hideSelectedOptions={false}
                    closeMenuOnSelect={false}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="select-multi select-single react-select-multi">
                  <ReactSelect
                    id="uniqueSize"
                    isClearable={true}
                    options={this.state.uniqueSizeValue}
                    placeholder={
                      !!this.state.placeHolderName[0]
                        ? this.state.placeHolderName[0]
                        : "Size"
                    }
                    value={this.state.sizeName}
                    onChange={this.searchSize}
                    displayValue="label"
                    hideSelectedOptions={false}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={3} xs={12} className="product-filter-buttons">
            <Button
              variant="contained"
              color="primary"
              className="btn-mui btn-blue btn-outlined"
              id="applyFilter"
              onClick={() =>
                this.setState({ offset: 0 }, () => this.searchbtn())
              }
            >
              <>
                {!!this.state.searchbutton.buttonText
                  ? this.state.searchbutton.buttonText
                  : "Search"}
              </>
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className="btn-mui btn-blue btn-outlined"
              id="clearFilter"
              onClick={() =>
                this.setState({ offset: 0 }, () => this.clearSearch())
              }
            >
              <>
                {!!this.state.clearButton.buttonText
                  ? this.state.clearButton.buttonText
                  : "clear"}
              </>
            </Button>
          </Grid>
          <Grid item xs={12} className="filter-desc">
            <Typography>{this.state.allergenDescription}</Typography>
          </Grid>
        </Grid>
        {this.state.showSearchBar ? (
          <Grid container justify="flex-end">
            <Grid item>
              <IconButton
                className="filter-btn"
                onClick={() => {
                  this.setState({ filterOpen: "open" });
                }}
              >
                <label>Filter:</label>
                <img src="images/filter.svg" alt="filter" />
              </IconButton>
            </Grid>
          </Grid>
        ) : (
            " "
          )}
        {this.state.spinner ? <Spinner /> : " "}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.reducer.Products,
    filterProducts: state.reducer.filterProducts,
    labelList: state.reducer.labelList || [],
  };
};
export default connect(mapStateToProps, {
  actiongetProduct,
  actiongetFilter,
  actionLabelList,
})(SearchDropdown);