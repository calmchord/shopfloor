/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "shopfloor/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("shopfloor.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // Call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
            
                // Enable routing
                this.getRouter().initialize();
            
                // Set the device model
                this.setModel(models.createDeviceModel(), "device");
            
                // Initialize session model for authentication
                var oSessionModel = new sap.ui.model.json.JSONModel({
                    isAuthenticated: false, // Default: Not authenticated
                    customerId: ""
                });
                this.setModel(oSessionModel, "session");
            
                // Add route protection
                this.getRouter().attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
            },
            
            onBeforeRouteMatched: function (oEvent) {
                var oSessionModel = this.getModel("session");
                var isAuthenticated = oSessionModel.getProperty("/isAuthenticated");
            
                var sRouteName = oEvent.getParameter("name");
            
                if (!isAuthenticated && sRouteName !== "login") {
                    console.log("Unauthorized access to", sRouteName, "- Redirecting to login.");
            
                    var oRouter = this.getRouter();
                    oRouter.navTo("Routelogin");
            
                    // 🔥 Force UI update (Delays execution to ensure redirect)
                    setTimeout(function () {
                        location.reload();  // 🔄 Force reload to apply session changes
                    }, 100);
                }
            }
            
            
        });
    }
);