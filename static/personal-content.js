
// '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
$(window).on("load resize ", function() {
    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({'padding-right':scrollWidth});
  }).resize();

  // Populeaza grid-ul cand se incarca pagina de personal-content
 $(window).on("load", populatePersonalContentGrid());
 

 function computeRating(fileRated, creator) {
    var rateSelected = document.getElementsByName('dropdown/'+fileRated);
    console.log(rateSelected[0].value);
 }

  // filename, postedBy, description, reviews, data
  function addSubscribedFile(year, category_name, filename, postedBy, description, reviews, data, link_download, link_review) {

    var tbody = document.getElementById('cells');

    var tr = document.createElement('tr');
    var nume_fisier = document.createElement('td');
    var nume_fisier_text = document.createTextNode(filename);
    nume_fisier.appendChild(nume_fisier_text);

    var year_column = document.createElement('td');
    var year_column_text = document.createTextNode(year);
    year_column.appendChild(year_column_text);

    var category_column = document.createElement('td');
    var category_column_text = document.createTextNode(category_name);
    category_column.appendChild(category_column_text);

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

    // var add_review_column = document.createElement('td');
    // var add_review_column_a = document.createElement('a');
    // var add_review_column_a_text = document.createTextNode("Add Review");
    // add_review_column_a.setAttribute('href', link_review);
    // add_review_column_a.appendChild(add_review_column_a_text);
    // add_review_column.appendChild(add_review_column_a);
    var rating_dropdown_values = [0, 1, 2, 3, 4, 5];
    var add_rating_column = document.createElement('td');
    var rating_div = document.createElement('div');
    rating_div.id = 'rating-div';

    var add_rating_column_dropdown = document.createElement('select');
    add_rating_column_dropdown.id = 'rating-dropdown';
    add_rating_column_dropdown.name = 'dropdown/' + filename;
    add_rating_column_dropdown.style.color = "black";
    for (const val of rating_dropdown_values) {
      var option = document.createElement("option");
      option.value = val;
      option.text = val;
      add_rating_column_dropdown.appendChild(option);
    }
    
    var add_rating_button = document.createElement('button');
    add_rating_button.id = 'add-rating-button';
    add_rating_button.name = 'button/' + filename;
    add_rating_button.style.color = 'black';
    add_rating_button.onclick = function (){computeRating(filename, postedBy)};
    var add_rating_button_text = document.createTextNode('Add rating');
    add_rating_button.appendChild(add_rating_button_text);

    rating_div.appendChild(add_rating_column_dropdown);
    rating_div.appendChild(add_rating_button);

    add_rating_column.appendChild(rating_div);


    tr.appendChild(year_column);
    tr.appendChild(category_column);
    tr.appendChild(nume_fisier);
    tr.appendChild(nume_owner);
    tr.appendChild(description_column);
    tr.appendChild(review_column);
    tr.appendChild(data_column);
    tr.appendChild(download_column);
    // tr.appendChild(add_review_column);
    tr.appendChild(add_rating_column);
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
                          var year = getYearBySubject(category);
                          addSubscribedFile(year, category, files[file].Name, files[file].Creator, files[file].Description, files[file].Rating,
                               "TO DO", files[file].Link, "TO DO buton de add review");
                        }
                      }
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

  function getYearBySubject(subject) {
    switch(subject) {
      case "Utilizarea Sistemelor de Operare":
        return "Anul 1";
      case "Programarea Calculatoarelor":
        return "Anul 1";
      case "IOCLA":
        return "Anul 2";
      case "Calculatoare Numerice 2":
        return "Anul 3";     
    }
  }
