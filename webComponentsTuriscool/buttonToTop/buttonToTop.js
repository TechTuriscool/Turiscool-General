export class buttonToTop extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ["visible"];
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (oldValue !== newValue) {
            switch (attribute) {
                case "visible":
                    this.updateVisibility(newValue);
                    break;
            }
        }
    }

    updateVisibility(visible) {
        if (this.buttonToTop) {
            this.buttonToTop.style.display = visible === "true" ? "block" : "none";
        }
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = /*html*/`
        <style>
        .buttonToTop {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 50%;
            padding: 10px 15px;
            
            font-size: 16px;
            cursor: pointer;
            display: none;
        }
        </style>
        <button class="buttonToTop" id="buttonToTop">↑</button>
        `;
        this.buttonToTop = this.shadowRoot.getElementById("buttonToTop");
        this.buttonToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
        this.updateVisibility(this.getAttribute("visible"));
    }
}

customElements.define("button-to-top", buttonToTop);
