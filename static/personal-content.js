// '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
$(window).on("load resize ", function() {
    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({'padding-right':scrollWidth});
  }).resize();

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
