  // Get the sidebars
  const leftSidebar = document.querySelector('.sidebar.left');
  const rightSidebar = document.querySelector('.sidebar.right');
  const player = document.querySelector('.content');
  
  // Hide sidebars when mouse is in player part
  player.addEventListener('mouseenter', function() {
    leftSidebar.classList.remove('visible');
    rightSidebar.classList.remove('visible');
  });
  
  // Show sidebars when mouse is outside of player part
  player.addEventListener('mouseleave', function() {
    leftSidebar.classList.add('visible');
    rightSidebar.classList.add('visible');
  });