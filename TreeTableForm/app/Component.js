sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/scn/demo/db/model/models",
	"sap/ui/commons/FileUploader",
	"sap/m/Tree",
	"sap/ui/table/TreeTable"
], function(UIComponent, Device, models, FileUploader, Tree, TreeTable) {
	"use strict";

	return UIComponent.extend("com.scn.demo.db.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// new function readFile to tranform TreeData and setModelData
			var flatData = this.readFile();
			var deepData = this.transformTreeData(flatData);
			this.setModelData(deepData);

			//int for Uploader Start

		},
		
		readFile: function() {

			var flatData = null;
			//load the data from the JSON file
			//NB same format as gateway service could be
			var inModel = new sap.ui.model.json.JSONModel();
			inModel.loadData("/app/model/FlatData.json", "", false);

			var data = inModel.getData();

			if (data) {
				flatData = data.nodes;
			}

			return flatData;
		},

		transformTreeData: function(nodesIn) {

			var nodes = []; //'deep' object structure
			var nodeMap = {}; //'map', each node is an attribute

			if (nodesIn) {

				var nodeOut;
				var parentId;

				for (var i = 0; i < nodesIn.length; i++) {
					var nodeIn = nodesIn[i];
					nodeOut = {
						id: nodeIn.ID,
						text: nodeIn.Text,
						type: nodeIn.Type,
						children: []
					};

					parentId = nodeIn.ParentID;

					if (parentId && parentId.length > 0) {
						//we have a parent, add the node there
						//NB because object references are used, changing the node
						//in the nodeMap changes it in the nodes array too
						//(we rely on parents always appearing before their children)
						var parent = nodeMap[nodeIn.ParentID];

						if (parent) {
							parent.children.push(nodeOut);
						}
					} else {
						//there is no parent, must be top level
						nodes.push(nodeOut);
					}

					//add the node to the node map, which is a simple 1-level list of all nodes

					nodeMap[nodeOut.id] = nodeOut;

				}

			}

			return nodes;
		},

		setModelData: function(nodes) {
			//store the nodes in the JSON model, so the view can access them
			var nodesModel = new sap.ui.model.json.JSONModel();
			nodesModel.setData({
				nodeRoot: {
					children: nodes

				}
			});
			this.setModel(nodesModel, "nodeModel");
		}
	});
});