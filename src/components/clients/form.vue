<template>
    <v-card v-if="show" color="container_background">
        <v-card-title class="pb-0 pt-3 pb-2">
            <v-avatar small color="background" class="mr-4">
                <v-icon>mdi-domain</v-icon>
            </v-avatar>

            <span >{{title}} Empresa</span>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="6" md="4">
                <v-autocomplete v-if="permissions('assignCompanies')" outlined dense clearable v-model="company.sales_man_id" :hide-no-data="true" :items="usersList" :loading="loadings.users" :search-input.sync="searchUsers" item-value="id" item-text="name" label="Vendedor*" placeholder="Escribe para buscar" attach>
                    <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>    
                </v-autocomplete>
            </v-col>
        </v-card-title>
        <v-divider></v-divider>
        <v-stepper v-model="e1" class="elevation-0">
            <v-stepper-header class="elevation-0">
                <v-stepper-step :complete="e1 > 1" step="1"></v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="e1 > 2" step="2"></v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3"></v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1" class="pt-0">
                    <v-card-text class="pb-0 pt-0">
                        <v-container>
                            <v-row>
                                <v-col cols="12" class="py-0" sm="4" md="4">
                                    <v-text-field prepend-inner-icon="mdi-domain" :rules="[v => !!v || 'Campo requerido']" v-model="company.name" label="Nombre de Empresa*"></v-text-field>
                                </v-col>
                                <v-col cols="12" class="py-0" sm="4" md="4">
                                    <v-text-field type="number" v-model="company.phone" label="Teléfono"></v-text-field>
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="4" md="4">
                                    <v-text-field prepend-inner-icon="mdi-email" v-model="company.email" label="Correo Electrónico"></v-text-field>
                                </v-col>
                                
                            </v-row>
                            <v-row class="py-4">
                                <v-col class="py-0" cols="12" sm="6" md="6">
                                    <v-autocomplete outlined class="mt-3" dense rounded filled :rules="[v => !!v || 'Campo requerido']" clearable v-model="company.origin" :items="catalogs('Procedencias')" label="Procedencia*" item-text="name" item-value="name">
                                        <template slot="no-data" class="pa-2">No existen procedencias relacionadas.</template>                      
                                    </v-autocomplete>
                                </v-col>
                                <v-col class="py-0" cols="12" sm="6" md="6">
                                    <v-autocomplete outlined class="mt-3" dense rounded filled :rules="[v => !!v || 'Campo requerido']" clearable v-model="company.status" :items="catalogs('Status')" label="Estatus*" item-text="name" item-value="name">
                                        <template slot="no-data" class="pa-2">No existen estatus relacionados.</template>                      
                                    </v-autocomplete>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-stepper-content>
                <v-stepper-content step="2" class="pt-0">
                    <v-card-text class="pb-0 pt-0">
                        <strong>Condiciones Comerciales</strong>
                        <v-container>
                            <v-row class="mt-0">
                                <v-col class="pt-0" cols="12" sm="6" md="4">
                                    <v-text-field prepend-inner-icon="mdi-map-marker" class="mb-2" v-model="company.address" label="Dirección de Entrega"></v-text-field>
                                    <v-autocomplete outlined class="mt-3" dense clearable v-model="company.type" :items="catalogs('Tipo de Cliente')" label="Tipo de Cliente" item-text="name" item-value="name">
                                        <template slot="no-data" class="pa-2">No existen tipos relacionados.</template>                      
                                    </v-autocomplete>
                                    <v-autocomplete  outlined class="mt-3" dense clearable v-model="company.contact_medium" :items="catalogs('Medio de Contacto')" label="Medio de Contacto Preferido" item-text="name" item-value="name">
                                        <template slot="no-data" class="pa-2">No existen medios relacionados.</template>                      
                                    </v-autocomplete>
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="6" md="4">
                                    <v-textarea filled class="mt-4" v-model="company.opportunity_area" label="Area de Oportunidad"></v-textarea>
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="6" md="4">
                                     <v-textarea filled class="mt-4" v-model="company.special_note" label="Nota Especial"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-stepper-content>
                <v-stepper-content step="3" class="pt-0">
                    <v-card-text class="pb-0 pt-0">
                        <strong>Datos Fiscales</strong>
                        <v-container>
                            <v-row>
                                <v-col class="pt-0" cols="12" sm="6" md="4">
                                     <v-text-field v-model="company.razon_social" label="Razon Social"></v-text-field>
                                     <v-text-field v-model="company.rfc" label="RFC"></v-text-field>
                                     <v-text-field prepend-inner-icon="mdi-map-marker" v-model="company.fiscal_address" label="Dirección Fiscal"></v-text-field>
                                     <v-autocomplete outlined class="mt-4" dense clearable v-model="company.cfdi" :items="catalogs('CFDI')" label="Uso de CFDI" item-text="name" item-value="name">
                                        <template slot="no-data" class="pa-2">No existen usos relacionados.</template>                      
                                    </v-autocomplete>
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="6" md="4">
                                    <v-text-field v-model="company.bank_account_information.bank" label="Banco"></v-text-field>
                                    <v-text-field v-model="company.bank_account_information.account_number" label="Numero de Cuenta"></v-text-field>
                                    <v-autocomplete outlined class="mt-2" dense clearable v-model="company.payment_method" :items="catalogs('Método de Pago')" label="Método de Pago" item-text="name" item-value="name">
                                        <template slot="no-data" class="pa-2">No existen métodos relacionados.</template>                      
                                    </v-autocomplete>
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="6" md="4">
                                    <v-textarea filled class="mt-7"  v-model="company.payment_conditions" label="Condiciones de Pago"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
        <v-card-actions class="pr-6 pb-6">
            <v-spacer></v-spacer>
            <v-btn text @click="close">
                Cancelar
            </v-btn>
            <v-btn text color="primary" v-if="e1>1" @click="e1 = e1-1">
                <v-icon>mdi-chevron-left</v-icon>
                Regresar
            </v-btn>
            <v-btn color="primary" text  v-if="e1!=3" @click="e1 = e1+1" :disabled="grey">
                Siguiente
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn color="primary" class="px-3" @click="save" :loading="gris" :disabled="gris || grey">
                Guardar
            </v-btn>
        </v-card-actions>
    </v-card>
    <v-skeleton-loader
        v-else
        type="image"
    ></v-skeleton-loader>
