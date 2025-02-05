// woXrooX Flavored Markdown

export default function Markdown_to_HTML(markdown) {
	if(typeof markdown !== 'string') return '';

	let HTML = markdown;

	// Escape special characters (only once)
	HTML = HTML.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');

	// Process headers
	HTML = HTML.replace(/^(#{1,6})\s+(.*)$/gm, function(match, hashes, content) {
		return `<h${hashes.length}>${content.trim()}</h${hashes.length}>`;
	});

	// Process **bold**
	HTML = HTML.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

	// Process *italic*
	HTML = HTML.replace(/\*(.*?)\*/g, "<em>$1</em>");

	// Process links [text](url)
	HTML = HTML.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

	// Process unordered lists
	HTML = process_unordered_lists(HTML);

	// Process blocks
	return process_blocks(HTML);
}



///////// Helpers

function process_unordered_lists(HTML) {
	const lines = HTML.split('\n');
	let output = [];
	let list_stack = []; // Stack to track nested list levels
	let current_level = -1;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// Count leading tabs to determine nesting level
		const leading_tabs = (line.match(/^\t*/)[0] || '').length;

		// Check for valid list item format: dash followed by at least one space/tab
		const is_list_item = line.trim().match(/^-[\s\t]+\S/);

		if (is_list_item) {
			// Each tab = 1 level
			const level = leading_tabs;

			// Remove '-' and trim
			const content = line.trim().substring(1).trim();

			if (level > current_level) {
				// Start new nested list
				list_stack.push('</ul>');
				output.push('<ul>');
				current_level = level;
			}

			else if (level < current_level) {
				// Close deeper nested lists
				while (current_level > level && list_stack.length > 0) {
					output.push(list_stack.pop());
					current_level--;
				}
			}

			output.push(`<li>${content}</li>`);
		}

		else {
			// Close all open lists when encountering non-list content
			while (list_stack.length > 0) output.push(list_stack.pop());

			current_level = -1;
			output.push(line);
		}
	}

	// Close any remaining open lists
	while (list_stack.length > 0) output.push(list_stack.pop());

	return output.join('\n');
}

// Split into blocks and handle empty lines
function process_blocks(HTML) {
	let output = '';
	const blocks = HTML.split('\n');
	let current_paragraph = [];

	for (let i = 0; i < blocks.length; i++) {
		const trimmed_block = blocks[i].trim();

		// Skip wrapping if the line contains HTML tags for headers or lists
		if (trimmed_block.startsWith('<h') ||
			trimmed_block.startsWith('<ul') ||
			trimmed_block.startsWith('</ul') ||
			trimmed_block.startsWith('<li') ||
			trimmed_block.startsWith('</li')) {

			// If we have accumulated paragraph content, flush it first
			if (current_paragraph.length > 0) {
				output += `<p>${current_paragraph.join(' ')}</p>`;
				current_paragraph = [];
			}

			output += trimmed_block;
		}
		else if (!trimmed_block) {
			// Empty line - flush current paragraph if exists
			if (current_paragraph.length > 0) {
				output += `<p>${current_paragraph.join(' ')}</p>`;
				current_paragraph = [];
			}
		}
		else {
			// Non-empty line - add to current paragraph
			current_paragraph.push(trimmed_block);
		}
	}

	// Don't forget to flush any remaining paragraph content
	if (current_paragraph.length > 0) {
		output += `<p>${current_paragraph.join(' ')}</p>`;
	}

	return output;
}



/////// Sample MDs
`
# H1
## H2
### H3

*italic*
**bold**
***bold_italic***

- a
- b
	- c

Check out [woXrooX's website](https://www.woXrooX.com).
`
