sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
    ],
	function (Controller, JSONModel, MessageToast) {
		"use strict";
 
	return Controller.extend("sap.ui.demo.db.controller.App", {
	    onInit: function(){
            var oModel = new JSONModel("model/Clothing.json");
       
            this.getView().byId("TreeTableBasic").setModel(oModel);

	    },
        onCollapseAll: function () {
            var oTreeTable = this.getView().byId("TreeTableBasic");
            oTreeTable.collapseAll();
        },
 
        onExpandFirstLevel: function () {
            var oTreeTable = this.getView().byId("TreeTableBasic");
            oTreeTable.expandToLevel(2);
        },
        
        
	    handleUploadPress: function(oEvent){
			var oFileUploader = this.getView().byId("myFileUpload");
			MessageToast.show("fileUpload value = " + oFileUploader.getValue());
			if(!oFileUploader.getValue()) {
				MessageToast.show("Choose a file first");
				return;
			}
			oFileUploader.upload();
	    },
	    
	    
	    handleUploadComplete: function(oEvent){
			var sResponse = oEvent.getParameter("response");
			if (sResponse) {
				var sMsg = "";
				var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
				if (m[1] === "200") {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "SUCCESS" + "Upload Success";
					oEvent.getSource().setValue("");
				} else {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "ERROR" + "Upload Error";
				}
 				MessageToast.show(sMsg);
			}else{
			    MessageToast.show("Without Response");
			}        
	    },
	    
		formatMail: function(sFirstName, sLastName) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			return sap.m.URLHelper.normalizeEmail(
				sFirstName + "." + sLastName + "@example.com",
				oBundle.getText("mailSubject", [sFirstName]),
				oBundle.getText("mailBody"));
		},
 
		handleValueChange: function(oEvent) {
			MessageToast.show("Press 'Upload File' to upload file '" +
									oEvent.getParameter("newValue") + "'");
		}
	});
});