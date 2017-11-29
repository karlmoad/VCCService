var GitHubApi = require('github');

var configuration;
var github;

function init(config){
    configuration = config;
    github = new GitHubApi(configuration.github.config);
    github.authenticate(configuration.github.authentication);
}

// Get a reference object to which the branch head points
function getHEADReference(branch = "master"){
    return github.gitdata.getReference({
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        ref: 'heads/' + branch
    });
}

// Get the commit object to which the reference points 
function getCommitForReference(referenceData){
    return github.gitdata.getCommit({
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        sha: referenceData.data.object.sha
    });
}

//Get the Tree to which a commit belongs
function getTreeOfCommit(commitData){
    return github.gitdata.getTree({
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        sha: commitData.data.tree.sha
    });
}

function createBlob(fileMetadata){
    return github.gitdata.createBlob({
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        content: fileMetadata.content,
        encoding: 'base64'
    });
}

function createNewBlobTree(blobData, baseTree, fileMetadata){
    return github.gitdata.createTree({
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        tree: [
            {
                path:  fileMetadata.path,
                mode: '100644',
                type: 'blob',
                sha: blobData.data.sha
            }
        ],
        base_tree: baseTree.data.sha 
    });
}

function createNewCommit(previousCommitData, treeData){
    return github.gitdata.createCommit({
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        tree: treeData.data.sha,
        message: 'save',
        parents: [previousCommitData.data.sha]
    });
}

function repointBranchHEADReference(commitData, branch="master"){
    return github.gitdata.updateReference({
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        ref: 'heads/' + branch,
        sha: commitData.data.sha,
        force: true
    });
}

function commitFile(fileMetadata, branch=undefined){
    return getHEADReference(branch)
        .then(headReference => {
            getCommitForReference(headReference);
        }).then(previousCommit =>{
            getTreeOfCommit(previousCommit);
        }).then(previousTree => {
            putBlob(fileMetadata);
        }).then(blobData, previousTree, fileMetadata => {
            createNewBlobTree(blobData, previousTree, fileMetadata);
        }).then(newTree, previousCommit => {
            createNewCommit(previousCommit, newTree);
        }).then(newCommit, branch => {
            repointBranchHEADReference(newCommit, branch);
        }).then(result => {
            return new Promise(function(resolve, reject){
                resolve({success: true});
            });
        });
}

function getFile(fileMetadata, branch=undefined, history=false){
    console.log("In git getFile function");
}

module.exports ={
    init : init,
    commit: commitFile,
    get : getFile
};