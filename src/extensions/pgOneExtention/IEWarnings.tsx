import * as React from "react";
export interface IEWarningProps { }
import { MessageBar, MessageBarType, Icon, DefaultButton, } from 'office-ui-fabric-react';
import { PnPHelper } from './ResourcesMasterListItems';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';

export interface IEWarningProps {
    context: any;
}
interface IRWarningState {
    WarningMessage: string;
    hideDeleteDialog: boolean;
    SupportText:string;
    LinkURL:string;
    LinkDisplayText:string;
}

export default class IEWarning extends React.Component<IEWarningProps, IRWarningState> {
    private pnpHelper: PnPHelper;

    constructor(props: IEWarningProps) {
        super(props);
        this.state = {
            WarningMessage: "",
            SupportText:"",
            LinkURL:"",
            LinkDisplayText:"",
            hideDeleteDialog: false,
        };
        //console.log(this.props.context.pageContext.web.absoluteUrl, this.props.context.pageContext.web)
        this.pnpHelper = new PnPHelper(this.props.context);

    }

    public render(): JSX.Element {
        
        return (
            // <MessageBar messageBarType={MessageBarType.severeWarning}>
            //     {this.state.WarningMessage} Open in <a href={"microsoft-edge:" + this.props.context.pageContext.web.absoluteUrl}>Edge</a> or
            //     <a href={"google-chrome:" + this.props.context.pageContext.web.absoluteUrl}>Chrome</a>
            // </MessageBar>
            <Dialog
            hidden={this.state.hideDeleteDialog}
            onDismiss={() => this.setState({ hideDeleteDialog: true })}
            dialogContentProps={{
              type: DialogType.normal,
              showCloseButton: false
            }}
            modalProps={{
              isBlocking: true,

            }}
             className={"browserWarning-dialog"}
          >
            <div className={"browserWarning"}>
            <Icon iconName="Info"></Icon>
            <p>{this.state.WarningMessage}</p> 
        <p>{this.state.SupportText} <a data-interception="off" target="_blank" href={this.state.LinkURL} >{this.state.LinkDisplayText}</a></p> 
             
            {/* <br></br><br></br>
            Open in <a href={"microsoft-edge:" + this.props.context.pageContext.web.absoluteUrl}>Edge</a> or <a href={"google-chrome:" + this.props.context.pageContext.web.absoluteUrl}>Chrome</a> */}
            
            </div>
            <DialogFooter className={"warning-button"}>
                        <DefaultButton onClick={() => this.setState({ hideDeleteDialog: true })}  text="Ok"/>
                    </DialogFooter>
          </Dialog>
        );
    } 

        
    public componentWillMount() {

        try {
            Promise.all([
                this.pnpHelper.getResourceListItems()

            ]).then(([configMasterItems]) => {
                this.setState({
                    WarningMessage: configMasterItems["BrowserWarningMessage"] == null ? "For better user experience, Please use Google Chrome / Microsoft Edge browser." : configMasterItems["BrowserWarningMessage"],
                    SupportText: configMasterItems["BrowserWarningSupportText"] == null ? "For any assistance, please contact" : configMasterItems["BrowserWarningSupportText"],
                    LinkURL: configMasterItems["BrowserWarningLinkUrl"] == null ? "http://gethelp.pg.com" : configMasterItems["BrowserWarningLinkUrl"],
                    LinkDisplayText:configMasterItems["BrowserWarningLinkDisplayText"] == null ? "gethelp.pg.com" : configMasterItems["BrowserWarningLinkDisplayText"]
                });
            });
        }
        catch (e) {
            console.log(e);
        }
    }

} 