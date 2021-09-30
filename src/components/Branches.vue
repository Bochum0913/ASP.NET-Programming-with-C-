<template>
    <div>
        <div class="heading">3 Closest Branches</div>
        <div>
            <InputText
                placeholder="enter current address"
                id="address"
                v-model="state.address"
            />
            <br />
        </div>
        <div style="margin: 3vh">
            <Button
                label="Find 3 Closest"
                @click="genMap"
                class="p-button-outlined"
                style="width: 30vw"
            />
        </div>
        <div id="map" ref="mapRef" v-show="state.showmap === true"></div>
    </div>
</template>
<script>
import { ref, reactive } from "vue";
import { fetcher } from "../util/apiutil";
export default {
    name: "Map",
    setup() {
        const mapRef = ref(null);
        let state = reactive({
        status: "",
        address: "",
        showmap: false,
        });
        const genMap = async () => {
            try {
                state.showmap = true;
                const tt = window.tt;
                let url = `https://api.tomtom.com/search/2/geocode/${state.address}.json?key=CsiqlvbGg18v5dZsors7ZAhQy4wurzTv`;
                let response = await fetch(url);
                let payload = await response.json();
                let lat = payload.results[0].position.lat;
                let lon = payload.results[0].position.lon;
                let url2 = `branch/${lat}/${lon}`;
                let threeStores = await fetcher(url2);
                let map = tt.map({
                    key: "CsiqlvbGg18v5dZsors7ZAhQy4wurzTv",
                    container: mapRef.value,
                    source: "vector/1/basic-main",
                    center: [lon, lat],
                    zoom: 8,
                });
                map.addControl(new tt.FullscreenControl());
                map.addControl(new tt.NavigationControl());
                threeStores.map((branch) => {
                    let marker = new tt.Marker()
                        .setLngLat([branch.longitude, branch.latitude])
                        .addTo(map);
                    let popupOffset = 25;
                    let popup = new tt.Popup({ offset: popupOffset });
                    popup.setHTML(
                        `<div id="popup">Branch#: ${branch.id}</div><div>${branch.street}, ${
                        branch.city
                        }<br/>${branch.distance.toFixed(2)} km</div>`
                    );
                    marker.setPopup(popup);
                });

            } catch (err) {
                state.status = err.message;
            }
        };
        return {
            mapRef,
            state,
            genMap,
        };
    },
};
</script>
<style>
#map {
 height: 50vh;
 width: 90vw;
 margin-left: 3vw;
 border: solid;
}
#popup {
 font-weight: bold;
}
</style>