// woXrooX Flavored Markdown

export default function Markdown_to_HTML(markdown) {
	if(typeof markdown !== 'string') return '';

	let HTML = markdown;

	// Preserve <br> tags by replacing them with a placeholder
	HTML = HTML.replace(/<br>/gi, '%%BR%%');

	// Escape special characters (only once)
	HTML = HTML.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');

	// Restore <br> tags
	HTML = HTML.replace(/%%BR%%/g, '<br>');

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

	HTML = process_lists(HTML);

	// Process blocks
	return process_blocks(HTML);
}



///////// Helpers

function process_lists(HTML) {
	const lines = HTML.split('\n');
	let output = [];
	let list_stack = []; // Stack to track nested list types and levels
	let current_level = -1;
	let number_counters = {}; // Track numbers for ordered list levels

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// Count leading tabs to determine nesting level
		const leading_tabs = (line.match(/^\t*/)[0] || '').length;

		// Each tab = 1 level
		const level = leading_tabs;

		// Check for list item types
		const ordered_match = line.trim().match(/^\d+\.[\s\t]+\S/);
		const unordered_match = line.trim().match(/^-[\s\t]+\S/);

		if (ordered_match || unordered_match) {
			const is_ordered = !!ordered_match;
			const content = line.trim().replace(is_ordered ? /^\d+\.[\s\t]+/ : /^-[\s\t]+/,'');

			// Initialize counter for new ordered list level
			if (is_ordered && !number_counters[level]) number_counters[level] = 1;

			if (level > current_level) {
				// Start new nested list
				const list_type = is_ordered ? 'ol' : 'ul';
				list_stack.push({ type: list_type, level });
				output.push(`<${list_type}>`);
				current_level = level;
			}

			else if (level < current_level) {
				// Close deeper nested lists
				while (current_level > level && list_stack.length > 0) {
					const last_list = list_stack.pop();
					output.push(`</${last_list.type}>`);
					if (last_list.type === 'ol') delete number_counters[last_list.level];
					current_level--;
				}
			}

			else if (level === current_level && list_stack.length > 0) {
				// Check if we need to switch list type at the same level
				const current_list = list_stack[list_stack.length - 1];
				const current_type = current_list.type;
				const new_type = is_ordered ? 'ol' : 'ul';

				if (current_type !== new_type) {
					// Close current list and start new one of different type
					list_stack.pop();
					output.push(`</${current_type}>`);
					list_stack.push({ type: new_type, level });
					output.push(`<${new_type}>`);

					if (new_type === 'ol') number_counters[level] = 1;
				}
			}

			output.push(`<li>${content}</li>`);

			if (is_ordered) number_counters[level]++;
		}

		else {
			// Close all open lists when encountering non-list content
			while (list_stack.length > 0) {
				const last_list = list_stack.pop();
				output.push(`</${last_list.type}>`);
			}

			number_counters = {};
			current_level = -1;
			output.push(line);
		}
	}

	// Close any remaining open lists
	while (list_stack.length > 0) {
		const last_list = list_stack.pop();
		output.push(`</${last_list.type}>`);
	}

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

1. First item
2. Second item
	1. Nested item 1
	2. Nested item 2
		- AA
		- AB
			1. Another one
			1. Another one
3. Third item

<br><br>
Check out [woXrooX's website](https://www.woXrooX.com).
`
