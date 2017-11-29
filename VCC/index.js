var configuration;
var wrapper;

function init(config){
    configuration = config;

    switch(configuration.type.toLowerCase()){
        case 'github':
            wrapper = require("./github")
            wrapper.init(configuration);
            break;
        default:
            throw("Not Implemented");
    }
}

function commitFile(fileMetadata, branch=undefined){
    return wrapper.commit(fileMetadata, branch);
}

function getFile(fileMetadata, branch=undefined, history=false){
    return wrapper.get(fileMetadata, branch, history);
}

module.exports ={
    init : init,
    commit: commitFile,
    get : getFile
};