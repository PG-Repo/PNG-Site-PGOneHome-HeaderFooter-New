import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from '@pnp/sp/presets/all';
import { Web } from "@pnp/sp/webs";
import { Title } from "PgOneExtentionApplicationCustomizerStrings";
const web1 = Web("https://pgone.sharepoint.com/sites/PGOne");
export class SPService {
  
    constructor(private context: WebPartContext) {
        sp.setup({
            spfxContext: this.context
        });
    }

    public  getListItems(listName: string):any {
      var  Title12 = "CPA Global";
        try {
         //.select("Title,Link,AvailableExternal").filter("Title eq '"+Title12+ "' and AvailableExternal eq false")
            let listItems =  web1.lists.getByTitle(listName)
                .items
                .select("Title,Link,AvailableExternal").filter("AvailableExternal eq false")
                .expand().getAll();
            return listItems;
        } catch (err) {
            Promise.reject(err);
        }
     }

     public  getListItems1(listName: string,vartitle:string):any {
        try {
           // var title = suggestion.split("-")[0].toString();;
            let listItems =  web1.lists.getByTitle(listName)
                .items
                .select("Title,AvailableExternal").filter("Title eq '"+vartitle+ "'")
                .expand().getAll();
            return listItems;
        } catch (err) {
            Promise.reject(err);
        }
     }
}
