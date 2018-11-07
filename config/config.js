const convict = require('convict');

// Define schema
var defaultPort = process.env.PORT || 3000;

var config = convict({
  env: {
    doc: "Grandapp Application Environment",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },  
  db: {
    host: {
      doc: "Database host name/IP",
      format: '*',
      default: 'mongodb://localhost/ASW'
    }
  },
  server: {
    port: {
      doc: "Server PORT",
      format: '*',
      default: defaultPort
    },
    auth: {
      secret: "mysecretkeyetvoila"
    }
  } 
});

// Load environment dependent configuration
var env = config.get('env');
config.loadFile('./config/' + env + '.json');

// Perform validation
config.validate({allowed: 'strict'});
module.exports = config;