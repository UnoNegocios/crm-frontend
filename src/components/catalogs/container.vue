<template>
  <v-container>
    <!-- tables -->
    <v-data-table
    v-for="(catalog, index) in catalogs" v-bind:key="index"
    :headers="headers"
    :items="catalog.catalogs"
    :items-per-page="catalog.catalogs.length"
    class="pa-4 mb-6"
    hide-default-footer>
        <!-- Header -->
        <template v-slot:top>
            <v-toolbar flat style="background:transparent;">
                <v-toolbar-title>{{catalog.name}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                @click="createItem(catalog)"
                class="mt-0 elevation-0"
                small>
                Agregar Nuevo</v-btn>
            </v-toolbar>
        </template>
        <!-- Actions -->
        <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon small @click="editItem(catalog, item)">
                <v-icon small>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small @click="deleteItem(catalog, item)">
                <v-icon small>mdi-delete</v-icon>
            </v-btn>
        </template>
    </v-data-table>
    <!-- Dialogos de creación/edición -->
    <v-dialog v-model="dialog" width="500" @click:outside="dialog=false, catalog='', catalog_item=''">
        <v-card>
            <!-- Titulo del dialogo -->
            <v-card-title>
                {{action_type}} de {{catalog.name}}
            </v-card-title>
            <v-divider></v-divider>
            <!-- Formulario -->
            <v-form>
                <v-row class="py-3 px-6">
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="newName" label="Categoría de Producto"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="8">
                        <v-card-actions class="pt-4">
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialog=false, catalog='', catalog_item=''">Cancelar</v-btn>
                            <v-btn color="blue darken-1" text @click="save" :loading="loader">Guardar</v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
    </v-dialog>
    <!-- Confirmación de eliminación -->
    <div class="text-center">
        <v-bottom-sheet v-model="sheet" inset @click:outside="sheet=false, catalog='', catalog_item=''">
            <v-sheet class="text-center" height="150px">
                <div class="pt-6">
                ¿Seguro que deseas borrar <strong>"{{catalog_item.name}}"</strong> del catálogo <strong>"{{catalog.name}}"</strong>?
                </div>
                <v-btn class="mt-4" text color="error" @click="save()" :loading="loader">
                Eliminar
                </v-btn>
                <v-btn class="mt-4" text color="grey" @click="sheet=false, catalog='', catalog_item=''">
                Cancelar
                </v-btn>
            </v-sheet>
        </v-bottom-sheet>
    </div>
  </v-container>
</template>

<script>
const initialState = () => {
    return {
        loader:false,
        dialog:false,
        catalog:'',
        catalog_item:'',
        action_type:'',
        loading:true,
        headers:[
            { text:'Nombre', value:'name' },
            { value: 'actions', sortable: false, align: 'end', },
        ],
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        sheet: false,
        newName:''
    }
}
export default {
    data: () => ( initialState() ),
    created(){
        this.getDataFromApi()
    },
    computed:{
        catalogs(){
            return this.$store.state.catalog.catalogs
        }
    },
    methods:{
        getDataFromApi () {
            this.loading = true
            this.$store.dispatch('catalog/getCatalogs', '').then(response => {
                this.loading = response
            })
        },
        editItem(catalog, item){
            this.action_type = 'Edición'
            this.dialog = true
            this.catalog = catalog
            this.catalog_item = item
            this.newName = item.name
        },
        deleteItem(catalog, item){
            this.action_type = 'Eliminación'
            this.sheet = true
            this.catalog = catalog
            this.catalog_item = item
        },
        createItem(catalog){
            this.action_type = 'Creación'
            this.dialog = true
            this.catalog = catalog
        },
        save(){
            this.loader = true
            if(this.action_type=='Edición'){
                var editedIndex = this.catalog.catalogs.indexOf(this.catalog_item)
                this.catalog.catalogs[editedIndex].name = this.newName
                this.patchCatalog()
            }
            else if(this.action_type=='Creación'){
                this.catalog.catalogs.push({name:this.newName})
                this.patchCatalog()
            }
            else if(this.action_type=='Eliminación'){
                var index = this.catalog.catalogs.indexOf(this.catalog_item)
                this.catalog.catalogs.splice(index, 1);
                this.patchCatalog()
            }
        },
        patchCatalog(){
            this.$store.dispatch('catalog/patchCatalogs', { id: this.catalog.id, editedItem: {catalogs: this.catalog.catalogs}, action_type: this.action_type }).then(response=>{
                if(response){
                    Object.assign(this.$data, initialState());
                }else{
                    this.loader = false
                }
            })
        }
    }
}
</script>