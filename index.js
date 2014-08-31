
var rpcClient = require('./lib/client');
var axon = require('axon');
var fs = require('fs');

function dump(constants, client, cb) {
  client.call('getMonitorData', {}, function(err, list) {
    if (err) {
      console.error('Error retrieving process list: ' + err);
      return cb({msg:err});
    }
    var env_arr = [];

    function fin(err) {
      console.log('Processed dumped via old protocol');
      fs.writeFileSync(constants.DUMP_FILE_PATH, JSON.stringify(env_arr));
      return cb(null, {success:true, data : env_arr});
    }

    (function ex(apps) {
      if (!apps[0]) return fin(null);
      delete apps[0].pm2_env.instances;
      delete apps[0].pm2_env.pm_id;
      env_arr.push(apps[0].pm2_env);
      apps.shift();
      return ex(apps);
    })(list);
    return false;
  });
}

exports.fallback = function fallback(constants, cb) {
  var req = axon.socket('req');
  var client = new rpcClient(req);
  var t1;

  console.log('Launching update.....');
  client.sock.once('connect', function() {
    t1 = setTimeout(function() {
      client.sock.close();
      cb({online : true, msg: 'Recent PM2 protocol (>0.10x) aborting dumping procedure'});
    }, 4000);

    dump(constants, client, function(err, data) {
      clearTimeout(t1);

      client.call('killMe', {}, function() {
        setTimeout(function() {
          client.sock.close();
          return cb(err, data);
        }, 100);
      });
      return false;
      cb(err, data);
    });
  });

  client.sock.once('reconnect attempt', function() {
    client.sock.close();
    cb({online : false, msg : 'PM2 not reachable (offline)'});
  });

  req.connect(constants.DAEMON_RPC_PORT);
  return false;
};
