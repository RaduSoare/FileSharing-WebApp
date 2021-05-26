
function showUploadSection() {
    var selectFileForm = document.getElementById("select-file-form");
    
    var myFilesSection = document.getElementById("my-files-section");
    
    myFilesSection.style.visibility = "hidden";
    // Delay pentru a nu se intercala cu sectiunea de upload
    setTimeout(() => {  selectFileForm.style.visibility = "visible"; }, 300);
    
    
    
}

// function showRemoveSection() {
//     var selectFileForm = document.getElementById("select-file-form");
//     var removeFileForm = document.getElementById("remove-file-form");
//     var myFilesSection = document.getElementById("my-files-section");
//     selectFileForm.style.visibility = "hidden";
//     myFilesSection.style.visibility = "hidden";
//     removeFileForm.style.visibility = "visible";
// }
var current_user;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        current_user = user;
    }
});

function removeFile(year, category,creator, filename) {
    console.log('delete');
    var fileRef = firebase.database().ref('content_files/' + creator.split(".")[0] + '/' +
                                        year + '/' + 
                                        category + '/' + 
                                        filename);
    
    // Sterge din DB
    fileRef.remove();
    //location.reload();
    // var showFileBtn = document.getElementById('show-my-files-navbar-item');
    // setTimeout(() => {  console.log("World!"); }, 5000);
    console.log(filename + " " + " a fost sters din DB");

    // Sterge din storage
    var storageFileRef = storage.ref("users_content/" + creator.split(".")[0] + "/" + filename + '.png');
    storageFileRef.delete().then(() => {
        console.log(filename + " " + " a fost sters din storage");
    }).catch((error) => {
        // an error occurred!
    });

    // Reapeleaza functia pentru a uploada fisierele curente (nu se mai dubleaza)
    showMyFilesSection();
}

function showFile(year, category, filename, creator, link) {
    
    var showFileSection = document.getElementById('my-files-section');
    
    var singleManageFilesDiv = document.createElement('div');
    singleManageFilesDiv.id = "single-manage-file-div";

    var fileNameElem = document.createElement('a');
    var fileNameElemText = document.createTextNode(filename);
    fileNameElem.setAttribute('href', link);
    fileNameElem.setAttribute('target', "_blank");
    fileNameElem.appendChild(fileNameElemText);

    var removeFileButton = document.createElement('button');
    removeFileButton.id = 'remove-file-button';
    
    removeFileButton.onclick = function(){removeFile(year, category,creator, filename)};
    
    var removeFileButtonText = document.createTextNode('Remove file');
    removeFileButton.appendChild(removeFileButtonText);

    singleManageFilesDiv.appendChild(fileNameElem);
    singleManageFilesDiv.appendChild(removeFileButton);

    showFileSection.appendChild(singleManageFilesDiv);
}

function showMyFilesSection() {
    var selectFileForm = document.getElementById("select-file-form");

    var myFilesSection = document.getElementById("my-files-section");
    selectFileForm.style.visibility = "hidden";
    // Hack ca sa curete sectiunea vechie de my file, inainte sa creeze una noua
    myFilesSection.innerHTML = "";
    myFilesSection.style.visibility = "visible";
    
    var userRef = firebase.database().ref('content_files/'+ current_user.email.split(".")[0] + '/');
    userRef.on('value', function(snapshot) {
        snapshot.forEach(function(childNodes) {
            var year = childNodes.key;
            var categories = childNodes.val();
            
            for (var category in categories) {
                var files = categories[category];
                for (var file in files) {
                    showFile(year, category, files[file].Name, files[file].Creator, files[file].Link);
                    //console.log(files[file].Name);
                }
               
            }
        });
    });
    //userRef.off();
}