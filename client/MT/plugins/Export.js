MT.extend("core.Emitter").extend("core.BasicPlugin")(
	MT.plugins.Export = function(project){
		MT.core.BasicPlugin.call(this, "Export");
		this.project = project;
		
	},
	{
		initUI: function(ui){
			var that = this;
			this.list = new MT.ui.List([
				{
					label: "Phaser.io (.js)",
					className: "",
					cb: function(){
						that.export("phaser", function(data){
							window.location = that.project.path + "/"+ data.file;
						});
					}
				},
				{
					label: "Phaser.io (data only) js",
					className: "",
					cb: function(){
						that.export("phaserDataOnly", function(data){
							that.openDataLink(data, "js");
						});
					}
				},
				{
					label: "Phaser.io (data only) json",
					className: "",
					cb: function(){
						that.export("phaserDataOnly", function(data){
							that.openDataLink(data, "json");
						});
					}
				}
			
			], ui, true);
			
			var b = this.button= this.project.panel.addButton("Export", null, function(e){
				that.showList();
			});
			
			this.openGame = this.project.panel.addButton("Open Game", null, function(e){
				that.openLink();
			});
			
			//this.list.removeHeader();
			//this.list.content.overflow = "initial";
			
		},
		
		export: function(dest, data, cb){
			if(typeof data == "function"){
				cb = data;
				data = null;
			}
			this.send(dest, data);
			this.once("done", cb);
		},
		
		showList: function(){
			this.list.width = 250;
			this.list.y = this.button.el.offsetHeight;
			this.list.x = this.button.el.offsetLeft-5;
			this.list.el.style.bottom = "initial";
			this.list.show(document.body);
		},
		
		openDataLink: function(data, json){
			if(json == "json"){
				data.file += "on";
			}
			var w = window.innerWidth*0.5;
			var h = window.innerHeight*0.8;
			var l = (window.innerWidth - w)*0.5;
			var t = (window.innerHeight - h)*0.5;
			
			window.open(this.project.path + "/" + data.file,"","width="+w+",height="+h+",left="+l+",top="+t+"");
		},
		
		openLink: function(){
			var w = window.open("about:blank",Date.now());
			w.opener = null;
			
			var path = this.project.path;
			this.export("phaser", function(data){
				if(w.location){
					w.location.href = path + "/phaser/index.html";
				}
			});
			
		},
		
		a_complete: function(data){
			this.emit("done", data);
		}
		
	}
);