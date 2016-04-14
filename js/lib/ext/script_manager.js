/*
 * Script Manager Version 0.1.1
 *
 *  © 2016, Emmanuel ROCHE
 *  emmanuel.roche@rochedev.fr
 *
 *  Give modularity to your JavaScript application.
 *  Declare an entry('file.js', callbackToStart, timeMaxToLoadFiles);
 *  Call script dynamically with an include('mySuperFile.js');
 *
 *  MIT License
 *  
 *  Todo : gérer les extensions avec un tableau
 */

var Script = function(url){
    this.loaded = false;
    this.url = url;
    this.extension = null;
    
};

var Application = function(){
    
    var _scripts = [];
    var _main;
    
    this.entry = function(url, callback, timeout){
        setTimeout(function(){
            var result = _allScriptsLoaded();
            if(result !== true){
                console.error('[Error] TimedOut : Cannot load script : ' + result);
            }
        }, timeout);
        
        _main = function(e){
            _scriptLoaded(e.target.src);
            if(_allScriptsLoaded() === true){
                console.info('[Info] Start Application');
                callback();
                return;
            }
        };
        
        _addScript(url);
    };
    
    this.add = function(url){
        return _addScript(url);
    };
    
    var _addScript = function(url){
        
        //* si c'est déjà charger on sort
	for(var i = 0; i < _scripts.length; i++){
            if(_scripts[i].url === url){
//                console.info('[Info] GET* : '+_scripts[i].url+' -> already loaded!');
                return;
            }
	}
        
        console.info('[Info] GET+ : '+url);
        var js = document.createElement("script");
        js.type = 'text/javascript';
        js.src = url;
        js.onload = _main;
        document.body.appendChild(js);
        
        var currentScript = new Script(url);
        _scripts.push(currentScript);
        return currentScript;
    };
    
    var _allScriptsLoaded = function(){
        for(var i = 0; i < _scripts.length; i++){
            if(_scripts[i].loaded === false){
                //console.log('Script.'+_scripts[i].url+' : not loaded!');
                return _scripts[i].url;
            }
	}
        return true;
    };
    
    var _scriptLoaded = function(url){
        for(var i = 0; i < _scripts.length; i++){
            if(url.search(_scripts[i].url) !== -1){
                console.info('[Info] GET° : '+_scripts[i].url+' -> OK');
                _scripts[i].loaded = true;
                if(_scripts[i].extension){
                    _addScript(_scripts[i].extension);
                }
            }
	}
    };
};
Application = new Application();

var include = Application.add;
var main = Application.entry;

