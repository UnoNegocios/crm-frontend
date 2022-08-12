<template>
    <v-container>
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterClients @filtersCompanies="filtersCompanies"/>
        </v-navigation-drawer>
        <!-- Contenedor -->
        <v-data-table
            item-class="line-padding"
            class="pa-4"
            :items="clients" 
            :headers="header"
            :footer-props="{'items-per-page-options':[15, 30, 50, totalClients]}"
            :options.sync="options"
            :server-items-length="totalClients"
            :loading="loading"
            >
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat style="background:transparent;">
                    <v-toolbar-title>Clientes</v-toolbar-title>
                    <v-btn icon @click="openFilter()">
                        <v-icon>mdi-filter</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon v-show="permissions('download')" @click="exportExcel">
                        <v-icon>mdi-download</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de clientes aún
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <v-list-item @click="editItem(item.editedItem)"  v-show="permissions('editClients')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item)"  v-show="permissions('deleteClients')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <!-- Ver más -->
            <template v-slot:[`item.view`]="{ item }">
                <div class="semaforo" :style="'background:' + item.activity_indicator + ';' "></div> <v-btn class="detail" icon :to="{ path: '/clients/client/'+ item.id}"><v-icon small> mdi-eye</v-icon></v-btn>
            </template>
            <template v-slot:[`item.name`]="{ item }">
                <strong>{{item.name}}</strong>
                <br>
                <span style="font-size:12px;" v-show="item.razon_social!=null && item.name.toLowerCase()!=item.razon_social.toLowerCase()">{{item.razon_social}}</span>
            </template >
        </v-data-table>
        <!-- Crear/Editar -->
        <v-dialog v-model="dialog" max-width="900px" @click:outside="closeDialog()">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="primary" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon>mdi-plus </v-icon>
            </v-btn> 
          </template>
          <input-form style="background-color:white;" v-bind:editedItem="editedItem" @closeDialog="closeDialog"/>
        </v-dialog>
        <!-- Eliminar -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar esta nomina?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteClient()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
    </v-container>
</template>

<script>
import axios from "axios";
import XLSX from 'xlsx';
import Filter from "../clients/filter"
import Form from "../clients/form"
export default {
    components: {
        'filterClients':Filter,
        'input-form':Form,
    }, 
    data: () => ({
        filters:false,
        editedItem:{},
        loading: true,
        options: {},
        sheet: false,
        dialog: false,
        deleteId:'',
        filterStorageLength:0,
    }),
    computed:{
        clients(){
            return this.$store.state.client.clients.map(id=>{
                return{
                    address: id.bank_account_information,
                    bank_account_information: id.bank_account_information,
                    cfdi: id.cfdi,
                    collections_agent: this.name(id.collections_agent),
                    contact_medium: id.contact_medium,
                    created_by: this.name(id.created_by),
                    email: id.email,
                    last_updated_by: this.name(id.last_updated_by),
                    name: id.name,
                    opportunity_area: id.opportunity_area,
                    payment_conditions: id.payment_conditions,
                    phone: id.phone,
                    razon_social: id.razon_social,
                    rfc: id.rfc,
                    sales_man: this.name(id.sales_man),
                    special_note: id.special_note,
                    type: id.type,
                    editedItem: [id].map(id=>{
                        return{
                            id:id.id,
                            address:id.address,
                            bank_account_information:id.bank_account_information,
                            cfdi:id.cfdi,
                            collections_agent_id:this.id(id.collections_agent),
                            contact_medium:id.contact_medium,
                            email:id.email,
                            name:id.name,
                            opportunity_area:id.opportunity_area,
                            payment_conditions:id.payment_conditions,
                            phone:id.phone,
                            razon_social:id.razon_social,
                            rfc:id.rfc,
                            sales_man_id:this.id(id.sales_man),
                            special_note:id.special_note,
                            type:id.type,
                            origin:id.origin,
                            status:id.status,
                            type:id.type,
                            contact_medium:id.contact_medium,
                            payment_method:id.payment_method,
                            users: [id.collections_agent, id.sales_man],
                            fiscal_address:id.fiscal_address
                        }
                    })[0]
                }
            });
        },
        totalClients(){return this.$store.state.client.total_items},
        statusesLists(){
            return this.$store.state.status.statuses
        },
        header(){ 
            return [
            { value: 'view', sortable: false, align: 'start', },
            { text: 'Nombre', value: 'name', width: '100%' },
            { text: 'Correo Electrónico', value: 'email' },
            { text: 'Teléfono', value: 'phone' },

            { text: 'Vendedor', value: 'sales_man' },
            { text: 'Agente de Cobranza', value: 'collections_agent' },

            //{ text: 'Dirección', value: 'address' },
            //{ text: 'Cuenta Bancaria', value: 'bank_account_information' },
            //{ text: 'CFDI', value: 'cfdi' },
            //{ text: 'Agente de Cobranza', value: 'collections_agent' },
            //{ text: 'Medio de Contacto', value: 'contact_medium' },
            { text: 'Creado por', value: 'created_by' },
            { text: 'Editado por', value: 'last_updated_by' },
            
            //{ text: 'Area de Oportunidad', value: 'opportunity_area' },
            //{ text: 'Conidiones de Pago', value: 'payment_conditions' },
            
            //{ text: 'Razón Social', value: 'razon_social' },
            //{ text: 'RFC', value: 'rfc' },
            
            //{ text: 'Nota Especial', value: 'special_note' },
            //{ text: 'Tipo', value: 'type' },
            { value: 'actions', sortable: false, align: 'end', },
        ]},
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
    },
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    methods:{
        getDataFromApi () {
            this.loading = true
            this.$store.dispatch('client/getClients', this.options).then(response => {
                this.filterStorageLength = localStorage.getItem('filtersSalesLength')
                //this.clients = this.mapClients(this.$store.state.client.clients)
                //this.totalClients = this.$store.state.client.total_items
                this.loading = response
            })
        },
        name(item){
            if(item!=undefined){
                return item.name
            }else{
                return ''
            }
        },
        id(item){
            if(item!=undefined){
                return item.id*1
            }else{
                return ''
            }
        },
        openFilter(){
            if(this.filters == false){
                this.$emit("closeDrawer", false);
                this.filters = true
            }else{
                this.$emit("closeDrawer", true);
                this.filters = false
            }
        },
        permissions(permission){
            if(this.currentUser.id==1){
                return true
            }else if(this.currentUser.permissions!=undefined){
                if(this.currentUser.permissions.includes(permission)){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        },
        filtersCompanies: function(params) {
            this.getDataFromApi()
        },
        closeDialog: function(params) {
            this.editedItem = {}
            this.dialog = false;
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.clients)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Nominas'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        deleteClient(){
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/clients/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.getDataFromApi()
            })
        },
        cancel(){
            this.deleteId = ''
            this.sheet = false
        },
        deleteItem (id) {
            this.deleteId = id
            this.sheet = true
        },
        editItem(editedItem){
            this.editedItem = editedItem
            this.dialog = true
        },
    },
}
</script>


<style>
    .v-data-table-header th {
        white-space: nowrap;
    }
    .semaforo{
        content: ' ';
        position: absolute;
        border-radius:50%;
    }
    @media(min-width: 980px){
        .semaforo{
            width: 8px;
            height: 8px;
            margin-top: 13px;
            margin-left: -10px;
        }
        .detail{
            transform: translateX(14px);
        }
    }
    @media(max-width: 980px){
        .semaforo {
            width: 12px;
            height: 12px;
            left: 9px;
            margin-left: 40px!important;
            margin-top: 20px!important;
        }
    }
</style>