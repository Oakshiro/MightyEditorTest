this.config = {
	root: "../client",
	host: "85.31.102.56",
	port: 80,
	shutdownTimeout: 30,
	index: "index.rel.html",
	prefix: "p",
	servers: {
		p: "mightyeditor.mightyfingers.com",
		u: "us.mightyeditor.mightyfingers.com"
	}
};

// ensure we are working with right server
this.config.servers[this.config.prefix] = this.config.host + ":" + this.config.port;
