const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dns.promises
  .resolveSrv("_mongodb._tcp.cluster0.rhu1pd2.mongodb.net")
  .then(console.log)
  .catch(console.error);
