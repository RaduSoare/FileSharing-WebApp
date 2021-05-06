
function getAllCategoryFiles(clicked_course) {

    // DIV care inglobeaza toate fisierele
    var filesDiv = document.createElement('div');
    filesDiv.id = "file-div";
    document.body.appendChild(filesDiv);



    var thisElem = document.getElementById(clicked_course);
    // Obtine subiectul dorit de user
    var userSubject = thisElem.textContent;
    // Obtine categoria dorita de user
    var userCategory = thisElem.parentElement.id;

    firebase.database().ref('content_files/').on('value', function(snapshot) {
        // Itereaza prin fiecare user
        snapshot.forEach(function(childNodes) {
            // Itereaza prin fiecare categorie (AN de studiu)
            var categories = childNodes.val();
            for (var category in categories) {
                if (category == userCategory) {
                    // Itereaza prin fiecare materie
                    var subjects = categories[category];
                    for (var subject in subjects) {
                        if (subject == userSubject) {
                            // Itereaza prin fiecare fisier de la materia respectiva
                            var files = subjects[subject];
                            for (var file in files) {
                                var singleFilesDiv = document.createElement('div');
                                singleFilesDiv.id = "single-file-div";

                                var fileNameElem = document.createElement('a');
                                var fileNameElemText = document.createTextNode(files[file].Name);
                                fileNameElem.setAttribute('href', files[file].Link);
                                fileNameElem.setAttribute('target', "_blank");
                                fileNameElem.appendChild(fileNameElemText);

                                var publisherNameElem = document.createElement('a');
                                var publisherNameElemText = document.createTextNode(files[file].Creator);
                                publisherNameElem.appendChild(publisherNameElemText);

                                var fileDescriptionElem = document.createElement('p');
                                var fileDescriptionElemText = document.createTextNode(files[file].Description);
                                fileDescriptionElem.appendChild(fileDescriptionElemText);

                                var ratingElem = document.createElement('p');
                                var ratingElemText = document.createTextNode('Rating: ' + files[file].Rating + '/5');
                                ratingElem.appendChild(ratingElemText);
                                
                                singleFilesDiv.appendChild(fileNameElem);
                                singleFilesDiv.appendChild(publisherNameElem);
                                singleFilesDiv.appendChild(fileDescriptionElem);
                                singleFilesDiv.appendChild(ratingElem);

                                filesDiv.appendChild(singleFilesDiv);
                                
                            }
                            // Nu are rost sa continue odata ce a gasit categoria
                            break;
                        }
                        
                    }
                }
                
                
            }
        });
    });
    
}