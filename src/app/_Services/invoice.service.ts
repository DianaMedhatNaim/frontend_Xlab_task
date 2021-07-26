import { Customer } from './../_Models/customer';
// import { InvoiceData } from 'src/app/_Models/invoice-data';

import { InvoiceDetails } from './../_Models/invoice-details';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Items } from '../_Models/items';
import { InvoiceData } from '../_Models/invoice-data';
import { Invoice } from '../_Models/invoice';


@Injectable({
  providedIn: 'root'
})

export class InvoiceService {

  constructor(private http:HttpClient) { }

  getallInvoiceDetails(){

     this.http.get<InvoiceDetails[]>("https://localhost:44311/api/InvoiceDetails").forEach(element => {
      console.log("service"+element);
   });

    return this.http.get<InvoiceDetails[]>("https://localhost:44311/api/InvoiceDetails");
  }
  getallItems(){


   return this.http.get<Items[]>("https://localhost:44311/api/Items");
 }

 getallInvoice(invoiceId:number){


  const params = new HttpParams()
  .set('invoiceId', invoiceId);

   return this.http.get<InvoiceData[]>('https://localhost:44311/api/InvoicesData',{ params: params });
}

getInvoice_no(){

   return this.http.get<Invoice[]>('https://localhost:44311/api/Invoice');
}
getCustomers(){

  return this.http.get<Customer[]>('https://localhost:44311/api/Customers');
}

public insertInvoice(data:InvoiceData[]){

console.log("onService "+data);
  var headers = new HttpHeaders({

    "Content-Type": "application/json",

    "Accept": "application/json"

  });

    return this.http.post("https://localhost:44311/api/InvoicesData",JSON.stringify(data),{headers:headers} );

  }
  public updateInvoice(data:InvoiceData[]){
    return this.http.put("https://localhost:44311/api/InvoicesData",data);

  }

  public deleteInvoice(id:number){
    return this.http.delete("https://localhost:44311/api/InvoicesData/"+id);
    }

}
