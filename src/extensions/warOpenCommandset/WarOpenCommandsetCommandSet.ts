import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters,
  RowAccessor
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'WarOpenCommandsetCommandSetStrings';
import IFrameDialog from './IFrameDialogContent';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IWarOpenCommandsetCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}
let listDisplayName = "WAR";
let listName;
const LOG_SOURCE: string = 'WarOpenCommandsetCommandSet';

export default class WarOpenCommandsetCommandSet extends BaseListViewCommandSet<IWarOpenCommandsetCommandSetProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized WarOpenCommandsetCommandSet');
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    listName = this.context.pageContext.list.title;
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = (event.selectedRows.length === 1 && listName === listDisplayName);
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
        if (event.selectedRows.length > 0) {
          debugger;
          // Check the selected rows
          event.selectedRows.forEach((row: RowAccessor) => {
            //var itemurl= this.context.pageContext.site.absoluteUrl+`/_layouts/15/listform.aspx?PageType=4&ListId=`+this.context.pageContext.list.id+`&ID=${row.getValueByName('ID')}`;
            new IFrameDialog(this.context.pageContext.site.serverRelativeUrl+"/_layouts/15/listform.aspx?PageType=4&ListId="+this.context.pageContext.list.id+`&ID=${row.getValueByName('ID')}`+"&RootFolder=&IsDlg=1",this.context.pageContext.site.serverRelativeUrl+"/_layouts/15/listform.aspx?PageType=6&ListId="+this.context.pageContext.list.id+`&ID=${row.getValueByName('ID')}`+"&RootFolder=&IsDlg=1").show();
          });
      }
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
