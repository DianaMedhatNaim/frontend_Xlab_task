export class InvoiceData {
  constructor(public invoice_no?:number,public customer_Name?:string,public invoice_Date?:Date,public item_Name?:string,public item_Price?:number,public quantity?:number,public invoice_TotalQty?:number,public invoice_TotalPrice?:number,public totalPrice?:number){}
}
