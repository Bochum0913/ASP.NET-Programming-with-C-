import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/dataTable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputNumber';
import Toolbar from 'primevue/toolbar';
import Menu from 'primevue/menu';
import InputText from 'primevue/inputText';
import ColumnGroup from 'primevue/columnGroup';
import Row from 'primevue/Row';

import 'primevue/resources/primevue.min.css'; //core css
import 'primevue/resources/themes/md-light-indigo/theme.css'; //theme
import 'primeicons/primeicons.css'; //icons
import './assets/site.css';
import router from "./router";

const app = createApp(App)
app.use(PrimeVue);
app.component('Button', Button);
app.component('Dropdown', Dropdown);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Dialog', Dialog);
app.component('InputNumber', InputNumber);
app.component('Toolbar', Toolbar);
app.component('Menu', Menu);
app.component('InputText', InputText);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.use(router);
app.mount('#app');
