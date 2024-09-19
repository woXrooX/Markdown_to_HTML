export default function Markdown_to_HTML(markdown){
	let HTML = markdown;

	// Convert headers
	HTML = HTML.replace(/^# (.*$)/gm, '<h1>$1</h1>');
	HTML = HTML.replace(/^## (.*$)/gm, '<h2>$1</h2>');
	HTML = HTML.replace(/^### (.*$)/gm, '<h3>$1</h3>');

	// Convert bold
	HTML = HTML.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

	// Convert italic
	HTML = HTML.replace(/\*(.*?)\*/g, '<em>$1</em>');

	// Convert unordered lists
	HTML = HTML.replace(/^\s*-\s(.*)$/gm, '<li>$1</li>');
	HTML = HTML.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

	// Convert paragraphs
	HTML = HTML.replace(/^(?!<[uh]).*$/gm, '<p>$&</p>');

	return HTML;
}
