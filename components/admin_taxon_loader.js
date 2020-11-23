const AdminTaxonLoader = {
    selector: ".js-taxon-loader",
    buttons: [],
    init: function () {
        document.querySelectorAll(this.selector).forEach(this.apply);
    },
    apply: function (button) {
        const component = AdminTaxonLoader;
        component.buttons.push(button);
        button.addEventListener("click", component.handleClick);
    },
    handleClick: function (event) {
        const component = AdminTaxonLoader;
        const button = event.target;
        const container = button.closest("li");
        const url = button.dataset.url;
        const checkbox = container.querySelector("input:first-of-type");
        if (checkbox.name) {
            button.dataset.name = checkbox.name;
        }
        const request = Biovision.jsonAjaxRequest("get", url, function () {
            const response = JSON.parse(this.responseText);
            if (response.hasOwnProperty("data")) {
                const ul = document.createElement("ul");
                container.append(ul);
                response.data.forEach(function (data) {
                    const li = document.createElement("li");
                    component.loadTaxa(li, data, button);
                    ul.append(li);
                });
            }
        });
        button.disabled = true;
        if (url) {
            request.send();
            button.remove();
        }
    },
    loadTaxa: function (container, data, button) {
        const component = AdminTaxonLoader;
        const prefix = button.dataset.prefix
        const element_id = `${prefix}_taxon_${data.id}`
        const name = button.dataset.name;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = element_id;
        if (data.links[prefix]) {
            checkbox.dataset.url = data.links[prefix];
        }
        if (name) {
            checkbox.name = name;
        }
        checkbox.checked = data.meta[`${prefix}_linked`];
        checkbox.value = data.id;
        Biovision.components.entityLinker.apply(checkbox);
        container.append(checkbox);

        const label = document.createElement("label");
        label.htmlFor = element_id;
        label.innerHTML = data.attributes.name;
        container.append(label);

        if (data.attributes.children_cache.length > 0) {
            const newButton = document.createElement("button");
            newButton.dataset.url = data.links.children;
            newButton.innerHTML = "+";
            newButton.type = "button";
            newButton.dataset.prefix = prefix;
            component.apply(newButton);
            container.append(newButton);
        }
    }
}

export default AdminTaxonLoader;
