/**
 * @desc Class with functions with post, put, get, delete method api call
 */
import Axios from "axios";
import UrlConstants from './UrlConstants'


class APIUtil {

    /**
     * 
     * @desc function to call external api with url
     * @param {*} url - API URL
     */
    externalAPI(url) {
        return Axios({
            method: 'get',
            url: url
        })
        .then(response => response)
        .catch(error =>{
            if (error.response) {
                return error.response
            }            
            else {
                return {"status":"404"}
            }
        });
    }
    /**
     * 
     * @desc action to call get api with/without auth token
     * @param {*} url - API URL
     * @param {*} auth - true/false for auth token pass or not
     */
    getMethod(url, auth) {
      
        var headersSet = {
            "Accept": "application/json",
            "Content-Type": "application/json", 
            "x-api-key" :  UrlConstants.PimAPIKey, 
        };

        if(auth) {
            var accessToken = sessionStorage.getItem("token");
            headersSet['Authorization'] = accessToken;
        }
        
        return Axios({
            method: 'get',
            url: url,
            headers: headersSet
        }).then(response => response).catch(error =>{ 
            if (error.response) {
                if(error.response.data === "Invalid token.") {
                    this.inValidToken();      
                } 
                else {
                    return error.response
                }
            } else {
                return {"status":"404"}
            }
        });

    }
    /**
     * 
     * @desc action to remove token from sessionStorage
     */
    inValidToken() {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("usertype");
        window.location.href = UrlConstants.SiteUrl + 'login';
        window.location.reload()
    }
    /**
     * 
     * @desc action to call post api with/without auth token and post data
     * @param {*} url - API URL
     * @param {*} data - Post data object
     * @param {*} auth - true/false for auth token pass or not 
     */
    postMethod(url, data, auth) {
        var headersSet = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "x-api-key" :  UrlConstants.PimAPIKey, 
        };
        if(auth) {
            var accessToken = sessionStorage.getItem("token");
            headersSet = {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-api-key" :  UrlConstants.PimAPIKey, 
                "Authorization" : accessToken,
            };
            
        }
       
        return Axios({
            method: 'post',
            url: url,
            headers: headersSet,
            data : data
        }).then(response => response)
        .catch(error =>{ 
            if (error.response) {
                if(error.response.data === "Invalid token.") {
                    this.inValidToken();                    
                } 
                else {
                    return error.response
                }
            } else {
                return {"status":"404"}
            }
        })

    }
     /**
     * 
     * @desc action to call put api with/without auth token and post data
     * @param {*} url - API URL
     * @param {*} data - Post data object
     * @param {*} auth - true/false for auth token pass or not 
     */
    putMethod(url, data, auth) {
        var headersSet = {
            "Accept": "application/json",
            "Content-Type": "application/json",   
            "x-api-key" :  UrlConstants.PimAPIKey,         
        };
        if(auth) {
            var accessToken = sessionStorage.getItem("accessToken");
            headersSet = {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-auth-token" : accessToken,
            };
        }

        return Axios({
            method: 'PUT',
            url: url,
            headers: headersSet,
            data : data
        }).then(response => response)
        .catch(error =>{ 
            if (error.response) {
                if(error.response.data === "Invalid token.") {
                    this.inValidToken();                    
                } 
                else {
                    return error.response
                }
            } else {
                return {"status":"404"}
            }
        })

    }
     /**
     * 
     * @desc action to call delete api with/without auth token and post data
     * @param {*} url - API URL
     * @param {*} auth - true/false for auth token pass or not 
     */
    deleteMethod(url,auth,data) {
        var headersSet = {
            "Accept": "application/json",
            "Content-Type": "application/json",           
        };
        if(auth) {
            var accessToken = sessionStorage.getItem("accessToken");
            headersSet = {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-auth-token" : accessToken,
            };
        }

        return Axios({
            method: 'DELETE',
            url: url,
            data: data ? data : null,
            headers: headersSet
        }).then(response => response)
        .catch(error =>{ 
            if (error.response) {
                if(error.response.data === "Invalid token.") {
                    this.inValidToken();                    
                } 
                else {
                    return error.response
                }
            } else {
                return {"status":"404"}
            }
        })
    }

     /**
     * 
     * @desc action to call post api with/without auth token and post data with form data
     * @param {*} url - API URL
     * @param {*} data - Form data object
     * @param {*} auth - true/false for auth token pass or not 
     */
    postFormDataMethod(url, data, auth) {
        var headersSet = {
            "Accept": "application/json",
            'Content-Type': 'multipart/form-data',
        };
        if(auth) {
            var accessToken = sessionStorage.getItem("accessToken");
            headersSet = {
                "Accept": "application/json",
                'Content-Type': 'multipart/form-data',
                "x-auth-token" : accessToken,
            };
        }

        return Axios({
            method: 'post',
            url: url,
            headers: headersSet,
            data : data
        }).then(response => response)
        .catch(error =>{ 
            if (error.response) {
                if(error.response.data === "Invalid token.") {
                    this.inValidToken();                    
                } 
                else {
                    return error.response
                }
            } else {
                return {"status":"404"}
            }
        })
    }

}
export default (new APIUtil());