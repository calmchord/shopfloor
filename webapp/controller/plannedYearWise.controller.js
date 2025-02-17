sap.ui.define([
    "shopfloor/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, MessageToast) {
    "use strict";
    return BaseController.extend("shopfloor.controller.plannedYearWise", {
        onInit: function () {
            // Initialize JSONModel for the view
            var oModel = new JSONModel();
            this.getView().setModel(oModel, "plannedYearWise");

            // Initialize JSONModel for dropdowns
            var oDropdownModel = new JSONModel({
                selectedPlant: "0001",
                selectedYear: "2023",
                years: [
                    { key: "2023", text: "2023" },
                    { key: "2024", text: "2024" },
                    { key: "2025", text: "2025" }
                ]
            });
            this.getView().setModel(oDropdownModel, "dropdowns");

            // Initial data fetch after view is loaded
            this.getView().attachEventOnce("afterRendering", function() {
                this._fetchData();
            }.bind(this));
        },

        onBeforeRendering: function() {
            var oDropdownModel = this.getView().getModel("dropdowns");
            if (oDropdownModel) {
                // Ensure default values are set
                var oData = oDropdownModel.getData();
                if (!oData.selectedPlant) {
                    oData.selectedPlant = "0001";
                    oData.selectedYear = "2023";
                    oDropdownModel.setData(oData);
                }
            }
        },

        onFetchData: function () {
            this._fetchData();
        },

        _fetchData: function () {
            var oDropdownModel = this.getView().getModel("dropdowns");
            if (!oDropdownModel) {
                MessageToast.show("Model not initialized");
                return;
            }

            var oData = oDropdownModel.getData();
            var sPlant = oData.selectedPlant;
            var sYear = oData.selectedYear;

            // Basic validation
            if (!sPlant || !sYear) {
                MessageToast.show("Please fill all filters");
                return;
            }
            if (sPlant.length !== 4 || sYear.length !== 4) {
                MessageToast.show("Plant/Year format invalid");
                return;
            }

            // Build OData URL
            var sServiceUrl = "/sap/opu/odata/SAP/Z_SIRAJ_ODATA_SF_SRV/";
            var sEntitySet = "ZFM_PLORD_YEARSet";
            var sFilters = "?$filter=(Year eq '" + sYear +
                "' and Plant eq '" + sPlant +
                "')&$format=json";
            var sUrl = sServiceUrl + sEntitySet + sFilters;

            // Fetch data
            var that = this;
            $.ajax({
                url: sUrl,
                type: "GET",
                dataType: "json",
                success: function (oData) {
                    if (oData?.d?.results) {
                        that.getView().getModel("plannedYearWise").setData(oData.d.results);
                    } else {
                        MessageToast.show("No data found");
                    }
                },
                error: function (oError) {
                    MessageToast.show("Error fetching data");
                    console.error(oError);
                }
            });
        }
    });
});