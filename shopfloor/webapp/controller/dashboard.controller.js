sap.ui.define([
    "shopfloor/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("shopfloor.controller.dashboard", {
        onNavigateToPlanned: function () {
            this.getOwnerComponent().getRouter().navTo("RouteplannedMonthWise");
        },

        onNavigateToProduction: function () {
            this.getOwnerComponent().getRouter().navTo("RouteproductionMonthWise");
        },

        onNavigateToPlannedYear: function () {
            this.getOwnerComponent().getRouter().navTo("RouteplannedYearWise");
        },

        onNavigateToProductionYear: function () {
            this.getOwnerComponent().getRouter().navTo("RouteproductionYearWise");
        }
    });
});
