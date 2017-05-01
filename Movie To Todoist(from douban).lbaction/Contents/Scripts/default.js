const movieItemAPI = 'api.douban.com/v2/movie/subject/';
const movieSearchAPI = 'https://api.douban.com/v2/movie/search?q=';
const addTodoistTask = 'todoist://addtask?';

function runWithString(keyword) {
	try {
		var result = HTTP.get(movieSearchAPI + encodeURIComponent(keyword));
		var movieList = JSON.parse(result.data)['subjects'];

		var items = [];
		for (var movie of movieList) {
			items.push({
				'title': movie['title'],
				'alwaysShowsSubtitle': true,
				'subtitle': getSubtitle(movie),
				'label': getLabel(movie['rating']['average']),
				// 'children': getDetailItems(movie),
				'icon': 'movie.png',
				'url': addTaskURL(movie),
				'quickLookURL': movie['alt']
			})
		}

		if (items.length == 0)
			items.push({
				'title': 'no matched result.'
			})

		return items;
	} catch(e) {
		LaunchBar.log('ERROR: ' + e);
		LaunchBar.alert('ERROR: ' + e);
	}
}

function addTaskURL(movie) {
	var content = '[' + movie['title'] + ' - ' + movie['rating']['average']
				+ ']' + '(' + movie['alt'] + ')';
	var urlScheme = addTodoistTask + 'content=' + content;
	return urlScheme;
}

function getSubtitle(movie) {
	var director = (movie['directors'].length == 0) ? '' : movie['directors'][0]['name'];
	var year = movie['year'] + '年';
	return director + ', ' + year;
}

var sf = '✭', sb = '✩', lf = '★', lb = '☆';
function getLabel(rating) {
	var t = rating;
	var stars = '';
	while (t >= 2) {
		stars += lf;
		t -= 2;
	}
	while (t >= 1) {
		stars += lb;
		t -= 1;
	}
	return stars + ' ' + rating;
}

function getDetailItems(movie) {
	var items = [];

	items.push(
		{
			'title': 'Add to Todoist',
			'url': addTaskURL(movie),
			'icon': 'todoist.png'
		},
		{
			'title': movie['title'] + ' (豆瓣链接)',
			'url': movie['alt'],
			'icon': 'douban.png'
		}
	);

	return items;
}