const movieItemAPI = 'api.douban.com/v2/book/subject/';
const bookSearchAPI = 'https://api.douban.com/v2/book/search?q=';
const addTodoistTask = 'todoist://addtask?';

function runWithString(keyword) {
	try {
		var result = HTTP.get(bookSearchAPI + encodeURIComponent(keyword));
		var booklist = JSON.parse(result.data)['books'];

		var items = [];
		for (var book of booklist) {
			items.push({
				'title': book['title'] + 2,
				'alwaysShowsSubtitle': true,
				'subtitle': getSubtitle(book),
				'label': getLabel(book['rating']['average']),
				'children': getDetailItems(book)
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

function addTaskURL(book) {
	var content = book['title'] + ' - ' + book['rating']['average'];
	var urlScheme = addTodoistTask + 'content=' + content;
	return urlScheme;
}

function getSubtitle(book) {
	var author = (book['author'].length == 0) ? '' : (book['author'][0] + '/著');
	var publisher = book['publisher'];
	var pubdate = book['pubdate'];
	var translator = (book['translator'].length == 0) ? '' : (', ' + book['translator'][0] + '/译');
	return author + ', ' + publisher + ', ' + pubdate + translator;
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

function getDetailItems(book) {
	var items = [];

	items.push(
		{
			'title': 'Add to Todoist',
			'url': addTaskURL(book)
		},
		{
			'title': '《' + book['title'] + '》 (豆瓣链接)',
			'url': book['alt']
		},
		{
			'title': '作者简介：' + book['author_intro']
		},
		{
			'title': (book['translator'].length == 0) ? '' : ', ' + book['translator'][0] + '/译'
		},
		{
			'title': book['rating']['average'] + '分, '
					+ book['rating']['numRaters'] + ' 人评分'
		},
		{
			'title':  '内容简介：' + book['summary']
		},
		{
			'title': 'ISBN：' + book['isbn13']
		}
	);

	items.push

	return items;
}