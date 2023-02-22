function changeStyle() {
  var styleSelector = document.getElementById("style-selector");
  var selectedStyle = styleSelector.value;

  var overrideCheckbox = document.getElementById("override-checkbox");
  var overrideStyles = overrideCheckbox.checked;

  if (selectedStyle) {
    if (overrideStyles) {
      var existingStyles = document.querySelectorAll(
        "link[rel='stylesheet'], style"
      );
      existingStyles.forEach(function (style) {
        style.remove();
      });
    }

    var newStyle = document.createElement("link");
    newStyle.setAttribute("rel", "stylesheet");
    newStyle.setAttribute("type", "text/css");
    newStyle.setAttribute("href", selectedStyle);
    document.head.appendChild(newStyle);
  }
}

function importCustomStyle() {
  var fileInput = document.getElementById("file-input");
  var files = fileInput.files;
  if (files.length > 0) {
    var file = files[0];
    var fileReader = new FileReader();
    fileReader.onload = function (e) {
      var newStyle = document.createElement("style");
      newStyle.setAttribute("type", "text/css");
      newStyle.innerHTML = e.target.result;
      document.head.appendChild(newStyle);
    };
    fileReader.readAsText(file);
  }
}
