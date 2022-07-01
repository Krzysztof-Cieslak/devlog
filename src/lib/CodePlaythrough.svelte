<script lang="ts">
    type Section = { code: HTMLElement; elements: HTMLElement[]; highlight: number[] };

    function highlightCodeElement(element: HTMLElement) {
        let highlights = element.getAttribute('data-range')?.split(',') ?? [];
        element.childNodes[0].childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim() === '') {
                return;
            }
            const line = (child as HTMLElement).getAttribute('data-line') ?? '';
            if (highlights.includes(line)) {
                (child as HTMLElement).className = 'line highlight-line';
            } else if (highlights.length > 0) {
                //If any line is highlighted, we want to dim non-highlighted lines
                (child as HTMLElement).className = 'line dim-line';
            } else {
                //If no lines are highlighted, we want to show all lines normally
                (child as HTMLElement).className = 'line';
            }
        });
        return element;
    }

    let slotObj: HTMLElement;
    let sections: Section[] = [];
    let activeSection = 0;
    let code;

    $: {
        let currentElements: HTMLElement[] = [];
        let currentCodeElement: HTMLElement | undefined;
        if (slotObj) {
            slotObj.childNodes.forEach((child) => {
                //Ignore empty text nodes
                if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim() === '') {
                    return;
                }
                if ((child as Element).className.trim().includes('shiki')) {
                    let prev = currentCodeElement;
                    currentCodeElement = child as HTMLElement;
                    //If current code element is empty than we should use previous one as a base
                    //But we want to change highlighting based on new data-range attribute
                    if (currentCodeElement.childNodes[0].childNodes[0].childNodes.length === 0) {
                        currentCodeElement.innerHTML = prev?.innerHTML ?? '';
                    }
                    currentCodeElement = highlightCodeElement(currentCodeElement);
                    sections.push({
                        code: currentCodeElement,
                        elements: currentElements,
                        highlight: []
                    });
                    currentElements = [];
                } else {
                    currentElements.push(child as HTMLElement);
                }
            });
            if (currentElements.length > 0) {
                let codeEl =
                    currentCodeElement === undefined
                        ? sections[sections.length - 1].code
                        : currentCodeElement;
                sections.push({
                    code: codeEl,
                    elements: currentElements,
                    highlight: []
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

    $: code = sections[activeSection]?.code.outerHTML;
</script>

<span class="hidden" bind:this={slotObj}><slot /></span>
<div class="row">
    <div class="col-xs-8">
        {@html code}
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
</style>
