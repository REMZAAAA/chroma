const computed = getComputedStyle(document.body);
const settings = document.getElementById("settings");

function initializeInputs() {
    const inputs = document.querySelectorAll("input");

    inputs.forEach(inputEl => {
        const id = inputEl.id;
        const idNumber = parseInt(id.substring(3));
        let defaultValue = computed.getPropertyValue(`--${id}`) || 0;
        inputEl.value = defaultValue;

        // console.log(id, defaultValue, inputEl);

        inputEl.addEventListener("input", (e) => {
            if (inputEl.type === "range") {
                for (let i = 0; i < 2; i++) {
                    const neighborId = `input#rad${i % 2 === 0 ? idNumber + 1 : idNumber - 1}`;
                    const neighbor = document.querySelector(neighborId);
                    if (neighbor) {
                        const neighborValue = neighbor.valueAsNumber;
                        if (i % 2 === 0 ? e.target.value < neighborValue : e.target.value > neighborValue) {
                            e.target.value = neighborValue;
                        }
                    }
                }
            }
            document.documentElement.style.setProperty(`--${id}`, e.target.value);
        });

        inputEl.select();
    });
}

const add = document.getElementById("add");
const rem = document.getElementById("rem");

add.addEventListener("click", () => {
    const rangeContainer = document.querySelector(".range-input");
    const visualContainer = document.getElementById("container");
    const colorPicker = document.querySelector(".color-picker");

    const maxVisual = 10;

    if (visualContainer.children.length == maxVisual - 1) {
        add.classList.add("deactivate");
    }
    if (visualContainer.children.length >= maxVisual) {
        return;
    }

    // Ajout slider
    const count = rangeContainer.children.length + 1;
    const newRangeDiv = document.createElement("div");
    newRangeDiv.innerHTML = `
        <label for="rad${count}" id="rad${count}">bg${count * 100} radius</label>
        <input type="range" id="rad${count}" name="rad${count}" min="0" max="100">
    `;
    rangeContainer.appendChild(newRangeDiv);

    // Ajout div cercle
    const newVisualDiv = document.createElement("div");
    visualContainer.appendChild(newVisualDiv);

    // Ajout couleur (id bg500, bg600, etc.)
    const colorCount = colorPicker.children.length - 1;
    const idNum = colorCount * 100;
    const newId = `bg${idNum}`;

    const newColorDiv = document.createElement("div");
    newColorDiv.innerHTML = `
        <input type="color" id="${newId}" name="${newId}">
        <label for="${newId}" id="${newId}">${newId}</label>
    `;
    colorPicker.appendChild(newColorDiv);

    rem.classList.remove("deactivate");

    initializeInputs();
    updateContainerStyles();
});

rem.addEventListener("click", () => {
    // Partie sliders
    const rangeContainer = document.querySelector(".range-input");
    if (rangeContainer.children.length > 2) {
        rangeContainer.removeChild(rangeContainer.lastElementChild);
    }

    // Partie cercle : retirer une div de #container
    const visualContainer = document.getElementById("container");
    if (visualContainer.children.length > 2) {
        visualContainer.removeChild(visualContainer.lastElementChild);
    }

    // Partie color-picker : retirer couleur ajoutée (pas les 6 premières)
    const colorPicker = document.querySelector(".color-picker");
    if (colorPicker.children.length > 4) {
        colorPicker.removeChild(colorPicker.lastElementChild);
    }

    if (visualContainer.children.length <= 2) {
        rem.classList.add("deactivate");
    }

    add.classList.remove("deactivate");

    initializeInputs();
    updateContainerStyles();
});

function updateContainerStyles() {
    const container = document.getElementById("container");
    const divs = container.querySelectorAll("div");

    for (let index = 1; index < divs.length; index++) {
        const div = divs[index];
        const i = index + 1; // correspond au nth-of-type réel (2e div = rad2, bg100...)

        const rad = `--rad${i}`;
        const inner = `--bg${(i - 1) * 100}`;
        const outer = `--bg${i * 100}`;

        div.style.setProperty("--rad", `var(${rad})`);
        div.style.setProperty("--inner-shade", `var(${inner})`);
        div.style.setProperty("--outer-shade", `var(${outer})`);
        div.style.backgroundColor = `var(${outer})`;
    }
}

document.addEventListener("keydown", (e) => {
    let offsetX = settings.clientWidth;
    switch (e.key) {
        case "Escape":
            settings.style.transform = settings.style.transform == `translateX(-${offsetX}px)` ? "translateX(0)" : `translateX(-${offsetX}px)`;
            break;
    }
});

initializeInputs();
