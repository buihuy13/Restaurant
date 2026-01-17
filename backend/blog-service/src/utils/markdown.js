import MarkdownIt from 'markdown-it';

// Initialize markdown-it with options
const md = new MarkdownIt({
    html: true, // Enable HTML tags in source
    linkify: true, // Auto-convert URL-like text to links
    typographer: true, // Enable smartquotes and other typographic replacements
    breaks: true, // Convert '\n' in paragraphs into <br>
});

/**
 * Parse markdown content to HTML
 * @param {String} markdown - Markdown content
 * @returns {String} HTML content
 */
export const parseMarkdown = (markdown) => {
    if (!markdown || typeof markdown !== 'string') {
        return '';
    }
    return md.render(markdown);
};

/**
 * Strip HTML tags from content (for excerpts)
 * @param {String} html - HTML content
 * @returns {String} Plain text
 */
export const stripHtml = (html) => {
    if (!html || typeof html !== 'string') {
        return '';
    }
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Parse markdown and return both HTML and plain text
 * @param {String} markdown - Markdown content
 * @returns {Object} { html, plainText }
 */
export const parseMarkdownWithText = (markdown) => {
    const html = parseMarkdown(markdown);
    const plainText = stripHtml(html);
    return { html, plainText };
};

export default {
    parseMarkdown,
    stripHtml,
    parseMarkdownWithText,
};
