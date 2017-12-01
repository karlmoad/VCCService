const GitHubApi = require('github');

var configuration;
var github;

//initialize api connection params
function init(config){
    configuration = config;
    github = new GitHubApi(configuration.github.config);
    github.authenticate(configuration.github.authentication);
}

//Get commit history of repo content item
function getCommitHistory(path, ref){
    var p = {
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        path: path
    };

    if(ref){
        p['sha'] = ref
    }

    return github.repos.getCommits(p);
}

//Get the contents of a file or directory
function getContents(path, ref){    
    var p = {
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        path: path,
    };
    
    if(ref){
        p['ref'] = ref
    }

    return github.repos.getContent(p);
}

//Get a brach reference
function getBranch(branch="master"){
    return github.repos.getBranch({
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        branch: branch
    });
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
function getTreeForCommit(commitData){
    return github.gitdata.getTree({
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        sha: commitData.data.tree.sha
    });
}

//create blob object within the repo
function createBlob(fileMetadata){
    return github.gitdata.createBlob({
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        content: fileMetadata.content,
        encoding: 'base64'
    });
}

//Create a new tree item for a Blob reference
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

//Create a new commit for a tree reference
function createNewCommit(previousCommitData, treeData){
    return github.gitdata.createCommit({
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        tree: treeData.data.sha,
        message: 'save',
        parents: [previousCommitData.data.sha]
    });
}

//Repoin the HEAD of the branch to a commit reference
function repointBranchHEADReference(commitData, branch="master"){
    return github.gitdata.updateReference({
        owner: configuration.github.owner,
        repo: configuration.github.repo,
        ref: 'heads/' + branch,
        sha: commitData.data.sha,
        force: true
    });
}

//External interface function 
function commitFile(fileMetadata, branch=undefined){
    var headReference, previousCommit, previousTree, blobData, newTree, newCommit;

    return getHEADReference(branch)
    .then(result => {
        headReference = result;
        return getCommitForReference(headReference);
    }).then(result =>{
        previousCommit = result;
        return getTreeForCommit(previousCommit);
    }).then(result => {
        previousTree = result;
        return createBlob(fileMetadata);
    }).then(result => {
        blobData = result;
        return createNewBlobTree(blobData, previousTree, fileMetadata);
    }).then(result => {
        newTree = result;
        return createNewCommit(previousCommit, newTree);
    }).then(result => {
        newCommit = result;
        return repointBranchHEADReference(newCommit, branch);
    }).then(result => {
        return new Promise((resolve, reject)=>{
            resolve({success: true});
        });
    });
}


//get the  content item for the path associated to the supplied commit
function getCommitContent(commit, FileMetadata, branch){
    return getContents(FileMetadata.path, commit.sha)
    .then(result=>{
        return new Promise((resolve, reject) => {
            var out = fileMetadata;
            out["commit"] = {hash: item.sha, date: item.commit.committer.date};
            out["hash"] = result.data.sha;
            out["size"] = result.data.size;
            out["encoding"] = result.data.encoding;
            out["content"] = result.data.content

            resolve(out);
        });       
    });
}

//External interface function 
function getFile(fileMetadata, branch="master", history=false){
    if(history){
        return getCommitHistory(fileMetadata.path, branch).then(results=>{
            return Promise.all(results.data.map(item =>{
                return getCommitContent(item, fileMetadata, branch);
            }));
        }).then(results =>{
            console.log(results);
        }).catch(error => {
            console.log(error.message);
        });
    }else{
        return getContents(fileMetadata.path, branch).then(result=>{
            return new Promise((resolve, reject) => {
                var out = fileMetadata;
                out["hash"] = result.data.sha;
                out["size"] = result.data.size;
                out["encoding"] = result.data.encoding;
                out["content"] = result.data.content
                
                resolve(out);
            });
        });
    }
}

module.exports ={
    init : init,
    commit: commitFile,
    get : getFile
};