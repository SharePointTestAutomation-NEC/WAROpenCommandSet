import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import { DialogContent,Dialog,CommandButton } from 'office-ui-fabric-react';
import * as jquery from 'jquery';
// modal dialog
import Modal from 'react-modal';

export interface IReactDropdownState {
    selectedItem?: {key:string|number|undefined};
    options:any[];
    modalIsOpen: boolean;
    showDialog: boolean
    openDialog: boolean
}
const customStyles = {
    content: {
        padding:'0px -1px 0px 20px',
        backgroundColor:'#ffffff',
        marginLeft: '770px',
        //marginRight: '-30px',
        marginTop: '10px',
        width: '725px'  
    },
    overlay: {
        position: 'absolute',
        padding: '50px 60px 0px 0px',
        backgroundColor:'#00000066',
        marginBottom: '-40px',
      },
      ReactModal__Content:{
        position: 'absolute',
        marginLeft: '750px',
      },
      buttonHide: {
        top: '-90px !important',
        /* bottom: -30px; */
        float: 'right',
        //border: oppx;
        marginTop: '-50px',
        marginRright: '60px',
        border: 'none',
        cursor: 'pointer',
        width: '100px',
        backgroundColor: 'transparent'
    }
  };
interface IIFrameDialogContentProps {
    close: () => void;
    url: string;
    editURL: string;
    iframeOnLoad?: (iframe: any) => void;
    iframeOnLoadEdit?: (iframe: any) => void;
}
class IFrameDialogContent extends React.Component<IIFrameDialogContentProps, IReactDropdownState > {
    private iframe: any;
    private checkflag:boolean;
    private checkEditflag:boolean;
    constructor(props) {
        super(props);
        this.state = { 
            openDialog: false,
            showDialog: false,
            options:[],
            modalIsOpen: false
        }; 
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    public render(): JSX.Element {
       return <DialogContent
            title='Display Item'
            onDismiss={this.props.close}
            showCloseButton={true}
        >
        <div className='buttonHide'>
        {/* <CommandButton text={'Edit'} onClick={this.openModal} /> */}
        <button onClick={this.openModal} style={{fontSize: '15px',fontWeight: 400,color: '#333333',border: 'none'}}>
        <img  src={require('./assets/iconEdit.png')}  width='15' height='15' alt='Edit Item'/> Edit</button>
        
        {/* <button onClick={this.openModal}>Edit</button> */}
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}          
          contentLabel="Edit Item"
          shouldCloseOnOverlayClick={false}
          style={customStyles}
        > 
        <DialogContent
            title='Edit Item'
            onDismiss={this.closeModal}
            showCloseButton={true}
        >
        <div id="loader2">                    
            <table style={{position: 'relative',left: '30%'}}>
                <tr>
                    <td><img  src={require('./assets/loadingForm.gif')} width='150' height='150' alt='loading gif'/></td>
                </tr>
                <tr>
                    <td><span style={{position: 'relative',fontSize:'40px',color:'#0072c6'}}>Working on it...</span></td>
                </tr>
            </table>
         </div>
         <div dangerouslySetInnerHTML={{__html: ''}} />
        
        <iframe id="editIFrame" ref={(iframe) => { this.iframe = iframe; }} onLoad={this._iframeOnLoadEdit.bind(this)}
           src={this.props.editURL} frameBorder={0} style={{width: '670px', height: '150px'}}>            
        </iframe>
          </DialogContent>
        </Modal>
        <div id="loader1">
            <table style={{position: 'relative',left: '30%'}}>
                <tr>
                    <td><img  src={require('./assets/loadingForm.gif')} width='150' height='150' alt='loading gif'/></td>
                </tr>
                <tr>
                    <td><span style={{position: 'relative',fontSize:'40px',color:'#0072c6'}}>Working on it...</span></td>
                </tr>
            </table>
         </div>
         <div dangerouslySetInnerHTML={{__html: ''}} />
        
        <iframe ref={(iframe) => { this.iframe = iframe; }} onLoad={this._iframeOnLoad.bind(this)}
           src={this.props.url} frameBorder={0} style={{width: '670px', height: '150px'}}>
        </iframe>
    </DialogContent>;
    }
    private openModal() {
        this.props.close();
        this.setState({modalIsOpen: true});
    }
    private closeModal() {
        this.setState({modalIsOpen: false});
    }
    public CloseEditDialog() {
        //this.props.close();
        this.setState({modalIsOpen: false});
    }

