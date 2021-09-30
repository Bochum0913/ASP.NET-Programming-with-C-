<template>
    <div>
        <div class="heading">Our Brands</div>
        <div class="status">{{ state.status }}</div>
        <Dropdown
            v-if="state.categories.length > 0"
            v-model="state.selectedCategory"
            style="text-align: left"
            :options="state.categories"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Brand"
            @change="loadMenuitems"
        />
        <div style="margin-top:2vh;" v-if="state.menuitems.length > 0">
            <DataTable
                :value="state.menuitems"
                :scrollable="true"
                scrollHeight="60vh"
                selectionMode="single"
                class="p-datatable-striped"
                @row-select="onRowSelect"
            >
                <Column style="margin-right:-35vw;">
                    <template #body="slotProps" >
                    <img
                        :src="`/img/${slotProps.data.graphicName}`"
                        :alt="slotProps.data.productName"
                        class="product-image"
                    />
                    </template>
                </Column>
                <Column field="productName" header="Product Name"></Column>

            </DataTable>

            <Dialog v-model:visible="state.itemSelected" class="dialog-border">
                <img
                        :src="`/img/${state.selectedItem.graphicName}`"
                        class="product-image-dialog"
                />
                <div style="text-align: left;">
                    <div style="margin-bottom:2vh;font-size:larger;font-weight:bold;">{{state.selectedItem.productName}} - {{ formatCurrency(state.selectedItem.msrp) }}</div>
                                       
                </div>
                <div>
                    {{state.selectedItem.description}}
                </div>    
                    
                <div style="margin-top: 2vh; text-align: center">
                    <span style="margin-left: -10vw; margin-right: 2vw">Enter Qty:</span>
                    <span>
                        <InputNumber
                            id="qty"
                            :min="0"
                            v-model="state.qty"
                            :step="1"
                            incrementButtonClass="plus"
                            showButtons
                            buttonLayout="horizontal"
                            decrementButtonIcon="pi pi-minus"
                            incrementButtonIcon="pi pi-plus"
                        />
                        <div style="text-align: center; margin-top: 2vh">
                            <Button
                                label="Add To Cart"
                                @click="addToTray"
                                class="p-button-outlined margin-button1"
                            />
                            &nbsp;
                            <Button
                                label="View Cart"
                                class="p-button-outlined margin-button1"
                                v-if="state.tray.length > 0"
                                @click="viewCart"
                            />
                        </div>
                    </span>
                </div>
                <div
                    style="text-align: center"
                    v-if="state.dialogStatus !== ''"
                    class="dialog-status"
                >
                {{ state.dialogStatus }}
                </div>
            </Dialog>
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
        const router = useRouter();
        onMounted(() => {
            loadCategories();
        });
        let state = reactive({
            status: "",
            categories: [],
            menuitems: [],
            selectedCategory: {},
            selectedItem: {},
            dialogStatus: "",
            itemSelected: false,
            qty: 0,
            tray: [],

        });
        const loadCategories = async () => {
            try {
                state.status = "loading brands...";
                const payload = await poster(`Brand`);
                if (payload.error === undefined) {
                    state.categories = payload;
                    state.status = `loaded ${state.categories.length} brands`;
                } else {
                    state.status = payload.error;
            }
            } catch (err) {
                console.log(err);
                state.status = `Error has occured: ${err.message}`;
            }
        };

        const loadMenuitems = async () => {
            try {
                state.status = `finding products for brand ${state.selectedCategory}...`;
                let payload = await poster(`Product/${state.selectedCategory}`);
                state.menuitems = payload;
                state.status = `loaded ${state.menuitems.length} products`;
            } catch (err) {
                console.log(err);
                state.status = `Error has occured: ${err.message}`;
            }
            if (sessionStorage.getItem("tray")) {
                state.tray = JSON.parse(sessionStorage.getItem("tray"));
            }
        };
        const onRowSelect = (event) => {
            try {
                state.selectedItem = event.data;
                state.dialogStatus = "";
                state.itemSelected = true;
            } catch (err) {
                console.log(err);
                state.status = `Error has occured: ${err.message}`;
            }
        };

        const addToTray = () => {
            const index = state.tray.findIndex(
                // is item already on the tray
                (item) => item.id === state.selectedItem.id
            );
            if (state.qty !== 0) {
                index === -1 // add
                    ? state.tray.push({
                        id: state.selectedItem.id,
                        qty: state.qty,
                        item: state.selectedItem,
                    })
                    : (state.tray[index] = {
                        // replace
                        id: state.selectedItem.id,
                        qty: state.qty,
                        item: state.selectedItem,
                    });
                state.dialogStatus = `${state.qty} item(s) added`;
            } else {
                index === -1 ? null : state.tray.splice(index, 1); // remove
                state.dialogStatus = `item(s) removed`;
            }
            sessionStorage.setItem("tray", JSON.stringify(state.tray)); 
            state.qty = 0;
        };

        const formatCurrency = (value) => {
            return value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            });
        };
        const viewCart = () => {
            router.push("tray");
        };
        return {
                state,
                loadMenuitems,
                onRowSelect,
                addToTray,
                formatCurrency,
                viewCart,
        };
    }
}
</script>
