const reviews = document.querySelectorAll('.reviews__review-content');

reviews.forEach(review => {
	const editBtn = review.querySelector('.reviews__editBtn') || null;
	const reviewTitle = review.querySelector('.reviews__review-title').innerText;
	const reviewText = review.querySelector('.reviews__review-text').innerText;
	const rating = review.firstElementChild;

	if (editBtn)
		editBtn.addEventListener('click', () => {
			review.innerHTML = `
				<div class="reviews__rating mb-2">
					${rating.innerHTML}
				</div>

				<div class="mb-3">
					<input class="form-control" type="text" placeholder="Describe this campground in a few words" minlength=2 maxlength=100 name="title" value="${reviewTitle}" required>
				</div>

				<div class="mb-3">
					<textarea class="form-control" placeholder="Say something about this campground" minlength=3 maxlength=1000 rows=4 wrap="hard" name="body" required>${reviewText}</textarea>
				</div>

				<div class="btn-group">
					<button class="btn btn-sm btn-secondary" type="submit">Submit</button>
					<button class="reviews__cancelBtn btn btn-sm btn-outline-danger" type="button">Cancel</button>
				</div>
			`;

			const cancelBtn = review.querySelector('.reviews__cancelBtn');
			review.querySelectorAll('.starability-basic input').forEach(input => input.disabled = 0);

			cancelBtn.addEventListener('click', () => {
				// refresh the page
				window.location.reload();
			})
		});
});
