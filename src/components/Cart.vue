<template>
    <div class="container">
        <img
            class="item-image" 
            style="margin-top: 2vh"
            src="../assets/Cart.png"
    />
        <div class="heading">Cart Contents</div>
        <div class="status">{{ state.status }}</div>
        <div v-if="state.tray.length > 0" id="tray">
            <DataTable
                :value="state.tray"
                :scrollable="true"
                scrollHeight="38vh"
                dataKey="id"
                class="p-datatable-striped"
                id="tray-contents"
            >
                <Column id="id" header="Name" field="item.id" />
                <Column header="Qty" field="qty"  />
                <Column id="price" header="Price" >
                <template #body="slotProps" >
                        {{formatCurrency(slotProps.data.item.msrp)}}
                    </template>    
                </Column>

                <Column id="extendedPrice" header="Extended"  >
                    <template #body="slotProps" >
                        {{formatCurrency(slotProps.data.item.msrp * slotProps.data.qty)}}
                    </template>    
                </Column>
            </DataTable>
        </div>
        <div v-if="state.tray.length > 0">
            <table style="border: solid; margin-top: 1vh">
                <tr>
                    <td style="width: 20%; font-weight: bold">Sub:</td>
                    <td style="width: 10%; text-align: right; padding-right: 3vw">
                        {{ formatCurrency(state.subTot) }}
                    </td>
                </tr>
                <tr>
                    <td style="width: 20%; font-weight: bold">Tax: </td>
                    <td style="width: 10%; text-align: right; padding-right: 3vw">
                        {{ formatCurrency(state.taxTot) }}
                    </td>
                </tr>
                <tr> 
                    <td style="width: 20%; font-weight: bold">Total: </td>
                    <td style="width: 10%; text-align: right; padding-right: 3vw">
                        {{ formatCurrency(state.tot) }}
                    </td>
                    <td colspan="4">&nbsp;</td>
                </tr>
            </table>
            <Button
                style="margin-top: 2vh"
                label="Save Cart"
                @click="saveCart"
                class="p-button-outlined margin-button1"
            />
            <Button
            style="margin-top: 2vh"
            label="Clear Cart"
            @click="clearCart"
            class="p-button-outlined margin-button1"
        />
        </div>
        
    </div>
</template>
<script>
import { reactive, onMounted } from "vue";
import { fetcher } from "../util/apiutil";
import { useRouter } from "vue-router";
import { poster } from "../util/apiutil";
export default {
    setup() {       
        let state = reactive({
            status: "",
            subTot: 0,
            taxTot: 0,
            tot: 0,
            tray: [],
        });

        
        onMounted(() => {
            if (sessionStorage.getItem("tray")) {
                state.tray = JSON.parse(sessionStorage.getItem("tray"));
                state.tray.map((trayItem) => {
                    state.subTot += trayItem.item.msrp * trayItem.qty;
                    state.taxTot = state.subTot*0.13;
                    state.tot = state.subTot + state.taxTot;
                });
            } else {
                state.tray = [];
            }
        });

        const formatCurrency = (value) => {
            return value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            });
        };
        const clearCart = () => {
            sessionStorage.removeItem("tray");
            state.tray = [];
            state.status = "cart cleared";
        };
        const saveCart = async () => {
            let user = JSON.parse(sessionStorage.getItem("user"));
            let tray = JSON.parse(sessionStorage.getItem("tray"));
            try {
                state.status = "sending order info to server";
                let trayHelper = { email: user.email, selections: tray };
                let payload = await poster("order", trayHelper); 
                if (payload.indexOf("not") > 0) {
                    state.status = payload;
                } else {
                    clearCart();
                    state.status = payload;
                }
            } catch (err) {
                console.log(err);
                state.status = `Error add order: ${err}`;
            }
        }

        return {
                state,
                //loadMenuitems,
                //onRowSelect,
               // addToTray,
                //viewTray,
                formatCurrency,
                clearCart,
                saveCart
        };

    },
}
</script>
<style>
#traycontents th:nth-child(2) {
    margin-left: 45vw;
}
</style>
