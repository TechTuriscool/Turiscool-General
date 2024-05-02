class customToast extends HTMLElement {
    constructor() {
        super();
        this.text;
        this.color;
    }

    static get observedAttributes() {
        return ["text", "color"];
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (oldValue !== newValue) {
            switch (attribute) {
                case "text":
                    this.text = newValue;
                    break;
                case "color":
                    this.color = newValue;
                    break;
            }
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="containerToast">
                <p style="color: ${this.color}">${this.text}</p>
            </div>
        `;
    }
}

window.customElements.define('custom-toast', customToast);