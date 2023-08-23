import * as React from "react";
import { PnPHelper } from './ResourcesMasterListItems';
// import * as jQuery from 'jquery';
// import 'jqueryui';
import { SPHttpClient, SPHttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http';

export interface IReactFooterProps {
    ResourceListItems:any;
    context:any;
    spHttpClient:SPHttpClient; 
  }
  interface IReactFooterState {
    ResourcesMasterItems?: any[];
    LogoImgUrl: any;
    ConfigMasterItems?: any[];
    countryCode:string;
  }  
  export default class ReactFooter extends React.Component<IReactFooterProps,IReactFooterState> {  
   private pnpHelper: PnPHelper;
   
    constructor(props: IReactFooterProps,{}) {  
       
      super(props);  
     // console.log("Initialise Properties -  React Footer");
      this.state= {
        LogoImgUrl: this.props.context._pageContext.web.logoUrl,
        ResourcesMasterItems: [],
        ConfigMasterItems:[],
        countryCode:"",
      };
     this.pnpHelper = new PnPHelper(this.props.context);
     
    }  
    public componentWillMount() {
      
      try {
          Promise.all([
            this.pnpHelper.getResourceListItems(), this.pnpHelper.getConfigMasterListItems(),this.pnpHelper.userProfileDetails()
    
          ]).then(([resourceListItems,configMasterItems,userProfile]) => {
            //console.log(resourceListItems);
    
            this.setState({
              ResourcesMasterItems: resourceListItems,
              ConfigMasterItems:configMasterItems,
              countryCode:userProfile['Country']==undefined ? "*":userProfile['Country']
            });
            try{
              $('<style id="CustomCSS">').text(configMasterItems['CustomCSS']== undefined ? "#":configMasterItems['CustomCSS']).appendTo(document.head);
            }catch(ex){

            }
            //console.log(this.state.ResourcesMasterItems)
          });
        }
        catch (e) {
          console.log(e);
        }
      }
    public render(): JSX.Element {  
        return (
            <div className="ms-Grid footerRow" >
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm1 ms-md1 ms-lg1 footerBlock">
                        <div className="footer-logo">
                            <img id="footerLogo" src={this.state.LogoImgUrl} alt="PNG Logo"/>
                        </div>

                    </div>

                    <div className="ms-Grid-col ms-sm11 ms-md11 ms-lg11 footerBlock">
                        <div className="footer-menu" >
                            <a>
                                <span>{this.state.ResourcesMasterItems["internalUseFooter"]} | </span>
                            </a>
                        <a  data-interception="off" href={this.state.ConfigMasterItems['PrivacyPolicyUrl']==undefined?"#":this.state.ConfigMasterItems['PrivacyPolicyUrl']} target="_blank">
                        {this.state.ResourcesMasterItems["privacyPolicyFooter"]}
                            </a>
                    </div>
</div>   
                </div>
                <div style={{display:'none'}}>
                <label id="searchLabel" {...{"for":"searchSuggestionConfigValues"}}>searchSuggestionConfigValues</label>
                <input id="searchSuggestionConfigValues" type="text"  
                {...{ "countryName": this.state.countryCode==undefined?"*":this.state.countryCode }} 
                {...{"SearchSuggester":this.state.ConfigMasterItems["SearchSuggester"]}}
                {...{"SearchSuggesterError":this.state.ConfigMasterItems["SearchSuggesterError"]}}
                {...{ "searchUrl": this.state.ConfigMasterItems['SearchResultUrl'] == undefined ? "https://pgone.sharepoint.com/Search/Pages/results.aspx?k=" : this.state.ConfigMasterItems['SearchResultUrl'] }}
                {...{"SiteTourVideoUrl":this.state.ConfigMasterItems["SiteTourVideoUrl"]}}
                {...{"YammerUrlLink":this.state.ConfigMasterItems["YammerGroupUrl"]}}
                {...{"YammerLabel":this.state.ResourcesMasterItems["yammer"]}}
                {...{"SiteTourLabel":this.state.ResourcesMasterItems["viewGuide"]}}
                {...{"FirstTimeUser_LoginMessage1":this.state.ResourcesMasterItems["FirstTimeUser_LoginMessage1"]}}
                {...{"FirstTimeUser_LoginMessage2":this.state.ResourcesMasterItems["FirstTimeUser_LoginMessage2"]}}
                {...{"FirstTimeUser_LoginSuccessMessage":this.state.ResourcesMasterItems["FirstTimeUser_LoginSuccessMessage"]}}
                ></input>
                </div>
            </div>
        );  
    }  
    
    
  }  