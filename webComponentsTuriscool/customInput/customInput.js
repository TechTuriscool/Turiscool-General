export class customInput extends HTMLElement {
    constructor() {
        super();
        this.textType;
        this.place;
        this.data;
        this.cursor;
    }

    static get observedAttributes() {
        return ["place", "config", "cursor", "data"];
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (oldValue !== newValue) {
            switch (attribute) {
                case "place":
                    this.place = newValue;
                    break;
                case "config":
                    this.config = newValue;
                    break;
                case "cursor":
                    this.cursor = newValue;
                    break;
                case "data":
                    this.data = newValue;
                    break;
            }
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="containerInput">
                <input type="${this.config}" placeholder="${this.place}" style="cursor: ${this.cursor}" value="${this.data}"/>
            </div>
        `;
    }
}

window.customElements.define('custom-input', customInput);