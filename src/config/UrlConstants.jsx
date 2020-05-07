/**
 *
 * @desc URL Constant class with all APIs urls declaration
 */

class UrlConstants {
  constructor() {
    //Application Site URL
    this.SiteUrl = process.env.REACT_APP_SITE_URL + "/#";

    /* API Host URL */
    this.pimHostUrl = process.env.REACT_APP_OFFICE_SNACKS_PIMCORE;
    this.PimAPIKey = process.env.REACT_APP_OFFICE_SNACKS_PIMAPIKEY;


    //PimCore API Endpoints
    this.ProductsUrl = this.pimHostUrl + "productlist";
    this.ProductDetailUrl = this.pimHostUrl + "productdetail";
    this.SubmitOrder = this.pimHostUrl + "submitorder";
    this.FilterProducts = this.pimHostUrl + "filterlist";
    this.ZipValidation = this.pimHostUrl + "zipcodevalidate";
    this.LabelsList = this.pimHostUrl + "labelslist";
    this.CreateCustomer = this.pimHostUrl + "createcustomer";
    this.MinAmount=this.pimHostUrl+ "configlist"
    this.ProductInventory=this.pimHostUrl+ "productinventory"
    this.PaymentStatus = this.pimHostUrl + "paymentstatus";
    this.orderTax = this.pimHostUrl + "ordertax";
    // Qty available msg
    this.qtyAvailableMsg = "The maximum quantity you can order of this item is ##QTY##";
    this.errorMsg = "Something went to wrong on server, please try again";
    this.productsLimit = 12;

  }
}

export default new UrlConstants();