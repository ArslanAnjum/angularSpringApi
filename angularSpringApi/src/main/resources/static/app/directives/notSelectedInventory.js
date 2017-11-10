'use strict';

app.filter('notSelectedInventory',function(){
	
	return function(inventories,selectedInventories){

		if (selectedInventories === undefined || selectedInventories === null)
			return inventories;
	
		var inv = [];
		var sinv = [];
		angular.copy(inventories, inv);
		angular.copy(selectedInventories,sinv);
		
		for (var i=0;i<inv.length;i++){
			for (var j=0;j<sinv.length;j++){
				if (inv[i].inventoryId === sinv[j].inventory.inventoryId){
					inv.splice(i,1);
					sinv.splice(j,1);
					break;
				}
			}
		}
		$('select.applyMaterialSelect').material_select();
		return inv;
	}
})