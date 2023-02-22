const searchTitle = document.getElementById("searchTitle");
const searchBarContainer = document.getElementById("searchBarContainer");
const searchCloseButton = document.getElementById("searchCloseButton");

searchTitle.addEventListener("click", function () {
  searchTitle.style.display = "none";
  searchBarContainer.style.display = "block";
  document.getElementById("searchBar").focus();
});

searchCloseButton.addEventListener("click", function () {
  searchTitle.style.display = "block";
  searchBarContainer.style.display = "none";
});

function myFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("searchBar");
  filter = input.value.toUpperCase();
  ul = document.getElementById("settmenu");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
