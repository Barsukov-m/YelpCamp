const getCampHTML = camp => {
	return `
		<a class="search__camp card link-reset" href="/campgrounds/${camp._id}">
			<div class="row g-0 h-100">
				<div class="col-8">
					<div class="card-body">
						<h5 class="card-title">${camp.title}</h5>

						<fieldset class="starability-basic">
							<input disabled type="radio" id="no-camp-${camp._id}-rate" class="input-no-rate" value=0 aria-label="No rating." ${camp.rating === 0 ? 'checked' : ''}>
							<input disabled type="radio" id="camp-${camp._id}-rate1" value="1" ${camp.rating === 1 ? 'checked' : ''}>
							<label for="camp-${camp._id}-rate1" title="Terrible">1 star</label>
							<input disabled type="radio" id="camp-${camp._id}-rate2" value="2" ${camp.rating === 2 ? 'checked' : ''}>
							<label for="camp-${camp._id}-rate2" title="Not good">2 stars</label>
							<input disabled type="radio" id="camp-${camp._id}-rate3" value="3" ${camp.rating === 3 ? 'checked' : ''}>
							<label for="camp-${camp._id}-rate3" title="Average">3 stars</label>
							<input disabled type="radio" id="camp-${camp._id}-rate4" value="4" ${camp.rating === 4 ? 'checked' : ''}>
							<label for="camp-${camp._id}-rate4" title="Very good">4 stars</label>
							<input disabled type="radio" id="camp-${camp._id}-rate5" value="5" ${camp.rating === 5 ? 'checked' : ''}>
							<label for="camp-${camp._id}-rate5" title="Amazing">5 stars</label>
						</fieldset>

						<p class="card-text">${camp.reviews.length} Review${camp.reviews.length !== 1 ? 's' : ''}</p>

						<p class="card-text"><strong>$${camp.price}</strong> / night</p>
					</div>
				</div>

				<div class="thumbnail__img-wrapper col-4 h-100 overflow-hidden">
					<img class="img-cover" src="${camp.images.length ? camp.images[0].path : '/img/placeholder.jpg'}">
				</div>
			</div>
		</a>
	`
}


const search = document.querySelector('#searchWidget');
const resultsWrapper = document.querySelector('.search__results');
const maxCampResult = 10;


search.addEventListener('input', async evt => {
	await fetch('/search', { method: 'POST' })
		.then((res) => res.json())
		.then(data => {
			const query = search.value;
			const queryRegex = new RegExp(`.*${query}.*`, 'i');

			resultsWrapper.classList.add('d-none');
			resultsWrapper.innerHTML = '';

			let campCounter = 0;
			data.forEach(camp => {
				if (campCounter >= maxCampResult || !query)
					return;

				if (queryRegex.exec(camp.title) || queryRegex.exec(camp.location)) {
					resultsWrapper.classList.remove('d-none');
					const campHTML = getCampHTML(camp);
					resultsWrapper.innerHTML += campHTML;
					campCounter++;
				}
			});
		})
		.catch(err => console.log(err))
});
