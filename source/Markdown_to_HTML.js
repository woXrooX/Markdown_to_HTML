export default function Markdown_to_HTML(markdown) {
	if (typeof markdown !== 'string') return '';

	let HTML = markdown;

	// Escape special characters
	HTML = HTML.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');

	// Convert headers
	HTML = HTML.replace(/^# (.*$)/gm, '<h1>$1</h1>');
	HTML = HTML.replace(/^## (.*$)/gm, '<h2>$1</h2>');
	HTML = HTML.replace(/^### (.*$)/gm, '<h3>$1</h3>');

	// Convert bold
	HTML = HTML.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

	// Convert italic
	HTML = HTML.replace(/\*(.*?)\*/g, '<em>$1</em>');

	// Convert unordered lists
	HTML = HTML.replace(/^(- .+(\n|$))+/gm, function(match) {
	  return '<ul>\n' + match.replace(/^- (.+)$/gm, '  <li>$1</li>') + '</ul>';
	});

	// Convert ordered lists
	HTML = HTML.replace(/^(\d+\. .+(\n|$))+/gm, function(match) {
	  return '<ol>\n' + match.replace(/^\d+\. (.+)$/gm, '  <li>$1</li>') + '</ol>';
	});

	// Convert links
	HTML = HTML.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

	// Convert line breaks
	HTML = HTML.replace(/\\$/gm, '<br>');

	// Convert paragraphs
	HTML = HTML.replace(/^(?!<[uh]).*$/gm, '<p>$&</p>');

	return HTML;
}


/////// Sample MDs
`
# H1
## H2
### H3

*italic*
**bold**
***bold_italic***

- UL 1
- UL 2

\ <br>

1. OL 1
2. OL 2

Check out [woXrooX's website](https://www.woXrooX.com).

`
