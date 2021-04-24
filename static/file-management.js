function showUploadSection() {
    var selectFileForm = document.getElementById("select-file-form");
    var removeFileForm = document.getElementById("remove-file-form");
    removeFileForm.style.visibility = "hidden";
    selectFileForm.style.visibility = "visible";
    
}

function showRemoveSection() {
    var selectFileForm = document.getElementById("select-file-form");
    var removeFileForm = document.getElementById("remove-file-form");
    selectFileForm.style.visibility = "hidden";
    removeFileForm.style.visibility = "visible";

    

}