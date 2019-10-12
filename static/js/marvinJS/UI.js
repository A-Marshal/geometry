var UI = new Object();

UI.genDocMethodItem = function(name, parameters, description, examplePage, index){
	
	var html = "<div style='margin-bottom:20px;'>\
					<font class='method_font'>Marvin."+name+"(</font>"+parameters+"<font class='method_font'>)</font>\
					<div>\
					<div class='method_description'>"+description+"</div>";
					
	if(examplePage != null){
		html +=		"<div id='example_"+index+"' class='flipDocExample'>Example</div>\
					<div id='panel_"+index+"' class='example_panel'>\
					<div id='content_"+index+"' class='example_frame'></div>\
					<div id='hide_"+index+"'>Hide</div>";
	}
	html += "</div>";
				
	return html;
}