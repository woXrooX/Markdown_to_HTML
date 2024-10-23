export default function Markdown_to_HTML(markdown){
	if(typeof markdown !== 'string') return '';

	let HTML = markdown;

	// Escape special characters
	// HTML = HTML.replace(/&/g, '&amp;')
	// 	.replace(/</g, '&lt;')
	// 	.replace(/>/g, '&gt;')
	// 	.replace(/"/g, '&quot;')
	// 	.replace(/'/g, '&#039;');

	// Convert headers
	HTML = HTML.replace(/^(#{1,6})\s+(.*?)$/gm, function(match, hashes, content){
		return `<h${hashes.length}>${content.trim()}</h${hashes.length}>`;
	});

	// Convert bold
	HTML = HTML.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

	// Convert italic
	HTML = HTML.replace(/\*(.*?)\*/g, "<em>$1</em>");

	// Convert links
	HTML = HTML.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2">$1</a>`);

	// Convert line breaks
	HTML = HTML.replace(/\\$/gm, "<br>");

	// Convert paragraphs
	let lines = HTML.split('\n');
	let paragraphs = '';

	for(const line of lines)
		if(line.trim() === '') paragraphs += "<br>";
		else paragraphs += `<p>${line}</p>`;

	return paragraphs;
}


/////// Sample MDs
`
# H1
## H2
### H3

*italic*
**bold**
***bold_italic***

Check out [woXrooX's website](https://www.woXrooX.com).
`
