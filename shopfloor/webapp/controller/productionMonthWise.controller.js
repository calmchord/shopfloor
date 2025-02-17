sap.ui.define([
    "shopfloor/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, MessageToast) {
    "use strict";
    return BaseController.extend("shopfloor.controller.productionMonthWise", {
        onInit: function () {
            // Initialize JSONModel for the view
            var oModel = new JSONModel();
            this.getView().setModel(oModel, "productionMonthWise");

            // Initialize JSONModel for dropdowns
            var oDropdownModel = new JSONModel({
                selectedPlant: "1000",
                selectedYear: "2024",
                selectedMonth: "05",
                years: [
                    { key: "2023", text: "2023" },
                    { key: "2024", text: "2024" },
                    { key: "2025", text: "2025" }
                ],
                months: [
                    { key: "01", text: "January" },
                    { key: "02", text: "February" },
                    { key: "03", text: "March" },
                    { key: "04", text: "April" },
                    { key: "05", text: "May" },
                    { key: "06", text: "June" },
                    { key: "07", text: "July" },
                    { key: "08", text: "August" },
                    { key: "09", text: "September" },
                    { key: "10", text: "October" },
                    { key: "11", text: "November" },
                    { key: "12", text: "December" }
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
                    oData.selectedMonth = "01";
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
            var sMonth = oData.selectedMonth;

            // Basic validation
            if (!sPlant || !sYear || !sMonth) {
                MessageToast.show("Please fill all filters");
                return;
            }
            if (sPlant.length !== 4 || sYear.length !== 4 || sMonth.length !== 2) {
                MessageToast.show("Plant/Year/Month format invalid");
                return;
            }

            // Build OData URL
            var sServiceUrl = "/sap/opu/odata/SAP/Z_SIRAJ_ODATA_SF_SRV/";
            var sEntitySet = "ZFM_PRORD_MONTHSet";
            var sFilters = "?$filter=(Month eq '" + sMonth +
                "' and Year eq '" + sYear +
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
                        that.getView().getModel("productionMonthWise").setData(oData.d.results);
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