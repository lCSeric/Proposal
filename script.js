document.getElementById('nextNavButton').addEventListener('click', function() {
  var currentNavItem = document.querySelector('.nav-menu a:hover');
  var nextNavItem = currentNavItem.parentElement.nextElementSibling;
  if (nextNavItem) {
      window.location.href = nextNavItem.querySelector('a').getAttribute('href');
  }
})
