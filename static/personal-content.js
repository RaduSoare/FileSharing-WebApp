
// '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
$(window).on("load resize ", function() {
    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({'padding-right':scrollWidth});
  }).resize();

  // Populeaza grid-ul cand se incarca pagina de personal-content
 $(window).on("load", populatePersonalContentGrid());
 

 

  // filename, postedBy, description, reviews, data
  function addSubscribedFile(filename, postedBy, description, reviews, data, link_download, link_review) {

    var tbody = document.getElementById('cells');

    var tr = document.createElement('tr');
    var nume_fisier = document.createElement('td');
    var nume_fisier_text = document.createTextNode(filename);
    nume_fisier.appendChild(nume_fisier_text);

    var nume_owner = document.createElement('td');
    var nume_owner_text = document.createTextNode(postedBy);
    nume_owner.appendChild(nume_owner_text);

    var description_column = document.createElement('td');
    var description_column_text = document.createTextNode(description);
    description_column.appendChild(description_column_text);

    var review_column = document.createElement('td');
    var review_column_text = document.createTextNode(reviews);
    review_column.appendChild(review_column_text);

    var data_column = document.createElement('td');
    var data_column_text = document.createTextNode(data);
    data_column.appendChild(data_column_text);

    var download_column = document.createElement('td');
    var download_column_a = document.createElement('a');
    download_column_a.setAttribute('target', "_blank");
    var download_column_a_text = document.createTextNode("Download");
    download_column_a.setAttribute('href', link_download);
    download_column_a.appendChild(download_column_a_text);
    download_column.appendChild(download_column_a);

    var add_review_column = document.createElement('td');
    var add_review_column_a = document.createElement('a');
    var add_review_column_a_text = document.createTextNode("Add Review");
    add_review_column_a.setAttribute('href', link_review);
    add_review_column_a.appendChild(add_review_column_a_text);
    add_review_column.appendChild(add_review_column_a);

    tr.appendChild(nume_fisier);
    tr.appendChild(nume_owner);
    tr.appendChild(description_column);
    tr.appendChild(review_column);
    tr.appendChild(data_column);
    tr.appendChild(download_column);
    tr.appendChild(add_review_column);
    tbody.appendChild(tr);
  }

  

  function populatePersonalContentGrid() {
  
    // Obtine userul curent
    firebase.auth().onAuthStateChanged(user => {
        if (user) {

          // Obtine datele userului curent
          var userRef = firebase.firestore().collection("users").doc(user.email);
          userRef.get().then((doc) => {
            if (doc.exists) {
                // Obtine lista de useri la care userul curent e abonat
                var subscriptionsList = doc.data().Subscriptions;
                for (var account in subscriptionsList) {
                  console.log(subscriptionsList[account].split(".")[0]);
                  firebase.database().ref('content_files/' + subscriptionsList[account].split(".")[0] + '/').on('value', function(snapshot) {
                    snapshot.forEach(function(childNodes) {
                      var categories = childNodes.val();
                      
                      for (var category in categories) {
                        var files = categories[category];
                        for (var file in files) {
                          addSubscribedFile(files[file].Name, files[file].Creator, files[file].Description, files[file].Rating,
                               "TO DO", files[file].Link, "TO DO buton de add review");
                        }
                      }
                      // for (var category in categories) {
                      //   // Itereaza prin fiecare materie
                      //   var subjects = categories[category];
                      //   for (var subject in subjects) {
                            
                      //     // Itereaza prin fiecare fisier de la materia respectiva
                      //     var files = subjects[subject];
                      //     for (var file in files) {
                      //         // createGrid(filesDiv, files[file].Name, files[file].Link, 
                      //         //     files[file].Creator, files[file].Description, files[file].Rating);
                      //         // addSubscribedFile(files[file].Name, files[file].Creator, files[file].Description, files[file].Rating,
                      //         //   "TO DO", files[file].Link, "TO DO buton de add review")        
                      //         console.log(files[file].Name);              
                      //     }
                      //   }
                      // }
                    });
                  });
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        }
    });
    
    
  }
