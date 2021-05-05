
function getAllCategoryFiles(clicked_course) {

    var filesDiv = document.createElement('div');
    filesDiv.id = "file-div";
    document.body.appendChild(filesDiv);

    /* TODO */
    // Aici trebuie luat anul si materie din butonul apasat de user
    // Eu le voi hardcoda ca sa pot implementa functionalitatea

    var thisElem = document.getElementById(clicked_course);
    var userSubject = thisElem.textContent;

    // categoria trebuie ori dedusa din subiect din .json ori cumva luat din tag-ul parinte al subiectului

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
                                var elementA = document.createElement('a');
                                var elementAText = document.createTextNode(files[file].Name);
                                elementA.setAttribute('href', files[file].Link);
                                elementA.setAttribute('target', "_blank");
                                elementA.appendChild(elementAText);
                                filesDiv.appendChild(elementA);
                                
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