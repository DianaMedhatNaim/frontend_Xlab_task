import { Items } from './items';
export class InvoiceDetails {
  constructor(public invoiceDetails_ID?:number,public quantity?:number,public item_Name?:string,public itemDetails?:Items){}
}
