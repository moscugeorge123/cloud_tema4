var http = require('https');

module.exports = {
    config: null,
    getLanguage: function(input){
        var request_params = {
            host: this.config.endpoint,
            method: 'POST',
            port: 443,
            path: '/text/analytics/v2.0/languages',
            headers: {
                'Ocp-Apim-Subscription-Key': this.config.key
            }
        };

        return new Promise((resolve, reject) => {
            var req = http.request(request_params, (res)=> {
                             
                if( res.statusCode > 300 ){
                    reject('Conection error: '+ res.statusCode);
                }

                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    resolve(chunk);
                });
            });
    
            req.write( JSON.stringify(input) );
            req.end();
        }); 
    },
    getEntities: function(input){
        var request_params = {
            host: this.config.endpoint,
            method: 'POST',
            port: 443,
            path: '/text/analytics/v2.0/entities',
            headers: {
                'Ocp-Apim-Subscription-Key': this.config.key
            }
        };

        return new Promise((resolve, reject) => {
            var req = http.request(request_params, (res)=> {
                
                if( res.statusCode > 300 ){
                    reject('Conection error: '+ res.statusCode);
                }
                
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    resolve(chunk);
                });
            });
    
            req.write( JSON.stringify(input) );
            req.end();
        });
    }, 
    getKeyPhrases: function(input){
        var request_params = {
            host: this.config.endpoint,
            method: 'POST',
            port: 443,
            path: '/text/analytics/v2.0/keyPhrases',
            headers: {
                'Ocp-Apim-Subscription-Key': this.config.key
            }
        };

        return new Promise((resolve, reject) => {
            var req = http.request(request_params, (res)=> {
     
                if( res.statusCode > 300 ){
                    reject('Conection error: '+ res.statusCode);
                }

                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    resolve(chunk);
                });
            });
    
            req.write( JSON.stringify(input) );
            req.end();
        });
    },
    getSentiment: function(input){
        var request_params = {
            host: this.config.endpoint,
            method: 'POST',
            port: 443,
            path: '/text/analytics/v2.0/sentiment',
            headers: {
                'Ocp-Apim-Subscription-Key': this.config.key
            }
        };

        return new Promise((resolve, reject) => {
            var req = http.request(request_params, (res)=> {
                                
                if( res.statusCode > 300 ){
                    reject('Conection error: '+ res.statusCode);
                }
                
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    resolve(chunk);
                });
            });

            req.write( JSON.stringify(input) );
            req.end();
        });
    }
};