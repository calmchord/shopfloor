sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("shopfloor.controller.BaseController", {
        
        // Navigate to Home
        onNavHome: function () {
            this.getOwnerComponent().getRouter().navTo("Routedashboard");
        },

        // Logout Function
        onLogout: function () {
            var oSessionModel = this.getOwnerComponent().getModel("session");

            // Reset authentication state
            oSessionModel.setProperty("/isAuthenticated", false);
            oSessionModel.setProperty("/customerId", "");

            // Redirect to Login Page
            this.getOwnerComponent().getRouter().navTo("Routelogin");

            // Force UI refresh to apply session changes
            setTimeout(() => location.reload(), 100);
        }
    });
});
