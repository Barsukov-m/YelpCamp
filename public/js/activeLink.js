const navbar = document.querySelector('.navbar-nav');
const path = window.location.pathname.split('/')[1];

if (path === 'campgrounds') {
	navbar.children[1].children[0].classList.add('active');
} else {
	navbar.children[0].children[0].classList.add('active');
}
