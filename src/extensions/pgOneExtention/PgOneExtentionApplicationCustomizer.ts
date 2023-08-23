import * as jquery from 'jquery';
import 'jqueryui';
import * as ReactDOM from "react-dom";
import * as React from "react";
import { override } from '@microsoft/decorators';
import { Log, UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { Dialog } from '@microsoft/sp-dialog';
import * as strings from 'PgOneExtentionApplicationCustomizerStrings';
import { SPPermission } from '@microsoft/sp-page-context';
const LOG_SOURCE: string = 'PgOneExtentionApplicationCustomizer';
import ReactFooter, { IReactFooterProps } from "./ReactFooter";
import ReactHeader,{IReactHeaderProps} from "./ReactHeader";
import IEWarning, { IEWarningProps } from "./IEWarnings";
import { PnPHelper } from './ResourcesMasterListItems';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { SPComponentLoader } from '@microsoft/sp-loader';

import { ga, initialize, pageview } from 'react-ga';
require('./style.css');
require('HeaderCustomizer');
import "office-ui-fabric-core/dist/css/fabric.css";
import { SPHttpClient } from '@pnp/sp/sphttpclient';

export interface IPgOneExtentionApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
  TopContent: string;
  Top: string;
  Bottom: string;
  
}


/** A Custom Action which can be run during execution of a Client Side Application */
export default class PgOneExtentionApplicationCustomizer
  extends BaseApplicationCustomizer<IPgOneExtentionApplicationCustomizerProperties> {
  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;
  private pnpHelper: PnPHelper;
  private queryParms = new UrlQueryParameterCollection(window.location.href);
  private isCurrentUserApprover: boolean;
  private jqueryui: any;

  @override



  public async onInit(): Promise<void> {



    jquery("init");
    //jquery().autocomplete();


    this.pnpHelper = new PnPHelper(this.context);
    //If Cuurent User is Not Admin User or Approver then he will be redirected to home page always
    try {
      if (!this.context.pageContext.web.permissions.hasPermission(SPPermission.manageWeb)) {

        Promise.all([
          this.pnpHelper.checkCurrentUserApprovalPermission()
        ]).then(([isCurrentUserApprover]) => {
          this.isCurrentUserApprover = isCurrentUserApprover;
          //console.log("isCurrentUserApprover",isCurrentUserApprover)
          //if current user is Approver
          if (this.isCurrentUserApprover) {

            if (this.context.pageContext.list) {
              if (this.context.pageContext.list.title != "Site Pages") //if user is not in Site Pages
              {
                window.open(this.context.pageContext.web.absoluteUrl, "_self");
              }
            }
            else {
              //If user is accessing other than the list and libraries pages
              window.open(this.context.pageContext.web.absoluteUrl, "_self");
            }

          } else {
            //End User
            if (this.queryParms.getValue("VIEW") != undefined) {
              if (this.queryParms.getValue("VIEW").toLocaleLowerCase() == "reviewrequests" || this.queryParms.getValue("VIEW").toLocaleLowerCase() == "review%20requests") {
                window.open(this.context.pageContext.web.absoluteUrl, "_self");
              }
            }
            //console.log(window.location.href.toLocaleLowerCase().split("?")[0].indexOf("welcome.aspx"));
            if (window.location.href.toLocaleLowerCase().split("?")[0].indexOf("welcome.aspx") > -1) {
              //console.log("this is welcome.aspx");
            }
            else if (this.context.pageContext.web.absoluteUrl.toLocaleLowerCase() != window.location.href.toLocaleLowerCase().split("?")[0]) {
              window.open(this.context.pageContext.web.absoluteUrl, "_self");
            }
          }



        });
      }

    } catch (error) {

    }


    try {
      var urlParams = new URLSearchParams((window.location.search).toLowerCase());
      if (urlParams.has('mode')) {
        // console.log(urlParams.get('mode').toLowerCase())
        if (urlParams.get('mode').toLowerCase() != "edit") {
          $('.commandBarWrapper').hide();
        }
      }
      else {
        $('.commandBarWrapper').hide();
      }
    } catch (ex) {
    }

    //Google Analytics
    //console.log("Google Analytics");
    try {
      Promise.all([
        this.pnpHelper.getConfigMasterListItems(), this.pnpHelper.userProfileDetails()

      ]).then(([configMasterItems, userProfile]) => {
        if (configMasterItems['GoogleAnalyticsTrackingId'] != undefined) {
          let trackingID: string = configMasterItems['GoogleAnalyticsTrackingId'];
          //console.log("trackingID",trackingID);
          initialize(trackingID);

          let user_email: string = this.context.pageContext.user.loginName;
          let user_id: string = "*";
          let userHostCountry: string = "*";
          try {
            //userProfile['TNumber'];
            var countryName = userProfile['Country'].toLocaleLowerCase().trim();

            var filterCountry = getCountryCode(countryName);
            if (filterCountry.length > 0) {
              userHostCountry = getCountryCode(countryName)[0]['CC'];
            }
          } catch (ex) { }


          //  ga('set', 'dimension1', userFunction);
          //  ga('set', 'dimension2', userOrgType);
          ga('set', 'dimension3', userProfile['OrganizationName']);//userOrgName
          ga('set', 'dimension4', userProfile['CostCenter']);//userCostCenter
          ga('set', 'dimension5', userHostCountry);
          ga('set', 'dimension6', userProfile['EmployeeType']);//userEEType
          //  ga('set', 'dimension7', newUser); //true or false // added in HeaderCustomizer js
          ga('send', {
            'hitType': 'pageview',
            'page': window.location.pathname + window.location.search, //active page
            //'title': 'PGOne Home - Dev',

          });


          //pageview(window.location.pathname + window.location.search,);

        } else {
          Log.info(LOG_SOURCE, "Tracking ID not provided");
        }
      });
    }
    catch (e) {
      console.log(e);
    }
    //console.log(this.context.pageContext.web.absoluteUrl+"/SiteAssets/JS/jquery-ui.min.js");


    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    return Promise.resolve();

  }

public maketrip(){

  alert("outsidefun");

}

  private _renderPlaceHolders(): void {

    // Handling the top placeholder
    //console.log("Render Start");

    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }
 
      if (this.properties) {
        let topString: string = this.properties.Top;
        if (!topString) {
          topString = "(Top property was not defined.)";
        }
        
        if (this._topPlaceholder.domElement){

          try {
            if (this.isIE()) {
              //alert('It is InternetExplorer');
              const elem: React.ReactElement<IEWarningProps> = React.createElement(IEWarning,
                {
                  context: this.context,
                  
                });
              
             ReactDOM.render(elem, this._topPlaceholder.domElement);
            } else {
              const elem: React.ReactElement<IReactHeaderProps> = React.createElement(ReactHeader,
                {
           
               context: this.context
                  
                });
              
             ReactDOM.render(elem, this._topPlaceholder.domElement);
            }
          } 
          catch (error) {
      
          }
          
        }

      }
    }

    // Handling the bottom placeholder
    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._bottomPlaceholder) {
        console.error("The expected placeholder (Bottom) was not found.");
        return;
      }

      if (this.properties) {
        let bottomString: string = this.properties.Bottom;
        if (!bottomString) {
          bottomString = "(Bottom property was not defined.)";
        }

        if (this._bottomPlaceholder.domElement) {
          const elem: React.ReactElement<IReactFooterProps> = React.createElement(ReactFooter,
            {
              ResourceListItems: "",
              context: this.context,
              spHttpClient: this.context.spHttpClient,
            });
          ReactDOM.render(elem, this._bottomPlaceholder.domElement);

        }

      }
    }
    //console.log("Render end");
  }


  private _onDispose(): void {
    console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }

  public isIE() {
    let ua = navigator.userAgent;
    /* MSIE used to detect old browsers and Trident used to newer ones*/
    var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;

    return is_ie;
  }
 


}


