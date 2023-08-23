import "@pnp/polyfill-ie11"; 
import { dateAdd } from "@pnp/common";
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";
import PnPTelemetry from  "@pnp/telemetry-js";
import  { WebPartContext } from "@microsoft/sp-webpart-base";
// IE 11 Polyfill import 
  
export class PnPHelper {
    private webPartContext: WebPartContext;
    private siteName: string;
    private configValues:any;
    private allItems:any;
    constructor(wpContext: any) {
        const telemetry = PnPTelemetry.getInstance();
        telemetry.optOut();
        
        this.webPartContext = wpContext;

        sp.setup({
            sp: {
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "User-Agent": "NONISV|PNGOne|PGOneHome/1.0",
                    "X-ClientService-ClientTag": "NONISV|PNGOne|PGOneHome/1.0"
                }
            },
            spfxContext: wpContext,
            ie11: true,
            defaultCachingStore: "local",
            enableCacheExpiration: true,
        }); 
        this.siteName = this.webPartContext.pageContext.web.title.toLocaleUpperCase();
    }
public async getResourceListItems(): Promise<any> {
  
    let resourceItems = new Array();
    return new Promise<any>(async (resolve: (item: any) => void, reject: (error: any) => void): Promise<void> => {
        try {
            this.configValues=await this.getConfigMasterListItems();
            sp.web.lists.getByTitle("ResourcesMaster")
                .items
                .select("Title", "ValueForKey")
                .filter("Locale eq 'en'")
                .top(5000)
                .usingCaching({
                    expiration: dateAdd(new Date(), "day", parseInt( this.configValues['ResourceListLabelValuesCacheExpiry'])),
                    key: this.siteName+"-Home-Resources",
                    storeName: "local"
                })
                .get()
                .then(async (items: any): Promise<void> => {
                    try {
                        if (items.length > 0) {
                            items.map((value: any, index: any) => {
                                resourceItems[value["Title"]] = value["ValueForKey"];
                            });
                            resolve(resourceItems);
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                }, (error: any): void => {
                    reject(error);
                });
        }
        catch (error) {
            reject(error);
        }
    });
}

public async getConfigMasterListItems(): Promise<any> {

    let configMasterItems = new Array();
    return new Promise<any>((resolve: (item: any) => void, reject: (error: any) => void): void => {
        try {
            sp.web.lists.getByTitle("ConfigMaster")
                .items
                .select("Title", "ConfigValue")
                //.filter("Locale eq 'en'")
                .top(5000)
                .usingCaching({
                    expiration: dateAdd(new Date(), "day", 1),
                    key: this.siteName+"-ConfigMaster",
                    storeName: "local"
                })
                .get()
                .then(async (items: any): Promise<void> => {
                    try {
                        if (items.length > 0) {
                            items.map((value: any, index: any) => {
                                configMasterItems[value["Title"]] =value["ConfigValue"] ;
                            });
                            resolve(configMasterItems);
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                }, (error: any): void => {
                    reject(error);
                });
        }
        catch (error) {
            reject(error);
        }
    });

}

//#region commented code
// public async getSPUserGroup(propName:string): Promise<any> {
      
//     return new Promise<any>((resolve: (item: any) => void, reject: (error: any) => void): void => {
//         try {
//             sp.web.currentUser.groups()
//                 .then(async (r: any): Promise<void> => {
//                     try {
//                         resolve( r.some(el => el.Title === propName)); 
//                     }
//                     catch (error) {
//                         reject(error);
//                     }
//                 }, (error: any): void => {
//                     reject(error);
//                 });
//         }
//         catch (error) {
//             reject(error);
//         }
//     });
// }

// public  getSPUserGroup1 = (propName: string): boolean => {
//         let result= false;
//         sp.web.currentUser.groups().then(async (r) => {
           
//             console.log(r);
//             result = await r.some(el => el.Title === propName);
//             console.log("return1 "+result);
//         });
//         console.log("return2 "+result);
//         return result;
// };

// public userProps = (propName: string): string => {
//     let result: string = "";
//     sp.profiles.myProperties
//     .usingCaching({
//         expiration: dateAdd(new Date(), "day", 7),
//         key: "PGOne UserProfile",
//         storeName: "local"
//     })
//     .get().then(async (r) => {
//         let results=await r.UserProfileProperties.results;
//         console.log(results);
//         results.map((v) => {
//             results.Key === propName ? (result = results.Value) : "";
//             console.log(result);
            
//       });
      
//     });
//     return result;
//   };
//#endregion

  public async userProfileDetails(): Promise<any> {
  
    let UserProfile = new Array();
    return new Promise<any>(async (resolve: (item: any) => void, reject: (error: any) => void): Promise<void> => {
        try {
            this.configValues=await this.getConfigMasterListItems();
            sp.profiles.myProperties
                .usingCaching({
                    expiration: dateAdd(new Date(), "day",parseInt(  this.configValues['UserProfilePropertyCacheExpiry'])),
                    key: this.siteName+"-UserProfile-"+this.webPartContext.pageContext.user.loginName,
                    storeName: "local"
                })
                .get()
                .then(async (items: any): Promise<void> => {
                    try {
                        if (items['UserProfileProperties'].results.length > 0) {
                            items['UserProfileProperties'].results.map((value: any, index: any) => {
                                UserProfile[value["Key"]] = value["Value"];
                            });
                            resolve(UserProfile);
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                }, (error: any): void => {
                    reject(error);
                });
        }
        catch (error) {
            reject(error);
        }
    });
}


//to check current logged in user is part of PGOneApprover group
public checkCurrentUserApprovalPermission(): Promise<any> {
    let isCurrentUserApprover: boolean = false;
    return new Promise<any>(async (resolve: (item: any) => void, reject: (error: any) => void): Promise<void> => {
        try {
            this.configValues=await this.getConfigMasterListItems();
            sp.web.currentUser
                .groups()
                .then((result: any): void => {
                    if (result.length > 0) {
                        isCurrentUserApprover = result.some((group: any) => {
                            return group.LoginName === this.configValues["PGOneApproverGroup"];
                        });
                       
                    }
                    resolve(isCurrentUserApprover);
                }, (error: any): void => {
                    reject(error);
                  
                });
        }
        catch (error) {
            reject(error);
           
        }
    });
}

}