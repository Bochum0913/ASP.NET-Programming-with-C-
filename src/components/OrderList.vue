<template>
 <div class="container">
 <div class="heading">Your Orders</div>
 <div class="status">{{ state.status }}</div>
 <div id="tray-list">
 <DataTable
 v-if="state.orders.length > 0"
 :value="state.orders"
 :scrollable="true"
 scrollHeight="60vh"
 dataKey="id"
 class="p-datatable-striped"
 v-model:selection="state.orderSelected"
 selectionMode="single"
 @row-select="onRowSelect"
 >
 <Column header="Order #" field="id" />
 <Column header="Date">
 <template #body="slotProps">
 {{ formatDate(slotProps.data.dateCreated) }}
 </template>
 </Column>
 </DataTable>
 <Dialog v-model:visible="state.selectedAOrder" class="dialog-border">
 <div style="font-weight: bold; margin-left: -8vw" class="tray-head">
 Order: #{{ state.orderDetails[0].orderId }} &nbsp; {{ state.orderDetails[0].dateCreated }}
 </div>
 <DataTable
 :value="state.orderDetails"
 :scrollable="true"
 scrollHeight="38vh"
 dataKey="id"
 class="p-datatable-striped"
 >
 <Column id="id" header="Name" field="productId" />
 <Column header="S" field="qtySold"  />
 <Column header="O" field="qtyOrdered"  />
 <Column header="B" field="qtyB"  />
 <Column header="Extended" field="extend">
 <template #body="slotProps">
     {{ formatCurrency(slotProps.data.extend) }}
 </template>  
 </Column>
 <ColumnGroup type="footer" class= "footerTotals">
    <Row>
        <Column 
            :footer="
                `Sub: ` + formatCurrency(state.orderDetails[0].subTotal) " class="footerTotals"   
                >
        </Column>
    </Row>
    <Row>
        <Column 
            :footer="`Tax: ` + formatCurrency(state.orderDetails[0].subTotal * 0.13) " class="footerTotals">
        </Column>
    </Row>
    <Row>
        <Column 
            :footer="`Total: ` + formatCurrency(state.orderDetails[0].subTotal * 1.13) " class="footerTotals">
        </Column>
    </Row>
 </ColumnGroup>
 </DataTable>

 
 </Dialog>
 </div>
 </div>
</template>
<script>
import { reactive, onMounted } from "vue";
import { fetcher } from "../util/apiutil";
export default {
 setup() {
 let state = reactive({
 status: "",
 dialogStatus: "",
 orders: [],
 selectedAOrder: false,
 orderSelected: {},
 orderDetails: [],
 subTot:0,
 taxTot:0,

 });
 onMounted(() => {
 loadTrays();
 });
 const loadTrays = async () => {
 try {
 let user = JSON.parse(sessionStorage.getItem("user"));
 const payload = await fetcher(`order/${user.email}`);
 if (payload.error === undefined) {
 state.orders = payload;
 state.status = `loaded ${state.orders.length} orders`;
 state.selectedAOrder = false;
 } else {
 state.status = payload.error;
 }
 } catch (err) {
 console.log(err);
 state.status = `Error has occured: ${err.message}`;
 }
 };
 const formatDate = (date) => {
 let d;
 // see if date is coming from server
 date === undefined ? (d = new Date()) : (d = new Date(Date.parse(date))); // from server
 let _day = d.getDate();
 let _month = d.getMonth() + 1;
 let _year = d.getFullYear();
 let _hour = d.getHours();
 let _min = d.getMinutes();
 if (_min < 10) {
 _min = "0" + _min;
 }
 return _year + "-" + _month + "-" + _day;
 };
 const onRowSelect = async (event) => {
 try {
 let user = JSON.parse(sessionStorage.getItem("user"));
 state.orderSelected = event.data;
 const payload = await fetcher(
 `order/${state.orderSelected.id}/${user.email}`
 );
 state.orderDetails = payload;
 state.dialogStatus = `details for order ${state.orderSelected.id}`;
 state.selectedAOrder = true;
 } catch (err) {
 console.log(err);
 state.status = `Error has occured: ${err.message}`;
 }
 };
 const formatCurrency = (value) => {
            return value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            });
        };

 return {
 state,
 formatDate,
 onRowSelect,
 formatCurrency,
 };
 },
};
</script>