    private _iframeOnLoadEdit(): void{
        jquery('#loader2').hide();
        this.IncreaseSize(this.iframe);
        if(this.checkEditflag) {

            this.props.close();
            window.location.reload();
        }
        
        this.checkEditflag = true;
        try {   
            
            // var y=this.iframe.contentWindow.$("input[id$='idIOGoBack']")[1];
            // y.setAttribute('onclick',null);
            // y.onclick=this.closeModal();
            //document.querySelector("#ctl00_ctl41_g_7ae0c439_943b_4a02_850b_4c8e84ca6322_ctl00_toolBarTbl_RightRptControls_ctl01_ctl00_diidIOGoBack")
            var cancelBtn=this.iframe.contentWindow.document.querySelectorAll("input[id$='idIOGoBack']")[1];
            console.log(cancelBtn);
            //var cancelBtn=this.iframe.contentWindow.document.querySelectorAll('input[value="Cancel"]')[1];
            //cancelBtn.setAttribute('onclick',null);
            cancelBtn.onclick=this.CloseEditDialog.bind(this);

            var scollH=this.iframe.contentWindow.document.getElementById('s4-workspace');
            scollH.setAttribute("style", "overflow-x: hidden;");
            
            var SaveButton=this.iframe.contentWindow.document.querySelectorAll('input[value="Save"]')[1];
            var AttachmentButton=this.iframe.contentWindow.document.getElementById('AddAttachments');
            var AttachFile=this.iframe.contentWindow.document.getElementById('attachOKbutton');
           
            addEvent(SaveButton, "click", this.IncreaseSize.bind(this) );
            addEvent(AttachmentButton, "click", this.IncreaseSize.bind(this));
            addEvent(AttachFile, "click", this.IncreaseSize.bind(this) );
            
            //cancelBtn.onclick=this.closeModal();
        
        } catch (err) {
            if (err.name !== 'SecurityError') {
                throw err;
            }
        }
        if (this.props.iframeOnLoadEdit) {
            this.props.iframeOnLoadEdit(this.iframe);
        }
    }

    private _iframeOnLoad(): void {

        jquery('#loader1').hide();
        this.IncreaseSize(this.iframe);

        // if(this.checkflag) {
        //     this.props.close();
        //     window.location.reload();
        // }        
        // this.checkflag = true;
        try {   
            
            var y=this.iframe.contentWindow.$("input[id$='idIOGoBack']")[1];
            y.setAttribute('onclick',null);
            y.onclick=this.CloseDialog.bind(this);
        
            var scollH=this.iframe.contentWindow.document.getElementById('s4-workspace');
            scollH.setAttribute("style", "overflow-x: hidden;");
            var sec1=this.iframe.contentWindow.document.querySelector("#Section1");
           
            addEvent(sec1, "click", this.IncreaseSize.bind(this) );            
        } catch (err) {
            if (err.name !== 'SecurityError') {
                throw err;
            }
        }
        if (this.props.iframeOnLoad) {
            this.props.iframeOnLoad(this.iframe);
        }
    }

    public IncreaseSize(iframe) {
        this.iframe.style.height = this.iframe.contentWindow.document.body.scrollHeight + 30 + 'px';  
        window.requestAnimationFrame(() => this.IncreaseSize(iframe)); 
    }
    public onClick() {
        this.props.close();
    }
    public CloseDialog() {
        this.props.close();
    }
}
function addEvent(obj, evType, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evType, fn, false);
        return true;
    } else if (obj.attachEvent) {
        var r = obj.attachEvent("on" + evType, fn);
        return r;
    } else {
        alert("Handler could not be attached");
    }
}
export default class IFrameDialog extends BaseDialog {
    
    constructor(private url: string,private urlEdit: string) {
        //super();
        super({isBlocking: true});
    }
    public render(): void {
        window.addEventListener('CloseDialog', () => { this.close(); });
        ReactDOM.render(
            <IFrameDialogContent
                close={this.close}
                url={this.url}
                editURL={this.urlEdit}
            />, this.domElement);
    }
    public getConfig(): IDialogConfiguration {
        return {
            isBlocking: false
        };
    }
}