</template>



<script>
    const initialState = () => {
        return {
            show:false,
            e1: 1,
            fiscales:false,
            gris:false,
            title:'',
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
            loadings:{
                users: false,
            },
            searchUsers:null,
            company:{}
        }
    };
    export default {
        props:{
            editedItem:Object
        },
        data: () => ( initialState() ),
        computed: {
            newCompany(){
                return {
                    address: '',
                    bank_account_information: {
                        bank:'',
                        account_number:'',
                    },
                    cfdi: '',
                    collections_agent_id: '',
                    contact_medium: '',
                    email: '',
                    name: '',
                    opportunity_area: '',
                    payment_conditions: '',
                    phone: '',
                    razon_social: '',
                    rfc: '',
                    sales_man_id: '',
                    special_note: '',
                    type: '',
                    origin:'',
                    status:'',
                    type:'',
                    contact_medium:'',
                    payment_method:'',
                    fiscal_address:''
                }
            },
            currentUser(){
                return this.$store.state.currentUser.user
            },
            grey(){
                if((this.company.name==''||this.company.name==null||this.company.name==undefined)||
                (this.company.origin==''||this.company.origin==null||this.company.origin==undefined)||
                (this.company.status==''||this.company.status==null||this.company.status==undefined)){
                    return true
                }else{
                    return false
                }
            },
            usersList(){
                return this.$store.state.user.users_result
            }
        },
        watch: {
            editedItem:{
                handler(){
                    this.start()
                }, deep:true
            },
            searchUsers(val){
                if (this.loadings.users) return
                this.loadings.users = true
                this.$store.dispatch('user/searchUsers', val).then(response => {this.loadings.users = response})
            },
        },
        created(){
            this.$store.dispatch('catalog/getCatalogs', '/clients').then(response=>{
                this.start()
            })
        },
        methods: {
            start(){
                if(this.editedItem.name!=undefined){
                    this.title = 'Editar'
                    this.$store.commit('user/setUsersToSearch', this.editedItem.users)
                    this.company = this.editedItem
                    if(this.company.bank_account_information==undefined){
                        this.company.bank_account_information = {
                            bank:'',
                            account_number:''
                        }
                    }
                }else{
                    this.title = 'Nueva'
                    this.company = this.newCompany
                }
                this.show = true
            },
            catalogs(name){
                var response = this.$store.state.catalog.catalogs.filter(catalog=>catalog.name == name)[0]
                if(response!=undefined){
                    return response.catalogs
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
            close () {
                this.$nextTick(() => {
                    this.$emit("closeDialog", false);
                })
            },
            save () {
                if(this.company.user_id==''||this.company.user_id==undefined||this.company.user_id==null){
                    this.company.user_id = this.currentUser.id
                }
                this.gris = true
                this.$nextTick(() => {
                    if(this.editedItem.name==undefined){
                        this.$store.dispatch('client/postClient', this.company).then(response=>{
                            if(response){
                                Object.assign(this.$data, initialState());
                            }else{
                                this.gris = false
                            }
                            this.close()
                        })
                    }else{
                        axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/clients/" + this.editedItem.id, this.company).then(response=>{
                            this.close()
                        })
                    }
                })
            },
        },
    }
</script>
