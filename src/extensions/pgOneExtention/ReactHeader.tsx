import * as React from "react";
import { Link } from 'office-ui-fabric-react/lib/Link';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { useConstCallback } from '@uifabric/react-hooks';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { PageContext } from '@microsoft/sp-page-context';
import { SPPermission } from '@microsoft/sp-page-context';
require('jqueryui');
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { PnPHelper } from './ResourcesMasterListItems';
import { sp } from "@pnp/sp";
require('./style.css');
import { SPService } from './Service/SPService';
import Autocomplete from "../Autocomplete";
import { AadHttpClient, HttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http';
import { ga } from "react-ga";

export interface IReactHeaderProps {

  context: any;
}
export interface ISPLists {
  value: ISPList[];
}
export interface ISPList {
  Title: string;
}
interface IReactHeaderState {
  isPickerDisabled?: boolean;
  status: string;
  isOpen: boolean;
  CurrentUserName: any;
  LogoImgUrl: any;
  SignOutUrl: any;
  SiteUrl: any;
  siteTour: boolean;
  siteTourVideoUrl: any;
  ResourcesMasterItems?: any[];
  ConfigMasterItems?: any[];
  IsPageEditAdmin: boolean;
  countryCode: string;
  activeSuggestion: number;
  filteredSuggestions: any[];
  showSuggestions: boolean;
  userInput: string;
  SPbindSearchSuggestion: any[];
  listItems: any[];  
}

export default class ReactHeader extends React.Component<IReactHeaderProps, IReactHeaderState> {
  [x: string]: any;
  private pnpHelper: PnPHelper;
  private aadClient: AadHttpClient;
  private myref;
public makeeicon: any[];
  private myrefsug;
  private SPService: SPService = null;  
  constructor(props: IReactHeaderProps, { }) {
    super(props);
    this.SPService = new SPService(this.props.context);  
    this.myref = React.createRef();
    this.myrefsug = React.createRef();
    // this.bindSearchSuggestion = this.bindSearchSuggestion.bind(this);

    //console.log("Initialise Properties -  React Header4");
    //console.log(this.props.ResourceListItems);
    this.state = {
      ResourcesMasterItems: [],
      ConfigMasterItems: [],
      isPickerDisabled: false,
      status: "ready",
      isOpen: false,
      CurrentUserName: this.props.context.pageContext.user.displayName,
      LogoImgUrl: this.props.context._pageContext.web.logoUrl,
      SignOutUrl: this.props.context._pageContext._legacyPageContext.MenuData.SignOutUrl,
      SiteUrl: this.props.context.pageContext.web.absoluteUrl,
      siteTour: false,
      siteTourVideoUrl: "",
      IsPageEditAdmin: false,
      countryCode: "",
      activeSuggestion: -1,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: "",
      SPbindSearchSuggestion: [],
      listItems: []

    };

    this.pnpHelper = new PnPHelper(this.props.context);


    {
      //console.log(this.state.abc);
      // console.log(this.props.context.pageContext.user);
      // console.log(this.props.context);
      // console.log(this.props.context.pageContext.web.absoluteUrl);
      // //this.props.context.pageContext.web.
      // console.log(this.props.context._pageContext._legacyPageContext.MenuData.SignOutUrl);
      //console.log( this.props.context.pageContext.web.permissions.hasPermission(SPPermission.manageWeb))
    }
  }

  //   public onInit(): Promise<void> {
  // alert("asdw");

  //     return Promise.resolve();

  //   }

  public async componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);

    await this.fetchvalue();

  }


  public handleClickOutside = (e) => {

    if (this.myref.current && !this.myref.current.contains(e.target)) {

      this.setState({
        activeSuggestion: -1,
        filteredSuggestions: [],
        showSuggestions: false
      });

    }

  }

  private fetchvalue = () => {

    this.props.context.aadHttpClientFactory.getClient('c1700521-1700-4098-b903-7c7e17322b20') // ‘c1700521-1700-4098-b903-7c7e17322b20'
      .then((client: AadHttpClient): void => {
        // console.log("Successful Factory Method Invocation");
        this.aadClient = client;
        //  alert(this.aadClient);
        // var abc =  this.getSuggestionsUsingAadHttpClient("organization","https://api.pgcloud.com/workforcecollab/entcollab/v1/suggseterservice/search","Market","","");
      }, error => {
        // console.log("Failed in Factory Method Invocation");
        console.log(error);
      });
  
     // this.getCarouselItems();
    }

    public async getCarouselItems() {  
      
        let val_list = await this.SPService.getListItems("ApplicationMaster");  
        let val_idatelistitem = val_list.map(e => ({  
          title: e.Title,  
          link: e.Link, 
          availableExternal: e.AvailableExternal 
        
        }));  
       
        this.setState({
          
          listItems: val_idatelistitem
        }, () => {
          // console.log("GetListITems: ", this.state.listItems);
         
    
        });
    }


  public componentWillMount() {

    this.setState({
      IsPageEditAdmin: this.props.context.pageContext.web.permissions.hasPermission(SPPermission.manageWeb)
    });

    try {
      Promise.all([
        this.pnpHelper.getResourceListItems(),
        this.pnpHelper.getConfigMasterListItems(),
        this.pnpHelper.userProfileDetails()
        //this.pnpHelper.getSPUserGroup('PGOneAdmin')

      ]).then(([resourceListItems, configMasterItems, userProfile]) => {

        //console.log(userProfile)
        //console.log("User Context",this.props.context.pageContext.user)
        //console.log("External User",this.props.context.pageContext.user._isExternalGuestUser)

        this.setState({ countryCode: userProfile['Country'] == undefined ? "*" : userProfile['Country'] });
        var hideSuiteBar = configMasterItems['SuiteBarClasses'] + "{display: none!important;}";
        $('<style id="hideSuiteBar">').text(hideSuiteBar).appendTo(document.head);
        $('<style id="CustomCSS">').text(configMasterItems['CustomCss'] == undefined ? "#" : configMasterItems['CustomCss']).appendTo(document.head);

        this.setState({
          ResourcesMasterItems: resourceListItems,
          ConfigMasterItems: configMasterItems,
          siteTourVideoUrl: configMasterItems['SiteTourVideoUrl']
        });

        // this.pnpHelper.getSPUserGroup(configMasterItems['AdminGroupName']).then((isAdmin: boolean) => {
        //   this.setState({
        //     IsPageEditAdmin: isAdmin
        //   });
        // })

        // let tNumber=userProfile['TNumber'];
        // if(tNumber==undefined || tNumber==null||tNumber==""){
        // }else
        // {
        //   sp.web.lists.getByTitle("UserMaster").items.filter(`Title eq '${tNumber}'`).select("Id").get().then(r => {      
        //    if( r.length=1){
        //     this.setState({ siteTour: true })
        //    }
        // });
        // } 
        setTimeout(
          function () {
            if (localStorage.getItem('isFirstTimeUser')) {
              if (localStorage.getItem('isFirstTimeUser') == '1') {
                this.setState({
                  siteTour: true
                });
                localStorage.removeItem('isFirstTimeUser');
              }
            }
          }
            .bind(this),
          2000
        );




      });
    }
    catch (e) {
      console.log(e);
    }
  }



  private setIsOpen(val: boolean) {

    this.setState({ isOpen: val });
  }
  private dismissPanel() {
    this.setIsOpen(false);
  }
  private hideVideoSiteTour() {
    this.setState({ siteTour: false });
  }
  private showSiteSetting() {
    //this.setState({ siteTour: true })
    $('#O365_MainLink_Settings').click();


  }


  private showHelpIcon(){

    $('#O365_MainLink_Help').click(); 
  }

 public acronym_name(str) {
    var regular_ex = /\b(\w)/g;
    var matches = str.match(regular_ex);
    var acronym = matches.join('');
    var splitString = acronym.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    return joinArray;
  }
  private showsignout() {

    this.setIsOpen(true);
  }

  // public bindSearchSuggestion(suggetionReasultForBind) {
  //   debugger;
  //   //console.log("bindSearchSuggestion",$('input#searchSuggestion').val(),suggetionReasultForBind)

  //    var seuggetionForBind=suggetionReasultForBind;
  //    try {

  //           $("#searchSuggestion").autocomplete({
  //           minLength: 2,
  //           source: function (request, response) {
  //               response(seuggetionForBind);
  //           },
  //         //search: "",
  //           select: function (event, ui) {
  //               if(ui.item.type=="keyword"){
  //                 ///  sendSuggestionGAEvent(ui.item.title,$('input#searchSuggestion').val().trim())
  //                 alert($('input#searchSuggestion').val().trim());
  //               }
  //               this.value = "";
  //               this.openSearchUrl(ui.item.url)
  //               return false;
  //           },

  //           focus: function (event, ui) {
  //               //console.log("on focus",ui.item)
  //               return false;
  //               // this.value = ui.item.label;
  //               // or $('#autocomplete-input').val(ui.item.label);

  //               // Prevent the default focus behavior.
  //             //  event.preventDefault();
  //               //return false;
  //               // or return false;
  //           },

  //       }).focus(function () {
  //           $(this).autocomplete("search", "");
  //        }).data("instance")._renderItem = function (ul, item) {
  //               var urlToShow = item.url;
  //               if (item.type == 'searchResult') {
  //                   if (urlToShow.length != 0 && urlToShow.length > 30) {

  //                       urlToShow = " - <div class='urlToShow'>" + urlToShow.substr(0, 30) + "</div>";
  //                   } else {
  //                       urlToShow = " - <div class='urlToShow'>" + urlToShow + "</div>";
  //                   }
  //               }
  //               else {
  //                   urlToShow = "";
  //               }

  //               return $("<li class='suggestionLi'>")
  //                   .append("<div class='ms-SPLegacyFabricBlock suggetionDiv'  url=" + encodeURI(item.url) + " ><i class='ms-Icon ms-Icon--" + item.icon + "' aria-hidden='true'></i>" + item.title + "<div class='anchorDiv'>" + urlToShow + "</div></div>")
  //                   .appendTo(ul);
  //           };
  //           if(seuggetionForBind.length>0){
  //               $(".ui-autocomplete").show();
  //           }else{
  //               $(".ui-autocomplete").hide();
  //           }
  //           //$("#searchSuggestion").autocomplete('option','source',suggetionReasult)
  //           $('#searchSuggestion').autocomplete("search");

  //       } catch (error) {
  //       console.log(error);
  //       }
  //   }
  public openSearchUrl(url) {

    //resetSearchBox();
    window.open(url, '_blank');
    this.resetSearchBox();

  }

  public countryWithCode = [
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

  public getCountryCode(conuntryName) {
    // debugger;
    var found_names = $.grep(this.countryWithCode,  (v) =>{
      return v.OFC === conuntryName;
    });
    return found_names;
  }



  public resetSearchBox() {
    //$("button[aria-label='Clear the search box']").click();
    // var commandsButton = $(".ms-suiteux-search-box button");
    // commandsButton[1].click();
    $("#searchSuggestion").val("");
    $("#searchSuggestion").attr("placeholder", "find.pg.com");
    setTimeout( ()=> {
      $("#searchSuggestion").attr("placeholder", "find.pg.com");
    }, 2000);

  }

  //React search suggestion - start

 public onChange = e => {

    var makecal = this;
    const filteredSuggestions = [];
    const userInput = e.currentTarget.value;
    makecal.setState({
      filteredSuggestions,
      userInput: userInput
    }, () => {
      // console.log("Onchange userInput: ", makecal.state.userInput)
      makecal.retrieveSearchSuggestion(makecal.state.userInput, "");
    });
  }

  public retrieveSearchSuggestion = (suggestionText, serviceSubscriptionValue) => {
    var suggetionReasultArray = [];
    let self = this;
    try {
      const requestHeaders: Headers = new Headers();
      requestHeaders.append('Accept', 'application/json');
      //https://api.pgcloud.com/workforcecollab/entcollab/v1/suggseterservice/search
      let requestUrl: any = "";
      if (serviceSubscriptionValue != null && serviceSubscriptionValue.trim().length > 0) {
        requestUrl = "";//Text.format('{0}?{1}={2}&subscription-key={3}',serviceURL, serviceQueryParam, suggestionText,serviceSubscriptionValue).toString();
      }
      else {

        //	requestUrl  = Text.format('{0}?{1}={2}',serviceURL, serviceQueryParam, suggestionText).toString();
        requestUrl = "https://api.pgcloud.com/workforcecollab/entcollab/v1/suggseterservice/search?searchText=" + suggestionText;
      }
      const requestOptions: IHttpClientOptions = {
        headers: requestHeaders
      };

      this.aadClient.get(requestUrl, AadHttpClient.configurations.v1, requestOptions)
        .then((response: HttpClientResponse) => {

          // console.log("response1: " + response)
          return response.json();
        })
        .then(async (jsonResponse: any) => {
          // debugger;
          //const data = JSON.parse(jsonResponse);
          //callback(null, jsonResponse);
          // console.log("resutl: " + jsonResponse)
          //Additional code------------------------------------------
          var keyWordResult = jsonResponse[0];
          var searchResult = jsonResponse[1];

          for (let i = 0; i < searchResult.length; i++) {
            let val_list =  await self.SPService.getListItems1("ApplicationMaster" ,searchResult[i].title);
            let val_idatelistitem = val_list.map(e => ({  
              title: e.Title,  
              availableExternal: e.AvailableExternal 
            
            }));
            if(val_idatelistitem.length > 0) {
            if(val_idatelistitem[0].availableExternal === 0 ){
            var suggetionData = {
              title: searchResult[i].title,
              value: searchResult[i].title,
              url: searchResult[i].url,
              type: 'searchResult',
              icon: "World",
              vpn: "yes"
            };
            suggetionReasultArray.push(suggetionData);
          }
          else if(val_idatelistitem[0].availableExternal === 1 ){
               suggetionData = {
                title: searchResult[i].title,
                value: searchResult[i].title,
                url: searchResult[i].url,
                type: 'searchResult',
                icon: "World",
                vpn: "no"
              };
              suggetionReasultArray.push(suggetionData);
          }
        }

          }
          var searchUrl = "https://pgone.sharepoint.com/Search/Pages/results.aspx?k=";
          var countryCode = "*";
          for (let i = 0; i < keyWordResult.length; i++) {
            suggetionData = {
              title: keyWordResult[i].searchKeyword,
              value: keyWordResult[i].searchKeyword,
              url: searchUrl + keyWordResult[i].searchKeyword + "&code=" + countryCode,
              type: 'keyword',
              icon: "Search",
              vpn: "na"
            };
            suggetionReasultArray.push(suggetionData);

          }
// console.log("whytobe: "+suggetionReasultArray[0].title);
self.makesuggestion(suggestionText, suggetionReasultArray);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (ex) {
      // console.log('Error in Search Suggetion');
     // alert(ex);

    }

  }
  public makesuggestion = (text, suggetionReasultArray) => {

    if (suggetionReasultArray.length > 0) {
      var mappedURL = [];
     
      suggetionReasultArray.map( (item) => {
        if (item.icon == "World" && item.vpn == "yes") {
          let pushval = "*"+ item.title + "-" + item.url;
          mappedURL.push(pushval);
        }
        else if (item.icon == "World" && item.vpn == "no"){
          let pushval = item.title + "-" + item.url;
          mappedURL.push(pushval);
        }
        else {
          mappedURL.push(item.title);
        }

      });
      // console.log("mappurl: "+this.makeeicon);

      const filteredSuggestions = mappedURL;
      this.setState({
        filteredSuggestions,
        showSuggestions: true
      });
    }


  }

  public onClick = e => {
    let keyword = e.currentTarget.innerText;
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    }, () => {

      let Suggestion = this.state.userInput.indexOf("http") != -1 ? this.state.userInput.substring(this.state.userInput.indexOf("http")) : this.state.userInput;

      if (this.state.userInput.indexOf("http") != -1) {
      //  alert("This application requires VPN. Please connect to P&G using VPN Pulse Secure and try again");
        window.open(Suggestion, '_blank');
        this.sendSuggestionGAEvent(keyword, this.state.userInput);
      }
      else {
        this.sendSuggestionGAEvent(keyword, this.state.userInput);
        window.open("https://pgone.sharepoint.com/Search/Pages/results.aspx?k=" + Suggestion, '_blank');
      }

      this.clearsearchbox();
    });
  }

  public clearsearchbox() {

    this.setState({
      activeSuggestion: -1,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: ""
    });
  }

  public onKeyDown = e => {


    const { activeSuggestion, filteredSuggestions } = this.state;

    //console.log("mwe " + e.target.value)
    let keyword = e.target.value;
    if (e.keyCode === 13) {
      this.setState({
        // activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion]
      }, () => {

        if (activeSuggestion == -1) {
          this.sendManualSearchGAEvent(keyword);
          window.open("https://pgone.sharepoint.com/Search/Pages/results.aspx?k=" + keyword, '_blank');

        }
        else {
          let Suggetion = this.state.userInput.indexOf("http") != -1 ? this.state.userInput.substring(this.state.userInput.indexOf("http")) : this.state.userInput;
          //onkeypress suggestion search
          if (this.state.userInput.indexOf("http") != -1) {

            this.sendSuggestionGAEvent(keyword, this.state.userInput);
  //alert("This application requires VPN. Please connect to P&G using VPN Pulse Secure and try again");
            window.open(Suggetion, '_blank');

          }
          //onkey press Manual Search 
          else {

            this.sendSuggestionGAEvent(keyword, this.state.userInput);

            window.open("https://pgone.sharepoint.com/Search/Pages/results.aspx?k=" + Suggetion, '_blank');
          }

        }

        this.clearsearchbox();
      });

    }
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  }


  public sendManualSearchGAEvent = (searchKeyword) => {

    ga('send', {
      'hitType': 'event', // Required.
      'eventCategory': 'Search Bar', // Required.
      'eventAction': 'Manual Search', // Required.
      'eventLabel': searchKeyword,
      'eventValue': 1,
      'dimension7': window.location.href, // Source
      'dimension9': searchKeyword, // Search Term
    });
  }
  // react search suggestion ends

  public sendSuggestionGAEvent = (searchKeyword, Suggetion) => {
    ga('send', {
      'hitType': 'event', // Required.
      'eventCategory': 'Search Bar', // Required.
      'eventAction': 'Suggestion', // Required.
      'eventLabel': Suggetion,
      'eventValue': 1,
      'dimension7': window.location.href, // Source
      'dimension9': searchKeyword, // Search Term
      'dimension12': Suggetion, // Suggestion Text
    });


  }
  public render(): JSX.Element {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput
        
      }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;
              let iconname;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

           //  iconname= this.makeicon(suggestion);
         

              return (
                <li className={className} key={suggestion} onClick={onClick}>

                  {suggestion.includes("http") && suggestion.includes("*") ? <div ><span  style={{ color: 'red' }} className="ms-Icon ms-Icon--Shield"></span><span id="suggestiontext">{ suggestion.substring(0, suggestion.indexOf("http")).replace("*", "")}
                  </span><span style={{ color: 'blue' }}>{suggestion.substring(suggestion.indexOf("http"))}</span>
                  </div> : suggestion.includes("http") && !suggestion.includes("*") ?  <div ><span className="ms-Icon ms-Icon--World"></span><span id="suggestiontext">{suggestion.substring(0, suggestion.indexOf("http"))}
                  </span><span style={{ color: 'blue' }}>{suggestion.substring(suggestion.indexOf("http"))}</span>
                  </div> :  <div><span className="ms-Icon ms-Icon--Search"></span><span id="suggestiontext">{suggestion}</span></div> }
                  {/* {suggestion} */}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>Suggestions Not Found</em>
          </div>
        );
      }
    }
    return (
      // <Autocomplete
      //   suggestions={[
      //     "Alligator",
      //     "Bask",
      //     "Crocodilian",
      //     "Death Roll",
      //     "Eggs",
      //     "Jaws",
      //     "Reptile",
      //     "Solitary",
      //     "Tail",
      //     "Wetlands"
      //   ]}
      // />
      <div>

        <div className="ms-bgColor-themeDark">
          <div className="ms-Grid headerRow" >
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm3 ms-md4 ms-lg4 block header-logo-Sec">
                <a className="header-logo" id="logoURL" href={this.state.SiteUrl}>
                 <label className="insidelogo">SharePoint</label>
                </a>
              </div>
              <div className="ms-Grid-col ms-sm8 ms-md6 ms-lg4 block search-sec">
                <div ref={this.myref} className="search pgSearchBox">

                  <input  {...{ "countryName": this.state.countryCode == undefined ? "*" : this.state.countryCode }}
                    {...{ "SearchSuggester": this.state.ConfigMasterItems["SearchSuggester"] }}
                    {...{ "SearchSuggesterError": this.state.ConfigMasterItems["SearchSuggesterError"] }}

                    type="text" id="searchSuggestion" placeholder="find.pg.com"
                    // {...{ "searchUrl": this.state.ConfigMasterItems['SearchResultUrl'] == undefined ? "https://pgone.sharepoint.com/Search/Pages/results.aspx?k="+this.state.userInput : this.state.ConfigMasterItems['SearchResultUrl'] }}
                    style={{ height: 33, borderColor: 'gray', borderWidth: 1, color: 'black !important', margin: "8px 0px 0px" }}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={userInput}>

                  </input>

                  {/* <button className="submitSearchButton-216" title="Search" aria-label="Search" data-tab="true"><span className="ms-searchux-2u_03 " aria-hidden="true">
                  </span></button> */}
                  <div id="searchSuggestion"  >{suggestionsListComponent}</div>
                </div>
                {/* <span>
                    <i id="filtersubmit" className="ms-Icon ms-Icon--Search">
                  </i>
                  </span> */}
                {/* <div className="suggestions">{suggestionsListComponent}</div> */}

              </div>

              <div className="ms-Grid-col ms-sm1 ms-md2 ms-lg4 block">
                <div className="rightMenu ms-u-hiddenMdDown">
                  <div className="currentUser">

                    {/* {this.state.IsPageEditAdmin && (
                      <a href="#" id="pgEditCommandBar" className="pgEditCommandBar" title="Edit" onClick={()=>this.showPageCammandBar()} >
                        <i className="ms-Icon ms-Icon--PageEdit" aria-hidden="true">
                        </i>
                      </a>
                    )} */}

                
                   
                     
                      <label id="gearsettings" className="ms-Icon ms-Icon--Settings" onClick={() => this.showSiteSetting()}></label>
               
{/* ms-Icon--Help */}
             <label id="helpsettings" className="ms-Icon ms-Icon--Help" onClick={() => this.showHelpIcon()}></label>
            <div id="currentUserName" className="currentUserName" onClick={() => this.showsignout()}>
          
                      <div id="container_acronym">
                        <div id="name_acronym">
                          {this.acronym_name(this.state.CurrentUserName)}
                        </div>
                      </div>
                    </div>
                   
                    {/* <a href={this.state.SignOutUrl} id="signOutURL" className="signOut signOutURL" title="Log Out">
                      <i className="ms-Icon ms-Icon--SignOut" aria-hidden="true">
                      </i>
                      <span id="icon"></span>
                    </a> */}
                  </div>


                </div>

                <div className="rightMenuRes ms-u-hiddenLgUp">

                  {/* <a className="collapseMenu" onClick={() => this.openPanel()} href="#">
                    <i className="ms-Icon ms-Icon--CollapseMenu" aria-hidden="true" ></i>
                  </a> */}
                  {/* <a href="#" id="" className="signOut signOutURL" title="Log Out" >
                  <i className="ms-Icon ms-Icon--SignOut" aria-hidden="true">
                  </i>
                </a>  */}
                  <Panel className="CollapsePanel"
                    isLightDismiss
                    headerText={this.state.CurrentUserName}
                    isOpen={this.state.isOpen}
                    onDismiss={() => this.dismissPanel()}
                    // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
                    closeButtonAriaLabel="Close"
                  >

                    {/* {this.state.IsPageEditAdmin && (
                    <p >
                      <a className="" href="javascript:$('.CollapsePanel .ms-PanelAction-close').click();$('#O365_MainLink_Settings').click()" >Settings</a>
                    </p>
                     )} */}
                    <span onClick={() => this.showsignout()}>

                      <div id="insidecontainer_acronym">
                        <div id="insidename_acronym">
                          {this.acronym_name(this.state.CurrentUserName)}
                        </div>
                      </div>
                    </span>
                    <p >
                      <a className="" href="https://myaccount.microsoft.com/?ref=MeControl" target="blank">View account</a>
                      <br />
                      <a className="" href="https://pgone-my.sharepoint.com/person.aspx" target="blank" >My Office profile</a>

                    </p>

                    <p>
                      <a className="" href={this.state.SignOutUrl} >Sign out</a>
                    </p>
                  </Panel>
                </div>
              </div>
            </div>
          </div>


        </div>
        {this.state.siteTour && (
          <Overlay className="SiteTourOverlay" isDarkThemed={true} onClick={() => this.hideVideoSiteTour()}>

            <i className="ms-Icon ms-Icon--ChromeClose iFrameCloseButton" aria-hidden="true" title="Close"></i>
            <iframe id="siteTourVideo"
              src={this.state.siteTourVideoUrl} allow="autoplay; fullscreen">
            </iframe>

          </Overlay>
        )}
      </div>

    );
  }


}