import { Customer } from './../../_Models/customer';
import { Invoice } from './../../_Models/invoice';
import { InvoiceService } from 'src/app/_Services/invoice.service';
import { Items } from './../../_Models/items';
import { InvoiceDetails } from 'src/app/_Models/invoice-details';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { InvoiceData } from 'src/app/_Models/invoice-data';




@Component({
  selector: 'app-invoice-page',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.css'],
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
    providers: [MessageService,ConfirmationService]
})
export class InvoicePageComponent implements OnInit {

  productDialog: boolean;

    // products: InvoiceDetails[];

    product: InvoiceData;

    selectedProducts: InvoiceData[];
    invoiceData:InvoiceData[]=[];
    submitted: boolean;

    AllItems: Items[];
    AllCustomers:Customer[];
    cbxItema:any[]=[];
    cbxCust:any[]=[];
    itemsNames:any[];
    price:number;
    searchId:number;
    InvoiceId:number;
    custmerName:string;
    invoiceDate:any;
    invoice_numbers:Invoice[]=[];
    maxInvoice_number:number;
    invoiceTotalPrice:number=0;
    invoiceTotalItems:number=0;
    result:any;
    btn_disabled:any=false;

    constructor(private InvoiceService: InvoiceService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit() {

      this.InvoiceService.getInvoice_no().subscribe(data => {this.invoice_numbers = data;
        // console.log("data "+data);
    //     this.invoice_numbers.forEach(element => {
    //       this.maxInvoice_number=element.invoice_no+1;

    //  });
    this.AutoIncrementInvoice_no();
     this.InvoiceId=this.maxInvoice_number;
    //  console.log(this.maxInvoice_number);
    }
        );
      //   this.InvoiceService.getallInvoiceDetails().subscribe(data => {this.products = data;
      //     this.products.forEach(element => {
      //       console.log(element.quantity);
      //  });

      // }
      //     );
      this.InvoiceService.getCustomers().subscribe(data=>{this.AllCustomers=data;
        this.AllCustomers.forEach(element => {
          this.cbxCust.push({label:element.customer_Name , value: element.customer_Name});


  });
      })
          this.InvoiceService.getallItems().subscribe(data => {this.AllItems = data;
            this.AllItems.forEach(element => {
            // this.itemsNames.push(element.item_Name);
            // console.log(this.itemsNames);
          });

          // for (let index = 0; index < this.itemsNames.length; index++) {
          //   // const element = array[index];
          //   this.cbxItema.push({label:this.itemsNames[index] , value: this.itemsNames[index]})
          // }

         this.AllItems.forEach(element => {
           this.cbxItema.push({label:element.item_Name , value: element.item_Name});
        //   this.cbxItema = [

        //     {label:element.item_Name , value: element.item_Name},

        // ];

   });
   console.log("cmbx "+this.cbxItema);

        }
            );

            // var currentdate = new Date();
            // this.invoiceDate = currentdate.getDate() + "/"
            //                 + (currentdate.getMonth()+1)  + "/"
            //                 + currentdate.getFullYear();


    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts(product: InvoiceData) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {

                this.invoiceData = this.invoiceData.filter(val => !this.selectedProducts.includes(val));

                this.selectedProducts = null;


                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});

            }
        });
        this.invoiceTotalPrice=this.invoiceTotalPrice-(product.totalPrice);
                console.log("total_price: "+product.totalPrice);
    }

    editProduct(product: InvoiceData) {
        this.product = {...product};
        console.log("item name "+this.product.item_Name);
        this.productDialog = true;
    }

    deleteProduct(product: InvoiceData) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.item_Name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.invoiceData = this.invoiceData.filter(val => val.item_Name !== product.item_Name);
                this.invoiceTotalPrice=this.invoiceTotalPrice-(product.totalPrice);
                console.log("total_price: "+product.totalPrice);
                this.product = {};
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }


    saveProduct() {
        this.submitted = true;

        if (this.product.item_Name.trim()) {
          console.log("condition"+this.product.invoice_no);
            if (this.product.invoice_no) {

                this.product.customer_Name=this.custmerName;
                this.product.invoice_Date=this.invoiceDate;
                if(this.product.quantity==undefined)
                {
                  this.product.quantity=0;
                }
                this.product.totalPrice=this.product.quantity*this.product.item_Price;
                 this.invoiceData[this.findItemByItemName(this.product.item_Name)] = this.product;
                this.invoiceData.forEach(element => {
                  console.log("first if "+element.item_Name,element.customer_Name);
                });
                 this.invoiceTotalPrice=0;
                 console.log("before enter "+ this.invoiceTotalPrice);
                this.invoiceData.forEach(element => {
                  this.invoiceTotalPrice=this.invoiceTotalPrice+element.totalPrice;
                  if(this.invoiceData.length!=undefined){
                  this.product.invoice_TotalQty=this.invoiceData.length;
                  this.product.invoice_TotalPrice=this.invoiceTotalPrice;
                  }
                  console.log("enter "+ this.invoiceTotalPrice);
                  console.log("totalprice "+ element.totalPrice);
              });
              // this.invoiceTotalPrice=this.invoiceTotalPrice+this.product.totalPrice;
              this.product.invoice_TotalPrice=this.invoiceTotalPrice
              console.log("invPrice "+ this.invoiceTotalPrice);


                this.invoiceData[this.findItemByItemName(this.product.item_Name)] = this.product;
                console.log("pro "+this.product.item_Name,this.product.customer_Name);
                this.invoiceData.forEach(element => {
                  console.log("if "+element.item_Name,element.customer_Name);
                });
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
            }
            else {
              // console.log("length "+this.invoiceData.length);
              // if(this.invoiceData.length<1)
              // {
              //   this.invoiceTotalItems=0;
              // }
              // else{
              //   this.invoiceTotalItems=this.invoiceData.length;
              // }
              // this.invoiceTotalPrice=0;
              // this.invoiceData.forEach(element => {
              //     this.invoiceTotalPrice=this.invoiceTotalPrice+element.totalPrice;
              // });

              if(this.product.quantity==undefined)
                {
                  this.product.quantity=0;
                }
              this.product.totalPrice=this.product.item_Price*this.product.quantity;
              this.invoiceTotalPrice=this.invoiceTotalPrice+this.product.totalPrice;
              this.product.invoice_TotalPrice=this.invoiceTotalPrice
              console.log("invPrice "+ this.invoiceTotalPrice);
              this.product.invoice_TotalPrice=this.invoiceTotalPrice;
               this.invoiceTotalItems
               this.product.invoice_no=this.InvoiceId;

               this.product.customer_Name=this.custmerName;
               this.product.invoice_Date=this.invoiceDate;
               if(this.invoiceData.length!=undefined){
                this.product.invoice_TotalQty=this.invoiceData.length;
                }
              //  this.product.invoice_TotalQty= this.invoiceTotalItems;
               // this.product.image = 'product-placeholder.svg';
              //  this.invoiceData.forEach(element => {
              //   console.log(element);
              //  });

            //    console.log(this.product);
            //    if(this.invoiceData==undefined){
            //     this.invoiceTotalPrice =0;
            // }
            // else{
              // this.invoiceData.forEach(element => {
              //   this.invoiceTotalPrice +=element.totalPrice;
              // });
            // }
              this.product.invoice_TotalPrice=this.invoiceTotalPrice;
              this.invoiceData.push(this.product);
                // if(this.invoiceDate==undefined)
                // {

                // }

                // else{

                this.invoiceData.forEach(element => {
                  console.log(element.item_Name,element.customer_Name);
                });
                // }
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
            }

              // if(this.invoiceData!=undefined){
                this.invoiceData = [...this.invoiceData];
              // }

            this.productDialog = false;
            this.product = {};
        }
    }

    findItemByItemName(name: string): number {
        let index = -1;
        for (let i = 0; i < this.invoiceData.length; i++) {
            if (this.invoiceData[i].item_Name === name) {
                index = i;
                break;
            }
        }
console.log("index: "+index)
        return index;
    }

    setPrice(name:string)
    {
      this.AllItems.forEach(element => {
        if(element.item_Name==name){
          this.product.item_Price=element.item_Price;
          // this.product.invoice_no=this.InvoiceId;

        }
        this.invoiceData.forEach(element => {
          if(element.item_Name==name)
          {
            this.product.invoice_no=element.invoice_no;
          }
        });
console.log("pppp "+this.price);
      });
    }
    Search()
    {
      if(this.searchId!=undefined)
      {
      this.btn_disabled=true;
      console.log("idd"+this.searchId);
      this.InvoiceService.getallInvoice(this.searchId).subscribe(data => {this.invoiceData = data;

        if(this.invoiceData.length==0){
          console.log(this.invoiceData);
          this.messageService.add({severity:'warn', summary: 'Warning', detail: 'This invoice is not available', life: 6000});
      this.Clear_Data();
        }

        this.invoiceData.forEach(element => {
          console.log(element.customer_Name);
          this.custmerName=element.customer_Name;
          this.invoiceDate=element.invoice_Date;
          this.InvoiceId=this.searchId;

          // this.invoiceData.forEach(element => {

          //   this.invoiceTotalItems=this.invoiceTotalItems+element.totalPrice;

          // });
          this.invoiceTotalPrice=element.invoice_TotalPrice;
          console.log("nooo "+element.invoice_no);
          // this.product.Invoice_no=this.maxInvoice_number;
     });

    }
        );
  }
    }
    Clear_Data()
    {
      this.searchId=null;
      this.InvoiceId=this.maxInvoice_number;
      this.custmerName=null;
      this.invoiceDate=null;
      this.invoiceData=[];
      this.AutoIncrementInvoice_no();
      window.location.reload();
    }
    Insert()
    {

    //   const promise=new Promise((resolve, reject) => {
    //      this.invoiceMainData();
    //    this.InvoiceService.insertInvoice(this.invoiceData).subscribe(data => {console.log("insert "+data);
    //    this.result=data;

    //   });

    //     resolve(0);
    // })
    // .then(() => {
    //      if(this.result=="false")
    //   {
    //    this.messageService.add({severity:'warn', summary: 'Warning', detail: 'Please enter all invoice information', life: 3000});

    //   }
    //   else{
    //     this.Clear_Data();
    //   }
    // })
    // .catch(() => {
    //     console.error('Do that');
    // })
    // .then(() => {
    //     console.log('Do this, no matter what happened before');
    // });


      console.log("hello insert");
      // this.invoiceData.forEach(element => {
      //   console.log("in insert"+element.invoice_no + element.customer_Name);
      // });
      this.invoiceMainData();
       this.InvoiceService.insertInvoice(this.invoiceData).subscribe(data => {console.log("insert "+data);

       if(data=="false")
       {
        this.messageService.add({severity:'warn', summary: 'Warning', detail: 'Please enter all invoice information', life: 3000});

       }
       else{
         this.Clear_Data();
       }
      });


      // this.invoiceData.forEach(element => {
      //   console.log("id "+element.invoice_no,"name "+element.item_Name,"total "+element.totalPrice,"custome "+element.customer_Name ,element.invoice_TotalQty,element.invoice_TotalPrice);
      // });
      // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Invoice Inserted', life: 3000});
       //this.Clear_Data();
    }
    Update()
    {

        // console.log("condition"+this.product.invoice_no);
        //   if (this.product.invoice_no) {
        //       this.product.customer_Name=this.custmerName;
        //       this.product.invoice_Date=this.invoiceDate;
        //       this.invoiceData[this.findItemByid(this.product.invoice_no)] = this.product;
        //   }


      // this.currentData();

      // this.invoiceData.forEach(element => {
      //   element.customer_Name=this.custmerName;
      //   element.invoice_Date=this.invoiceDate;
      //   element.invoice_TotalPrice=this.invoiceTotalPrice;
      //   element.invoice_TotalQty=this.invoiceData.length;
      // });
      this.invoiceMainData();

      console.log("cust_name"+this.custmerName);
      this.InvoiceService.updateInvoice(this.invoiceData).subscribe(
        data => {console.log(data);
      if(data==false)
      {
        this.messageService.add({severity:'warn', summary: 'Warning', detail: 'Please enter all invoice information', life: 9000});
        console.log("if");
      }
      else{
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Invoice Updated', life: 3000});
        this.Clear_Data();
        console.log("else");
      }
      });

    }
    Delete()
    {
      this.InvoiceService.deleteInvoice(this.InvoiceId).subscribe(data => {
        console.log("data: "+data);
       if(data==true)
       {
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Invoice Deleted', life: 9000});
       }
      });

      this.Clear_Data();
    }
    AutoIncrementInvoice_no()
    {
      if(this.invoice_numbers.length!=0){
      this.invoice_numbers.forEach(element => {
        this.maxInvoice_number=element.invoice_no+1;
        // console.log("id : "+this.maxInvoice_number);

   });
  }
  else{
    this.maxInvoice_number=1;
  }
    }
    // currentData()
    // {
    //           this.invoiceTotalItems=0;
    //           //  this.product.invoice_no=this.InvoiceId;
    //           //  this.product.totalPrice=this.product.item_Price*this.product.quantity;
    //            this.product.customer_Name=this.custmerName;
    //            this.product.invoice_Date=this.invoiceDate;
    //            this.product.invoice_TotalQty= this.invoiceTotalItems;
    //            this.product.invoice_TotalPrice=this.invoiceTotalPrice;
    //           this.invoiceData.push(this.product);

    // }
invoiceMainData()
{
  this.invoiceData.forEach(element => {
    element.customer_Name=this.custmerName;
    element.invoice_Date=this.invoiceDate;
    element.invoice_TotalPrice=this.invoiceTotalPrice;
    element.invoice_TotalQty=this.invoiceData.length;
  });
}


}





