var current_user;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
      current_user = user;

    }
    else {
    }
  })

function createGrid(filesDiv, nume_fisier, link_fisier, creator, descriere, rating, subject) {
    var singleFilesDiv = document.createElement('div');
    singleFilesDiv.id = "single-file-div";
    singleFilesDiv.style.maxWidth = '200px';
    
    
    // Creeaza elementul in care afisez numele fisierului ce duce la link
    var fileNameElem = document.createElement('a');
    var fileNameElemText = document.createTextNode(nume_fisier);
    fileNameElem.setAttribute('href', link_fisier);
    fileNameElem.setAttribute('target', "_blank");
    fileNameElem.appendChild(fileNameElemText);
    

    var subscribeDiv = document.createElement('div');
    // Creeaza elementul in care afisez numele celui care a postat fisierul
    var publisherNameElem = document.createElement('a');
    var publisherNameElemText = document.createTextNode(creator.split("@")[0]);
    publisherNameElem.appendChild(publisherNameElemText);
    
    // Verifica daca userul curent e deja abonat la creatorul postarii
    checkSubscription(creator).then(function (rc){
        if (!rc && (current_user.email != creator)) {
            
            var subscribeButton = document.createElement('button');
            subscribeButton.id = 'subscribe-button';
            
            subscribeButton.onclick = function(){subscribe(creator, subject)};
            
            var subscribeButtonText = document.createTextNode('Subscribe');
            subscribeButton.appendChild(subscribeButtonText);

            subscribeDiv.appendChild(publisherNameElem);
            
            subscribeDiv.appendChild(subscribeButton);
        } else {
            subscribeDiv.appendChild(publisherNameElem);
            
        }
    });

    

    // Creeaza elementul in care afisez descrierea fisierului
    var fileDescriptionElem = document.createElement('p');
    var fileDescriptionElemText = document.createTextNode(descriere);
    fileDescriptionElem.style.wordBreak = 'break-word';
    fileDescriptionElem.appendChild(fileDescriptionElemText);

    // Creeaza elementul in care afisez rating-ul fisierului
    var ratingElem = document.createElement('p');
    var ratingElemText = document.createTextNode('Rating: ' + rating + '/5');
    ratingElem.appendChild(ratingElemText);
    var img = document.createElement('img');
    img.src = 'https://i.ibb.co/JCgv0Dd/file.png';
    img.style.width = '60px';
    img.style.height = 'auto';
    singleFilesDiv.appendChild(img);
    singleFilesDiv.appendChild(fileNameElem);
    singleFilesDiv.appendChild(fileDescriptionElem);
    singleFilesDiv.appendChild(ratingElem);
    singleFilesDiv.appendChild(subscribeDiv);
    
    

    filesDiv.appendChild(singleFilesDiv);    
}

function getAllCategoryFiles(clicked_course) {

    // Arata doar fisierele din categoria selectata
    if (document.getElementById("file-div") != null) {
        document.getElementById("file-div").remove();
    }
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
                                createGrid(filesDiv, files[file].Name, files[file].Link, 
                                    files[file].Creator, files[file].Description, files[file].Rating, subject);                        
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

function subscribe(accountToSubscribe, subject) {
     console.log(current_user.email + " subscribed to " + accountToSubscribe);    

    firebase.firestore().collection("users").doc(current_user.email).update({
        Subscriptions: firebase.firestore.FieldValue.arrayUnion(accountToSubscribe)
    }).then(() => {
        //console.log("Document successfully written!");
        var dropDownElem = document.getElementById(subject);
        dropDownElem.click();
    });
    
    
}

function checkSubscription(accountToCheck) {

    var subscriptions = firebase.firestore().collection("users").doc(current_user.email);
    return subscriptions.get().then((doc) => {
        if (doc.exists) {
            if ((doc.data().Subscriptions).includes(accountToCheck)) {
               // console.log("already subscribed");
               return true;
                
            } else {
               // console.log("not subscribed yet");
                return false;
                
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    console.log(rc);
}
