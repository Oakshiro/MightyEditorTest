/**
 * usage new MT.ui.Input(MT.events, key, object);
 */

"use strict";

MT.require("ui.ColorPicker");
MT.extend("ui.DomElement").extend("core.Emitter")(
	MT.ui.Input = function(ui, properties, obj){
		var events = ui.events;
		MT.ui.DomElement.call(this);
		MT.core.Emitter.call(this);
		
		
		this.object = obj;
		this.key = "";
		this.step = 1;
		
		this.min = -Infinity;
		this.max = Infinity;
		
		this.type = "number";
		
		if(typeof properties === "string"){
			this.key = properties;
		}
		else{
			this.key = properties.key;
			this.step = properties.step || this.step;
			if(properties.min != void(0)){
				this.min = properties.min;
			}
			if(properties.max != void(0)){
				this.max = properties.max;
			}
			if(properties.type != void(0)){
				this.type = properties.type;
			}
		}
		
		// create button? 
		if(this.type == "bool"){
			this.type = "number";
			this.min =  0;
			this.max =  1;
			this.step = 1;
		}
		
		if(this.type == "number"){
			this.addClass("ui-input-number");
		}
		
		
		this.label = new MT.ui.DomElement();
		//this.label.setAbsolute();
		
		this.addChild(this.label).show();
		
		
		
		
		this.input = document.createElement("input");
		this.addClass("ui-input");
		
		
		this.label.el.innerHTML = this.key;
		this.label.style.bottom = "initial";
		this.label.style.right = "50%";
		
		
		this.value = new MT.ui.DomElement("a");
		//this.value.setAbsolute();
		
		
		var that = this;
		if(this.type == "upload"){
			this.input.type = "file";
			this.addClass("upload");
			if(properties.accept){
				this.input.setAttribute("accept", properties.accept);
			}
			this.input.onchange = function(e){
				that.emit("change", e, that.object);
			};
			
			this.label.style.right = "0";
			this.label.el.onclick = function(e){
				that.input.click();
			};
			if(this.object[this.key] !== void(0)){
				this.setValue(this.object[this.key], true);
				this.addChild(this.value).show();
				this.value.style.bottom = "initial";
				this.value.style.left = "initial";
				this.value.style.right = 0;
				this.value.addClass("ui-input-value");
			}
			return;
		}
		
		
		
		this.addChild(this.value).show();
		this.value.style.bottom = "initial";
		this.value.style.left = "initial";
		this.value.style.right = 0;
		this.value.addClass("ui-input-value");
		if(this.type == "color"){
			this.value.style.float = "right";
			this.value.style.position = "relative";
			this.span = document.createElement("span");
			this.el.appendChild(this.span);
			this.span.className = "ui-input-color-pick";
			this.span.style.backgroundColor = this.object[this.key];
			
			var that = this;
			this.span.onclick = function(){
				ui.colorPicker.setColor(that.object[that.key]);
				ui.colorPicker.show();
				ui.colorPicker.on("change", function(val){
					that.setValue(val);
				});
			};
		}
		
		this.setValue(this.object[this.key], true);
		this.setTabIndex();
		
		this.events = events;
		
		
		var input = document.createElement("input");
		//input.style.position = "absolute";
		input.type = "text";
		input.className = "ui-input";
		input.isVisible = false;
		input.style.textAlign = "right";
		input.style.paddingRight = "10px";
		
		input.setAttribute("tabindex", parseInt(this.value.el.getAttribute("tabindex")) +1);
		//input.setAttribute("tabstop", "false");
		
		var enableInput = function(){
			var w = that.value.el.parentNode.parentNode.offsetWidth*0.5;
			input.style.width = w + "px";
			
			input.style.top = ( that.value.calcOffsetY(that.value.el.offsetParent) - 9 ) + "px";
			input.style.left = ( that.value.calcOffsetX(that.value.el.offsetParent) - w + that.value.el.offsetWidth - 25) + "px";
			input.value = that.object[that.key];
			
			input.isVisible = true;
			input.width = that.value.offsetWidth + "px";
			
			
			that.value.el.innerHTML = "";
			
			that.value.el.offsetParent.appendChild(input);
			input.focus();
			if(input.type != "color"){
				input.setSelectionRange(0, input.value.length);
			}
		};
		
		this.value.el.onkeydown = function(){
			enableInput();
		};
		
		this.value.el.setAttribute("draggable", "false");
		
		//this.value.el.onfocus = enableInput;
		this.value.el.onmouseup = function(){
			if(that.needEnalbe){
				enableInput();
			}
		}
		this.enableInput = function(){
			enableInput();
		};
		var down = false;
		this.value.el.onmousedown = function(){
			that.needEnalbe = true;
			down = true;
		};
		
		
		var startVal;
		input.onfocus = function(){
			startVal = that.object[that.key];
		};
		
		input.onblur = function(){
			input.parentNode.removeChild(input);
			input.isVisible = false;
			
			var val = that.evalValue(input.value);
			that.setValue(val);
			that.emit("change", val, val);
		};
		
		input.onkeydown = function(e){
			if(e.which == MT.keys.DELETE){
				e.stopPropagation();
			}
			if(e.which == MT.keys.ESC){
				
				input.value = startVal;
				input.blur();
				e.stopPropagation();
			}
		};
		
		
		input.onkeyup = function(e){
			if(!input.isVisible){
				return;
			}
			var w = e.which;
			var hideval = true;
			
			if(w == MT.keys.ESC){
				
				hideval = false;
				input.value = that.object[that.key];
				e.stopPropagation();
				input.blur();
			}
			
			if(w == MT.keys.ENTER){
				
				hideval = false;
				e.stopPropagation();
				input.blur();
			}
			
			if(that.object[that.key] != input.value){
				var val = that.evalValue(input.value);
				that.setValue(val, true);
				if(hideval){
					that.value.el.innerHTML = "";
				}
			}
		};
		
		//this.keyup = events.on("keyup", 
		
		if(this.type == "number"){
		
			this.onwheel = events.on("wheel", function(e){
				if(e.target !== that.value.el){
					return;
				}
				e.preventDefault();
				var d = ( (e.wheelDelta || -e.deltaY) > 0 ? 1 : -1);
				var val = that.object[that.key] + d*that.step;
				that.setValue(val);
			});
			
			this.mouseup = events.on("mouseup",function(){
				down = false;
				that.needEnalbe = false;
			});
			
			this.mousemove = events.on("mousemove",function(e){
				if(!down){
					return;
				}
				var val = that.object[that.key] - events.mouse.my*that.step;
				that.setValue(val, false);
			});
		}
	},
	{
		remove: function(){
			this.events.off(this.mousemove);
			this.events.off(this.mouseup);
			this.events.off(this.keyup);
			this.events.off(this.onwheel);
			if(this.el.parentNode){
				this.el.parentNode.removeChild(this.el);
			}
		},
		
		update: function(){
			this.setValue(this.object[this.key], true);
		},
		
		setObject: function(obj, show){
			
			this.object = obj;
			this.update();
			if(show){
				this.show();
			}
		},
		
		setValue: function(val, silent){
			if(this.type == "upload"){
				return;
			}
			
			
			this.needEnalbe = false;
			var oldValue = this.object[this.key];
			
			if(val == oldValue && !silent){
				this.value.el.innerHTML = val;
				return;
			}
			if(val < this.min){
				val = this.min;
			}
			
			if(val > this.max){
				val = this.max;
			}
			
			
			
			
			
			this.object[this.key] = val;
			
			if(typeof val == "number"){
				this.value.el.innerHTML = parseFloat(val.toFixed(8));
			}
			else{
				this.value.el.innerHTML = val;
			}
			if(this.type == "color"){
				this.span.style.backgroundColor = val;
			}
			if(!silent){
				this.emit("change", val, oldValue);
			}
		},
		
		evalValue: function(val){
			if(this.type != "number"){
				return val;
			}
			var ret = null;
			try{
				ret = eval(val);
			}
			catch(e){
				ret = val;
			}
			
			
			return ret;
		},
		
		setTabIndex: function(){
			MT.ui.Input.tabindex += 1;
			this.value.el.setAttribute("tabindex", MT.ui.Input.tabindex);
			this.value.el.setAttribute("href", "javascript:;");
			//this.value.el.setAttribute("tabstop", "true");
		}
		
		
		
		
		
		
	}
);
MT.ui.Input.tabindex = 0;


