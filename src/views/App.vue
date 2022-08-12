<template>
  <v-app>
    <!-- sidebar -->
    <v-navigation-drawer color="background" v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <!-- sidebar-menu -->
      <v-list class="pl-0 pr-4 pt-3 sidebar" dense> 
        <!-- menu items -->
        <v-list-item-group v-for="(menu, index) in menus" v-bind:key="index" active-class="primary--text text--accent-4">
            <v-expansion-panels v-if="menu.childs!=undefined" class="sinsombra" v-show="permissions(menu.permissions)">
                <v-expansion-panel style="background:transparent!important;">
                    <v-expansion-panel-header style="font-weight:500; font-size:0.8125rem;" class="px-4 py-0">
                    <div>
                        <v-icon class="mr-2">{{menu.icon}}</v-icon> 
                        {{menu.label}}
                    </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                    <!-- sub menu items -->
                    <div v-for="(child, index2) in menu.childs" v-bind:key="index2" v-show="permissions(child.permissions)">
                        <v-tooltip right open-delay="1000">
                            <template v-slot:activator="{ on, attrs }">
                            <v-list-item :to="child.link" link v-bind="attrs" v-on="on">
                                <v-list-item-action class="mr-3">
                                <v-icon>{{child.icon}}</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                <v-list-item-title>{{child.label}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            </template>
                            <span>{{child.tooltip}}</span>
                        </v-tooltip>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
            </v-expansion-panels>
            <v-tooltip v-else right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                <v-list-item :to="menu.link" link v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                    <v-icon>{{menu.icon}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                    <v-list-item-title>{{menu.label}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                </template>
                <span>{{menu.tooltip}}</span>
            </v-tooltip>
            <v-divider class="ma-4" v-if="menu.crop"></v-divider>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <v-switch v-model="dark"></v-switch>
        <div style=" font-size: 12px;" class="pa-2">
          UNOCRM | v5.0.0 <v-icon> mdi-settings</v-icon>
        </div>
      </template>
    </v-navigation-drawer>
    <!-- header -->
    <v-app-bar color="background" class="elevation-0 px-0" :clipped-left="$vuetify.breakpoint.lgAndUp" app><!-- box-shadow: 0px 0px 5px 0px rgb(112 112 115 / 30%)!important; -->
        <v-icon @click.stop="drawer = !drawer" class="mr-5"> mdi-menu</v-icon>
        <img style="height: 24px;" :src="logo">
        <v-spacer></v-spacer>  
        <!-- home button -->
        <v-btn class="hidden-sm-and-down pa-0" icon to="/" link>
          <v-icon>mdi-apps</v-icon>
        </v-btn>
        <!-- notification button -->
        <v-menu bottom left offset-y origin="top right" transition="scale-transition">
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon class="ml-2 mr-1" min-width="0" text v-bind="attrs" v-on="on">
              <v-badge overlap>
                <!--template v-slot:badge>
                  {{notes.length}}
                </template-->
                <v-icon>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <!-- dropdown notification -->
          <v-list dense>
            <v-list-item-group>
              <v-list-item to="/notes" link>
                <v-list-item-action>
                  <v-icon> mdi-clipboard-text</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <!--v-list-item-title>Notas ({{notes.length}})</v-list-item-title-->
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        <!-- account button -->
        <v-menu bottom left offset-y origin="top right" transition="scale-transition">
          <template v-slot:activator="{ attrs, on }">
            <v-btn class="ml-2 mr-1" text v-bind="attrs" v-on="on">
                <v-avatar size="32px">
                  <img :src="currentUser.profile_photo_url" >
                </v-avatar>
                <span class="hidden-sm-and-down" style="margin-left:10px; text-transform: initial; letter-spacing: 0px; font-size:16px; font-weight: 400;"> {{currentUser.name}} {{currentUser.last}}</span> <v-icon color="#707073">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <!-- dropdown account -->
          <v-list dense>
            <v-list-item-group>
              <v-list-item link to="/settings" >
                <v-list-item-action>
                  <v-icon> mdi-cog</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Ajustes</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item link @click="logout">
                <v-list-item-action>
                  <v-icon>mdi-power</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Cerrar Sesión</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              
            </v-list-item-group>
          </v-list>
        </v-menu>
    </v-app-bar>
    <!-- content -->
    <v-main class="pa-0" :style="{background: $vuetify.theme.themes[background_color].background}">
      <v-container class="pa-0" fluid>
          <router-view @closeDrawer="closeDrawer"></router-view>
      </v-container>
    </v-main>
    <v-snackbar :color="snackbar.color" v-model="snackbar.show">
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<!----------------------- Scripts ----------------------->
<script>
  export default {
    name: 'AppContainer',
    data: () => ({
      background_color:'light',
      logo:'https://unocrm.mx/wp-content/uploads/2020/08/unocrm_logo-1.svg',
      dark:false,
      drawer: true,
      attrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      },
    }),
    watch:{
      dark: {
        handler () {
            this.$vuetify.theme.dark = this.dark
            if(this.dark){
              this.logo = 'https://unocrm.mx/wp-content/uploads/2021/03/logo_unocrm.png'
              this.background_color = 'dark'
            }else{
              this.logo = 'https://unocrm.mx/wp-content/uploads/2020/08/unocrm_logo-1.svg'
              this.background_color = 'light'
            }
        },
        deep: true,
      },
    },
    methods:{
      closeDrawer: function(params) {
        this.drawer = params;
      },
      logout(){
        this.$store.dispatch('currentUser/logoutUser')
      },
      permissions(permission){
        return true
        /*
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
        */
      },      
    },
    computed:{
        snackbar(){
          return this.$store.state.snackbar.snackbar
        },
        menus(){
            return [
                {label:'Dashboard', link:'/', permissions:[''], icon:'mdi-view-dashboard', tooltip:'Pantalla de inicio', crop:false, childs:undefined},
                {label:'Reportes', link:'/reports', permissions:['reports'], icon:'mdi-chart-bar', tooltip:'Graficas mensuales y por día', crop:true, childs:undefined},
                {label:'Actividades', link:'', permissions:['activities'], icon:'mdi-format-list-checks', tooltip:'', crop:true, childs:[
                    {label:'Calendario', link:'/calendar', permissions:['activities'], icon:'mdi-calendar-multiple', tooltip:'Agenda de cotizaciónes en seguimiento'},
                    {label:'Actividades', link:'/activities', permissions:['activities'], icon:'mdi-checkbox-marked-outline', tooltip:'Lista de seguimientos de prospectos activos'},
                    {label:'Llamadas', link:'/calls', permissions:['calls'], icon:'mdi-calendar-multiple', tooltip:'Registro de llamadas call picker'},
                    //{label:'Mensajes', link:'/messages', permissions:['messages'], icon:'mdi-message-minus-outline', tooltip:'Registro de conversacóones en WhatsApp, Facebook Messenger y Chat en Línea'}
                ]},
                {label:'Clientes', link:'/clients', permissions:['companies'], icon:'mdi-account-multiple', tooltip:'Lista de empresas a las que se les ha cotizado/vendido', crop:false, childs:undefined},
                {label:'Prospectos', link:'/leads', permissions:['leads'], icon:'mdi-account-multiple-plus', tooltip:'Lista de prospectos provenientes de redes, página web, etc.', crop:true, childs:undefined},
                {label:'Ventas y Cobranza', link:'', permissions:['sales', 'collections'], icon:'mdi-currency-usd', tooltip:'Lista de ventas y sus cobros', crop:true, childs:[
                    {label:'Cotizaciones', link:'/quotations', permissions:['quotations'], icon:'mdi-file-outline', tooltip:'Prospectos de venta'},
                    {label:'Ventas', link:'/sales', permissions:['quotations'], icon:'mdi-currency-usd', tooltip:'Lista de ventas cerradas'},
                    {label:'Cobranza', link:'/collections', permissions:['collections'], icon:'mdi-cash-plus', tooltip:'Lista de cobranzas'},
                    //{label:'Saldos Vencidos', link:'/balances', permissions:['balances'], icon:'mdi-account-clock-outline', tooltip:'Lista de clientes con adeudos vencidos'},
                    {label:'Cancelaciones', link:'/cancelations', permissions:['canceled'], icon:'mdi-close-circle-outline', tooltip:'Cotizaciones que no se cerraron por algun motivo'},
                    //{label:'Ferretería', link:'/ferreteria', permissions:['ferreteria'], icon:'mdi-tools', tooltip:'Remisiones y Facturas MACRO'},
                ]},
                //{label:'Gastos', link:'/expenses', permissions:['expenses'], icon:'mdi-currency-usd-off', tooltip:'Lista de gastos', crop:true, childs:undefined},
                //{label:'Compras', link:'', permissions:['shoppings'], icon:'mdi-cart', tooltip:'Lista de compras, proveedores y pagos', crop:true, childs:[
                    //{label:'Compras', link:'/shoppings', permissions:['shoppings'], icon:'mdi-cart-outline', tooltip:'Lista de compras realizadas'},
                    //{label:'Proveedores', link:'/providers', permissions:['providers'], icon:'mdi-account-multiple', tooltip:'Lista de proveedores'},
                    //{label:'Pagos Proveedores', link:'/provider-payments', permissions:['provider_payments'], icon:'mdi-cash-check', tooltip:'Lista de pagos a proveedores'},
                //]},
                //{label:'Producción', link:'/production', permissions:['productions'], icon:'mdi-account-network', tooltip:'Lista de producciones', crop:true, childs:undefined},
                {label:'Catálogo de Productos', link:'/products', permissions:[''], icon:'mdi-palette-swatch', tooltip:'Catálogo de Productos para Vendedores', crop:true, childs:undefined},
                //{label:'Inventario', link:'', permissions:['inventory'], icon:'mdi-format-list-bulleted', tooltip:'Lista de Productos e Insumos con inventarios', crop:true, childs:[
                    //{label:'Inventario', link:'/inventary', permissions:['inventory'], icon:'mdi-format-list-bulleted', tooltip:'Lista de Productos e Insumos'},
                    //{label:'Materia Prima', link:'/raw-material', permissions:['raw_material'], icon:'mdi-apps', tooltip:'Lista de materiales que componen los productos'},
                    //{label:'Ajustes', link:'/adjustments', permissions:['adjustments'], icon:'mdi-tools', tooltip:'Lista de ajustes a insumos'},
                    //{label:'Inventario Físico', link:'/physical-inventory', permissions:['physical_inventories'], icon:'mdi-clipboard-check-outline', tooltip:'Lista de ajustes a productos'},
                    //{label:'Movimientos', link:'/inventory-reports', permissions:['report_inventory'], icon:'mdi-transit-connection-horizontal', tooltip:'Tabla de movimientos de inventario'},
                //]},
                //{label:'Administración', link:'', permissions:['pay_rolls', 'utilities'], icon:'mdi-file-document-multiple-outline', tooltip:'Utilidades y Nominas', crop:true, childs:[
                    //{label:'Nominas', link:'/payroll', permissions:['pay_rolls'], icon:'mdi-account-cash-outline', tooltip:'Lista de nominas'},
                    //{label:'Utilidades', link:'/utilities', permissions:['report_inventory'], icon:'mdi-cash-plus', tooltip:'Lista de productos vendidos por ventas, comparativa entre costos y precios'},
                //]},
                {label:'Bitacoras', link:'/activity-log', permissions:['activityLog'], icon:'mdi-clipboard-text', tooltip:'Registro de altas y cambios', crop:false, childs:undefined}
            ]
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        }
    },
  }
</script>


<!-- Styles -->      
<style>
  .v-navigation-drawer__border{
    display:none!important;
  }
  .sidebar .v-list-item.v-list-item--link.theme--light:hover,
  .sidebar .v-list-item--active,
  .sidebar .theme--light.v-list-item--active:hover::before, 
  .theme--light.v-list-item--active::before,
  .sidebar .theme--light.v-list-item:hover::before,
  .sidebar .v-list-item.v-list-item--link.theme--dark:hover,
  .sidebar .theme--ligdarkht.v-list-item--active:hover::before, 
  .theme--dark.v-list-item--active::before,
  .sidebar .theme--dark.v-list-item:hover::before{
    border-radius: 0px 20px 20px 0px!important;
  }
  .v-window__prev, .v-window__next {
    background: transparent!important;;
  }
  .v-carousel__controls{
    display:none!important;
  }
  .sinsombra .v-expansion-panel::before{
    box-shadow: none!important;
  }
  .v-application--wrap{
    max-height: calc(100vh - 64px)!important;
    min-height: calc(100vh - 64px)!important;
  }
</style>