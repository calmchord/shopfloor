sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("shopfloor.controller.login", {
        onInit: function () {
            // Initialize the login model
            var oModel = new JSONModel({
                customerId: "",
                password: ""
            });
            this.getView().setModel(oModel);
        },

        onLogin: function () {
            var oModel = this.getView().getModel();
            var sCustomerId = oModel.getProperty("/customerId");
            var sPassword = oModel.getProperty("/password");

            // Input validation
            if (!sCustomerId || !sPassword) {
                MessageBox.error("Please enter both Customer ID and Password");
                return;
            }

            // Get OData model
            var oDataModel = this.getOwnerComponent().getModel();

            // Construct the URL for login check
            var sPath = `/ZFM_SF_LOGIN_SIRAJSet(CustomerId='${sCustomerId}',Password='${sPassword}')`;

            // Show loading indicator
            sap.ui.core.BusyIndicator.show(0);

            // Call the OData service
            oDataModel.read(sPath, {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();

                    if (oData.Response === "CORRECT") {
                        // Store user info in session
                        var oSessionModel = this.getOwnerComponent().getModel("session");
                        oSessionModel.setProperty("/isAuthenticated", true);
                        oSessionModel.setProperty("/customerId", sCustomerId);

                        // Navigate to home page
                        var oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("Routedashboard");
                    } else if (oData.Response === "NO") {
                        MessageBox.error("User not found. Please check your credentials.");
                    } else {
                        MessageBox.error("Invalid credentials. Please try again.");
                    }
                }.bind(this),
                error: function (_oError) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("Login failed. Please try again later.");
                }
            });
        }
    });
});