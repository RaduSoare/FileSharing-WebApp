var current_user;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
      current_user = user;

    }
    else {
    }
  })

function createGrid(nume_fisier, link_fisier, creator, descriere, rating) {
    var div_py = document.createElement('div');
    div_py.className = "py-5"

    var div_container = document.createElement('div');
    div_container.className = "container";
    div_py.appendChild(div_container);

    var div_row = document.createElement('div');
    div_row.className = "row hidden-md-up";
    div_py.appendChild(div_row);

    var div_col = document.createElement('div');
    div_col.className="col-md-4";
    div_row.appendChild(div_col);

    var div_card = document.createElement('div');
    div_card.className = "card";
    div_col.appendChild(div_card);

    var div_card_block = document.createElement('div');
    div_card_block.className = "card-block";
    div_card.appendChild(div_card_block);



    var nume = document.createElement('a');
    nume.setAttribute('href', link_fisier); 
    nume.setAttribute('target', "_blank"); 
    nume.className = "card-link";
    var text_nume = document.createTextNode(nume_fisier);
    nume.appendChild(text_nume);
    div_card_block.appendChild(nume);


    var h_card_subtitle = document.createElement('h4');
    h_card_subtitle.className = "card-subtitle text-muted";
    var text1 = document.createTextNode(creator);
    h_card_subtitle.appendChild(text1);
    div_card_block.appendChild(h_card_subtitle);

    var par = document.createElement('p');
    par.className = "card-text p-y-1";
    var text2 = document.createTextNode(descriere);
    par.appendChild(text2);
    div_card_block.appendChild(par);

    var par = document.createElement('p');
    par.className = "card-text p-y-1";
    var text2 = document.createTextNode('Rating: ' + rating + '/5');
    par.appendChild(text2);
    div_card_block.appendChild(par);

    document.body.appendChild(div_py);

}

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
                                // var singleFilesDiv = document.createElement('div');
                                // singleFilesDiv.id = "single-file-div";

                                // var fileNameElem = document.createElement('a');
                                // var fileNameElemText = document.createTextNode(files[file].Name);
                                // fileNameElem.setAttribute('href', files[file].Link);
                                // fileNameElem.setAttribute('target', "_blank");
                                // fileNameElem.appendChild(fileNameElemText);

                                // var publisherNameElem = document.createElement('a');
                                // var publisherNameElemText = document.createTextNode(files[file].Creator);
                                // publisherNameElem.appendChild(publisherNameElemText);

                                // var fileDescriptionElem = document.createElement('p');
                                // var fileDescriptionElemText = document.createTextNode(files[file].Description);
                                // fileDescriptionElem.appendChild(fileDescriptionElemText);

                                // var ratingElem = document.createElement('p');
                                // var ratingElemText = document.createTextNode('Rating: ' + files[file].Rating + '/5');
                                // ratingElem.appendChild(ratingElemText);
                                
                                // singleFilesDiv.appendChild(fileNameElem);
                                // singleFilesDiv.appendChild(publisherNameElem);
                                // singleFilesDiv.appendChild(fileDescriptionElem);
                                // singleFilesDiv.appendChild(ratingElem);
                                var singleFilesDiv = document.createElement('div');
                                singleFilesDiv.id = "single-file-div";
                                
                                // Creeaza elementul in care afisez numele fisierului ce duce la link
                                var fileNameElem = document.createElement('a');
                                var fileNameElemText = document.createTextNode(files[file].Name);
                                fileNameElem.setAttribute('href', files[file].Link);
                                fileNameElem.setAttribute('target', "_blank");
                                fileNameElem.appendChild(fileNameElemText);
                                

                                var subscribeDiv = document.createElement('div');
                                // Creeaza elementul in care afisez numele celui care a postat fisierul
                                var publisherNameElem = document.createElement('a');
                                var publisherNameElemText = document.createTextNode(files[file].Creator);
                                publisherNameElem.appendChild(publisherNameElemText);
                                
                                var subscribeButton = document.createElement('button');
                                subscribeButton.id = 'subscribe-button';
                                subscribeButton.onclick = function(){subscribe(files[file].Creator)};
                                
                                var subscribeButtonText = document.createTextNode('Subscribe');
                                subscribeButton.appendChild(subscribeButtonText);

                                subscribeDiv.appendChild(publisherNameElem);
                                
                                subscribeDiv.appendChild(subscribeButton);

                                // Creeaza elementul in care afisez descrierea fisierului
                                var fileDescriptionElem = document.createElement('p');
                                var fileDescriptionElemText = document.createTextNode(files[file].Description);
                                fileDescriptionElem.appendChild(fileDescriptionElemText);

                                // Creeaza elementul in care afisez rating-ul fisierului
                                var ratingElem = document.createElement('p');
                                var ratingElemText = document.createTextNode('Rating: ' + files[file].Rating + '/5');
                                ratingElem.appendChild(ratingElemText);
                                
                                singleFilesDiv.appendChild(fileNameElem);
                                //singleFilesDiv.appendChild(publisherNameElem);
                                //singleFilesDiv.appendChild(subscribeButton);
                                singleFilesDiv.appendChild(subscribeDiv);
                                singleFilesDiv.appendChild(fileDescriptionElem);
                                singleFilesDiv.appendChild(ratingElem);
                                
                                

                                // filesDiv.appendChild(singleFilesDiv);
                                // createGrid(files[file].Name, files[file].Link, files[file].Creator, files[file].Description, files[file].Rating);
                                
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

function subscribe(accountToSubscribe) {
     console.log(current_user.email + " subscribed to " + accountToSubscribe);
    
    // firebase.database().ref('subscriptions/' + current_user.email.split(".")[0]).set({
    //                 accountToSubscribe: ""
    //             });

    
    

    firebase.firestore().collection("users").doc(current_user.email).update({
        Subscriptions: firebase.firestore.FieldValue.arrayUnion(accountToSubscribe)
    }).then(() => {
        console.log("Document successfully written!");
    });
    
}

function checkSubscription(accountToCheck) {
    let rc = false;
    var subscriptions = firebase.firestore().collection("users").doc(current_user.email);
    subscriptions.get().then((doc) => {
        if (doc.exists) {
            if ((doc.data().Subscriptions).includes(accountToCheck)) {
                console.log("already subscribed");
                rc = true;
                
            } else {
                console.log("not subscribed yet");
                rc = false;
                
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
