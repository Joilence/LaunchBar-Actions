const movieItemAPI = 'api.douban.com/v2/moive/subject/';
const movieSearchAPI = 'https://api.douban.com/v2/movie/search?q=';

function runWithString(keyword) {
	try {

		var result = HTTP.get(movieSearchAPI + encodeURIComponent(keyword));
		var movieList = JSON.parse(result.data)['subjects'];

		var items = [];
		for (movie of movieList) {
			items.push({
				'title': movie['title'] + '3',
				'alwaysShowsSubtitle': true,
				'subtitle': getSubtitle(movie),
				'label': '' + movie['rating']['average'],
				'actionReturnsItems': getDetail(movie)
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

function addAsTodoistTask() {

}

function getSubtitle(movie) {
	var detail = movie['year'] + '年';
	return detail;
}

function getDetail(movie) {
	var items = [];
	items.push({
		'title': movie['year'] + '年'
	})
}