var countryWithCode = [
  {
    OFC: "algeria",
    CC: "DZ"
  }, {
    OFC: "argentina",
    CC: "AR"
  }, {
    OFC: "australia",
    CC: "AU"
  }, {
    OFC: "austria",
    CC: "AT"
  }, {
    OFC: "azerbaijan",
    CC: "AZ"
  }, {
    OFC: "bangladesh",
    CC: "BD"
  }, {
    OFC: "belgium",
    CC: "BE"
  }, {
    OFC: "brazil",
    CC: "BR"
  }, {
    OFC: "bulgaria",
    CC: "BG"
  }, {
    OFC: "canada",
    CC: "CA"
  }, {
    OFC: "chile",
    CC: "CL"
  }, {
    OFC: "china",
    CC: "CN"
  }, {
    OFC: "colombia",
    CC: "CO"
  }, {
    OFC: "costa rica",
    CC: "CR"
  }, {
    OFC: "croatia",
    CC: "HR"
  }, {
    OFC: "czech republic",
    CC: "CZ"
  }, {
    OFC: "denmark",
    CC: "DK"
  }, {
    OFC: "dominican rep.",
    CC: "DO"
  }, {
    OFC: "egypt",
    CC: "EG"
  }, {
    OFC: "finland",
    CC: "FI"
  }, {
    OFC: "france",
    CC: "FR"
  }, {
    OFC: "germany",
    CC: "DE"
  }, {
    OFC: "greece",
    CC: "GR"
  }, {
    OFC: "guatemala",
    CC: "GT"
  }, {
    OFC: "hong kong",
    CC: "HK"
  }, {
    OFC: "hungary",
    CC: "HU"
  }, {
    OFC: "india",
    CC: "IN"
  }, {
    OFC: "indonesia",
    CC: "ID"
  }, {
    OFC: "ireland",
    CC: "IE"
  }, {
    OFC: "israel",
    CC: "IL"
  }, {
    OFC: "italy",
    CC: "IT"
  }, {
    OFC: "japan",
    CC: "JP"
  }, {
    OFC: "kazakhstan",
    CC: "KZ"
  }, {
    OFC: "kenya",
    CC: "KE"
  }, {
    OFC: "latvia",
    CC: "LV"
  }, {
    OFC: "luxembourg",
    CC: "LU"
  }, {
    OFC: "malaysia",
    CC: "MY"
  }, {
    OFC: "mexico",
    CC: "MX"
  }, {
    OFC: "morocco",
    CC: "MA"
  }, {
    OFC: "netherlands",
    CC: "NL"
  }, {
    OFC: "new zealand",
    CC: "NZ"
  }, {
    OFC: "nigeria",
    CC: "NG"
  }, {
    OFC: "norway",
    CC: "NO"
  }, {
    OFC: "pakistan",
    CC: "PK"
  }, {
    OFC: "panama",
    CC: "PA"
  }, {
    OFC: "peru",
    CC: "PE"
  }, {
    OFC: "philippines",
    CC: "PH"
  }, {
    OFC: "poland",
    CC: "PL"
  }, {
    OFC: "portugal",
    CC: "PT"
  }, {
    OFC: "puerto rico",
    CC: "PR"
  }, {
    OFC: "romania",
    CC: "RO"
  }, {
    OFC: "russia",
    CC: "RU"
  }, {
    OFC: "russian fed.",
    CC: "RU"
  }, {
    OFC: "saudi arabia",
    CC: "SA"
  }, {
    OFC: "serbia",
    CC: "RS"
  }, {
    OFC: "singapore",
    CC: "SG"
  }, {
    OFC: "slovakia",
    CC: "SK"
  }, {
    OFC: "south africa",
    CC: "ZA"
  }, {
    OFC: "south korea",
    CC: "KR"
  }, {
    OFC: "spain",
    CC: "ES"
  }, {
    OFC: "sri lanka",
    CC: "LK"
  }, {
    OFC: "sweden",
    CC: "SE"
  }, {
    OFC: "switzerland",
    CC: "CH"
  }, {
    OFC: "taiwan",
    CC: "TW"
  }, {
    OFC: "thailand",
    CC: "TH"
  }, {
    OFC: "turkey",
    CC: "TR"
  }, {
    OFC: "uk",
    CC: "UK"
  }, {
    OFC: "ukraine",
    CC: "UA"
  }, {
    OFC: "united arab emir",
    CC: "AE"
  }, {
    OFC: "united kingdom",
    CC: "UK"
  }, {
    OFC: "usa",
    CC: "US"
  }, {
    OFC: "venezuela",
    CC: "VE"
  }, {
    OFC: "vietnam",
    CC: "VN"
  }
];
function getCountryCode(conuntryName) {
  var found_names = $.grep(countryWithCode, (v)=> {
    return v.OFC === conuntryName;
  });
  return found_names;
}