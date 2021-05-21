
// '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
$(window).on("load resize ", function() {
    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({'padding-right':scrollWidth});
  }).resize();

  // Populeaza grid-ul cand se incarca pagina de personal-content
 $(window).on("load", populatePersonalContentGrid());
 

 function computeRating(fileRated, creator, year, category) {
    var rateSelected = document.getElementsByName('dropdown/'+fileRated);
   // console.log(year + " " + category);
    var fileRef = firebase.database().ref('content_files/' + creator.split(".")[0] + '/' +
                                          year + '/' + category + '/');

    var old_rating;
    var old_count;
    // Obtine vechea valoare din Rating
    fileRef.child(fileRated).once('value', (snapshot) => {
      old_rating = snapshot.val().Rating;
      old_count = snapshot.val().RatingCount;
    });
    
    // Updateaza valoarea in DB
    var new_rating = old_rating + Number(rateSelected[0].value);
    fileRef.child(fileRated).update({'Rating': new_rating});
    fileRef.child(fileRated).update({'RatingCount': old_count + 1});

    
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        var imgRef = firebase.database().ref('content_files/' + creator.split(".")[0] + '/' +
                                        year + '/' + category + '/' + fileRated + '/');
        imgRef.child('Reviewers').update({[user.email.split(".")[0]] : 0});
        imgRef.off();
      }
    });
    
    
    
    // Refresh la pagina pentru a se vedea modificarea
    location.reload();
    

 }




  // filename, postedBy, description, reviews, data
  function addSubscribedFile(year, category_name, filename, postedBy, description, rating, rating_count, data, link_download, link_review) {

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

    var rating_column = document.createElement('td');
    rating_column.id = 'rating-column';
    var score = rating_count == 0 ? rating : rating/rating_count;
    var rating_column_text = document.createTextNode(score.toFixed(2));
    rating_column.appendChild(rating_column_text);

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


    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        var imgRef = firebase.database().ref('content_files/' + postedBy.split(".")[0] + '/' 
                                        + year + '/' + category_name + '/' + filename + '/' + 'Reviewers' + '/' 
                                        + user.email.split(".")[0]);
        imgRef.once('value', snapshot => {
          if (snapshot.exists()) {
            //console.log(filename + 'already rated');
            document.getElementsByName('dropdown/' + filename)[0].setAttribute('disabled', 'true');
            document.getElementsByName('button/' + filename)[0].setAttribute('disabled', 'true');
          } else {
            //console.log(filename + 'not rated');
          }
        });
        imgRef.off();
      }
    });

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
    add_rating_button.onclick = function (){computeRating(filename, postedBy, year, category_name)};
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
    tr.appendChild(rating_column);
    tr.appendChild(data_column);
    tr.appendChild(download_column);
    // tr.appendChild(add_rating_column);
    tr.appendChild(add_rating_column);
    tbody.appendChild(tr);
  }

  function getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
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
                      var year = childNodes.key;
                      
                      for (var category in categories) {
                        //console.log(category);
                        var files = categories[category];
                        for (var file in files) {
                          addSubscribedFile(year, category, files[file].Name, files[file].Creator, files[file].Description, files[file].Rating,
                              files[file].RatingCount, getTodayDate(), files[file].Link, "TO DO buton de add review");
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

  function sort() {
    var columns = document.getElementById("columns");
    var columnNo = columns.value;
    column_no = parseInt(columnNo);
    sortTable(column_no);
  }

  function sortTable(column_no) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("myTable");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 0; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("td")[column_no];
        y = rows[i + 1].getElementsByTagName("td")[column_no];
        // Check if the two rows should switch place:
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

  function searchFunc() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[2];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }


