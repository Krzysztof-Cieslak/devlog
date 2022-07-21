<script lang="ts">
    import * as Diff from 'diff';

    type DiffInfo = { type: string; value: Diff.Change };
    type Section = {
        elements: HTMLElement[];
        highlights: string[];
        diffs: DiffInfo[];
        rawCode: string;
        codeElement: HTMLElement | undefined;
    };
    type CodeLine = { className: string; element: string };

    function getLines(element: HTMLElement): HTMLElement[] {
        let elements: HTMLElement[] = [];

        element.childNodes[0].childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim() === '') {
                return;
            }
            elements.push(child as HTMLElement);
        });

        return elements;
    }

    function insertNewLines(
        lines: HTMLElement[],
        diffs: DiffInfo[],
        newLines: HTMLElement[]
    ): [HTMLElement[], number[]] {
        const outputLines: HTMLElement[] = [];
        const addedLines: number[] = [];
        let diffIndex = 0;
        let newDiffIndex = 0;
        diffs.forEach((diff) => {
            if (diff.type == 'equal') {
                const takeLines = diff.value.count;
                for (let i = 0; i < takeLines; i++) {
                    outputLines.push(lines[diffIndex + i]);
                }
                diffIndex += takeLines;
                newDiffIndex += takeLines;
            }
            if (diff.type == 'add') {
                const takeLines = diff.value.count;
                for (let i = 0; i < takeLines; i++) {
                    let index = outputLines.push(newLines[newDiffIndex + i]);
                    addedLines.push(index);
                }
                newDiffIndex += takeLines;
            }
            if (diff.type == 'remove') {
                const takeLines = diff.value.count;
                diffIndex += takeLines;
            }
            console.log(diff.type, outputLines);
        });

        return [outputLines, addedLines];
    }

    function highlightCodeElement(
        els: HTMLElement[],
        highlights: string[],
        addedLines: number[]
    ): CodeLine[] {
        let elements: CodeLine[] = [];
        els.forEach((child, line) => {
            let className = '';
            //const line = (child as HTMLElement).getAttribute('data-line') ?? '';
            if (highlights.includes((line + 1).toString())) {
                className = 'line highlight-line';
            } else if (highlights.length > 0) {
                //If any line is highlighted, we want to dim non-highlighted lines
                className = 'line dim-line';
            } else {
                //If no lines are highlighted, we want to show all lines normally
                className = 'line';
            }
            if (addedLines.includes(line + 1)) {
                className += ' added-line';
            }
            elements.push({ className: className, element: child.innerHTML });
        });
        return elements;
    }

    function isEmptyCodeElement(element: HTMLElement) {
        return element.childNodes[0].childNodes[0].childNodes.length === 0;
    }

    let slotObj: HTMLElement;
    let codeElement: HTMLElement | undefined;
    let sections: Section[] = [];
    let activeSection = 0;
    let codeLines: CodeLine[] = [];
    let style = '';

    $: {
        let currentElements: HTMLElement[] = [];
        if (slotObj) {
            slotObj.childNodes.forEach((child) => {
                let currentElement = child as HTMLElement;
                let isInit = false;
                //Ignore empty text nodes
                if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim() === '') {
                    return;
                }
                if (currentElement.className.trim().includes('shiki')) {
                    // First code section is our starting point, rest are defined by add/remove line diff
                    if (!codeElement) {
                        if (!isEmptyCodeElement(currentElement)) {
                            codeElement = currentElement;
                            isInit = true;
                        } else {
                            throw new Error(
                                'CodePlaythrough: First code section needs to include source code'
                            );
                        }
                    }

                    const diffs: DiffInfo[] = [];
                    const rawCode =
                        currentElement.getAttribute('data-raw-code')?.replaceAll('\\\\n', '\n') ??
                        '';
                    if (!isEmptyCodeElement(currentElement) && !isInit) {
                        Diff.diffLines(
                            codeElement.getAttribute('data-raw-code')?.replaceAll('\\\\n', '\n'),
                            rawCode
                        ).forEach((diff) => {
                            if (diff.added) {
                                diffs.push({ type: 'add', value: diff });
                            } else if (diff.removed) {
                                diffs.push({ type: 'remove', value: diff });
                            } else {
                                diffs.push({ type: 'equal', value: diff });
                            }
                        });
                        //TODO: Calculate diff between previous and current code element
                    }

                    let highlight = currentElement.getAttribute('data-range')?.split(',') ?? [];

                    sections.push({
                        elements: currentElements,
                        highlights: highlight,
                        diffs: diffs,
                        rawCode: rawCode,
                        codeElement: currentElement
                    });
                    currentElements = [];
                } else {
                    currentElements.push(currentElement);
                }
            });
            if (currentElements.length > 0) {
                sections.push({
                    elements: currentElements,
                    highlights: [],
                    diffs: [],
                    rawCode: '',
                    codeElement: undefined
                });
            }
            sections = sections;
        }
    }

    function handleClick(event: MouseEvent) {
        let target = event.target as HTMLElement;
        let index = target.getAttribute('data-index');
        if (index) {
            activeSection = parseInt(index);
        }
    }

    $: {
        if (codeElement) {
            let section = sections[activeSection];
            let lines = getLines(codeElement);
            let addedLines: number[] = [];
            if (section.codeElement && section.diffs.length > 0) {
                let newLines = getLines(section.codeElement);
                let [ls, as] = insertNewLines(lines, section.diffs, newLines);
                lines = ls;
                addedLines = as;
                console.log(addedLines);
            }
            style = codeElement.getAttribute('style') ?? '';
            codeLines = highlightCodeElement(lines, section.highlights, addedLines);
        }
    }
