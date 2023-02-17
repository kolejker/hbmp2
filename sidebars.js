const leftSidebar = document.querySelector(".sidebar.left");
const rightSidebar = document.querySelector(".sidebar.right");
const player = document.querySelector(".content");

player.addEventListener("mouseenter", function () {
  leftSidebar.classList.remove("visible");
  rightSidebar.classList.remove("visible");
});

player.addEventListener("mouseleave", function () {
  leftSidebar.classList.add("visible");
  rightSidebar.classList.add("visible");
});
