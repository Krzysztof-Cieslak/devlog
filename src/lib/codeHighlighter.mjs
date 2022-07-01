import { parse } from 'node-html-parser';
import { getHighlighter } from 'shiki';

const THEME = 'nord';

/**
 * Returns code with curly braces and backticks replaced by HTML entity equivalents
 * @param {string} html - highlighted HTML
 * @returns {string} - escaped HTML
 */
function escapeHtml(code) {
    return code.replace(
        /[{}`]/g,
        // (character) => ({ '{': '&#123;', '}': '&#125;', '`': '&#96;' }[character]),
        (character) => ({ '{': '&lbrace;', '}': '&rbrace;', '`': '&grave;' }[character])
    );
}

/**
 * Returns array of line numbers to be highlghted
 * @param {string} rangeString - range string to be parsed (e.g. {1,3-5,8})
 * @returns {number[]}
 */
function rangeParser(rangeString) {
    const result = [];
    const ranges = rangeString.split(',');
    ranges.forEach((element) => {
        if (element.indexOf('-') === -1) {
            result.push(parseInt(element, 10));
        } else {
            const limits = element.split('-');
            const start = parseInt(limits[0], 10);
            const end = parseInt(limits[1], 10);
            for (let i = start; i <= end; i += 1) {
                result.push(i);
            }
        }
    });
    return result;
}

/**
 * @param html {string} - code to highlight
 * @returns {string} - highlighted html
 */
function makeFocussable(html) {
    const root = parse(html);
    root.querySelector('pre').setAttribute('tabIndex', '0');
    return root.toString();
}

function addRangeToDataAttribute(html, range) {
    const root = parse(html);

    root.querySelector('pre').setAttribute('data-range', range.join(','));
    return root.toString();
}

function addLineNumberToDataAttribute(html) {
    let i = 0;

    const replaced = html.replaceAll('<span class="line', (x) => {
        i++;
        return `<span data-line="${i}" class="line`;
    });
    return replaced;
}

/**
 * @param code {string} - code to highlight
 * @param lang {string} - code language
 * @param meta {string} - code meta
 * @returns {string} - highlighted html
 */
async function highlighter(code, lang, meta) {
    const shikiHighlighter = await getHighlighter({
        theme: THEME
    });

    let html;
    if (!meta) {
        html = shikiHighlighter.codeToHtml(code, {
            lang
        });
    } else {
        const highlightMeta = /{([\d,-]+)}/.exec(meta)[1];
        const highlightLines = rangeParser(highlightMeta);

        html = shikiHighlighter.codeToHtml(code, {
            lang,
            lineOptions: highlightLines.map((element) => ({
                line: element,
                classes: ['highlight-line']
            }))
        });
        html = addRangeToDataAttribute(html, highlightLines);
    }
    html = addLineNumberToDataAttribute(html);
    html = makeFocussable(html);
    return escapeHtml(html);
}

export default highlighter;