</script>

<span class="hidden" bind:this={slotObj}><slot /></span>
<div class="row">
    <div class="col-xs-8">
        <pre class="shiki" tabindex="0" {style}>
            <code class="code">
                {#each codeLines as codeLine}
                    <span class={codeLine.className}>
                        {@html codeLine.element}
                    </span>
                {/each}
            </code>
        </pre>
    </div>
    <div class="col-xs-4">
        {#each sections as s, i}
            {#if s.elements.length > 0}
                <article
                    class={activeSection === i ? 'section active' : 'section'}
                    data-index={i}
                    on:click={handleClick}
                >
                    {#each s.elements as e}
                        {@html e.outerHTML}
                    {/each}
                </article>
            {/if}
        {/each}
    </div>
</div>

<style>
    .active {
        border-color: #4983ee;
        border-width: 1px;
        border-style: solid;
    }
    .section {
        margin-top: 0;
    }

    .hidden {
        display: none;
    }

    .code {
        display: grid;
    }
    span.line {
        display: inline-flex;
    }

    .added-line {
        animation-name: fadeInOpacity;
        animation-iteration-count: 1;
        animation-timing-function: ease-in;
        animation-duration: 3.5s;
    }

    @keyframes fadeInOpacity {
        0% {
            background-color: var(--colour-code-background-highlighted);
            width: calc(var(--max-width-full) + var(--spacing-4));
            border-left: var(--spacing-1) solid var(--colour-code-line-highlight-new);
            margin-left: calc(-1 * var(--spacing-1));
            opacity: 0;
        }
        25% {
            background-color: var(--colour-code-background-highlighted);
            width: calc(var(--max-width-full) + var(--spacing-4));
            border-left: var(--spacing-1) solid var(--colour-code-line-highlight-new);
            margin-left: calc(-1 * var(--spacing-1));
            opacity: 1;
        }
        100% {
            background-color: var(--colour-code-background-highlighted);
            width: calc(var(--max-width-full) + var(--spacing-4));
            border-left: var(--spacing-1) solid var(--colour-code-line-highlight-new);
            margin-left: calc(-1 * var(--spacing-1));
        }
    }
</style>
