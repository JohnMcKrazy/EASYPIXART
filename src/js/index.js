document.addEventListener("DOMContentLoaded", () => {
    const createSvg = (svgName, xPix, yPix) => `<svg class="${svgName} canvas_svg icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${xPix} ${yPix}"></svg>`;
    const createSvgTitle = (svgName) => `<title>${svgName}</title>`;
    const createColorVar = (varName, varValue) => `.${varName}{fill:${varValue}}`;
    const createDemoSvgGroup = (fill = "transparent") => `<g fill="${fill}">`;
    const createPixel = (xPos, yPos, className, fill) => `<rect class="${className}" width="1" height="1" x="${xPos}" y="${yPos}" fill="${fill}"></rect>`;
    const createDiv = (tag) => {
        return `<div class="${tag}"></div>`;
    };
    let storageContent;
    const close = "close";
    const open = "open";

    let currentMenu = "";

    const flex = "flex";
    const block = "block";
    const none = "none";
    const storageName = "easy_pix_art";
    const pageData = {
        intro: {
            checkbox_status: "",
        },
        theme: "dark_theme",
        swatches: [],
        gallery: [],
        alerts: {
            refresh_alert: none,
            override_alert: none,
        },
    };
    const pageActions = {
        intro: {
            checkbox_status: false,
        },
        artColumns: 0,
        artRows: 0,
        modal: open,
        nav: close,
        alert: close,
        navsConfig: {
            palette_nav: "translateY(-100%)",
            menu_nav: "translateY(-100%)",
        },
        btnActive: "",
        navOpen: "translateY(0)",
        pixel_start_color: "",
        pixels_to_save: [],
    };

    //*^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ *//
    const $d = document;

    const selector = (tag) => $d.querySelector(`${tag}`);
    const selectorAll = (tag) => $d.querySelectorAll(`${tag}`);
    //*^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ *//
    const swatchSavesFragment = $d.createDocumentFragment();
    const swatchTemplate = selector(".swatch_template").content;

    const BODY = selector("body");
    const modal = selector(".modal");
    const alert = selector(".alert");
    const modalSwatchesContainer = selector(".modal_swatches_container");
    const alertSwatchesContainer = selector(".alert_swatches_container");
    const swatchesEmptylabel = selector(".swatches_msg");
    const galleryContainer = selector(".gallery_container");
    const galleryEmptylabel = selector(".gallery_msg");
    const saveArtNameInput = selector(".inp_save_art_name");
    const columnsPixelInput = selector(".columns_pixel");
    const rowsPixelInput = selector(".rows_pixel");
    const gridInput = selector(".grid_value");
    const createArtNameInput = selector(".inp_create_art_name");
    const colorBgPixelInput = selector(".pixel_bg_check");
    const colorPaletteInput = selector(".palette_color");
    const bgPixelColor = selector(".bg_pixel_color");
    const bgGridColor = selector(".bg_grid_color");
    const colorItemsCounter = selector(".items_counter");
    const mainCanvasTitle = selector(".canvas_title");
    const mainCanvas = selector(".main_canvas");

    //¿ UTILS
    const updateStorage = () => {
        storageContent = JSON.parse(localStorage.getItem(storageName));
        console.log("Actualizando con storageData");
        console.log(storageContent);
    };
    const saveStorage = () => {
        localStorage.setItem(storageName, JSON.stringify(storageContent));
        console.log("Salvando StorageData");
        /* console.table(JSON.parse(localStorage.getItem(storageName))); */
    };
    const deleteStorage = () => {
        localStorage.removeItem(storageName);
        console.log("Eliminando StorageData");
        /* console.log(JSON.parse(localStorage.getItem(storageName))); */
    };
    const sanitizeInput = (inputValue) => {
        const div = document.createElement("div");
        div.textContent = inputValue;
        return div.innerHTML;
    };
    const deleteChildElements = (parentElement) => {
        let child = parentElement.lastElementChild;
        while (child) {
            parentElement.removeChild(child);
            child = parentElement.lastElementChild;
        }
    };
    const animTranform = (item, from, to, delay = 750, ease = "ease", fill = "forwards") => {
        item.animate([{ transform: from }, { transform: to }], { duration: delay, easing: ease, fill: fill });
    };
    const createDataDate = () => {
        const date = new Date();
        const dateDay = date.getDay();
        const dateMonth = date.getMonth();
        const dateYear = date.getFullYear();
        console.log(date);
        let correctDay = "";
        let correctMonth = "";
        if (dateDay <= 9) {
            correctDay = `0${dateDay}`;
        } else {
            correctDay = dateDay;
        }
        if (dateMonth <= 9) {
            correctMonth = `0${dateMonth}`;
        } else {
            correctMonth = dateMonth;
        }
        return `${correctDay}-${correctMonth}-${dateYear}`;
    };
    const createNewUniqueArray = (arrayNumber) => {
        const generateRandom = (arr) => {
            const arrayLenght = arr.length;
            const randomItem = Math.floor(Math.random() * arrayLenght);
            return arr[randomItem];
        };
        let respuesta = "";
        const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        const letter = "letter";
        /* const sign = "sign"; */
        const number = "number";
        /* const signs = ["*", "&", "$", "@", "#", "%", "?", "!"]; */
        const typeOfData = [letter, number /* ,sign */];
        const newPosition = () => {
            const whatType = generateRandom(typeOfData);

            switch (whatType) {
                case letter:
                    return generateRandom(letters);
                /*  case sign:
                    return generateRandom(signs); */
                case number:
                    return generateRandom(numbers).toString();
            }
        };
        const newId = () => {
            for (let item = 0; item < arrayNumber; item++) {
                respuesta += newPosition();
            }
            return respuesta;
        };
        /* const uniqueID = `${newPosition()}${newPosition()}${newPosition()}${newPosition()}${newPosition()}${newPosition()}${newPosition()}${newPosition()}${newPosition()}${newPosition()}${newPosition()}${newPosition()}`; */
        return newId();
    };
    //¿ ACTIONS
    const closeModal = () => {
        pageActions.modal = close;
        modal.style.opacity = 0;
        setTimeout(() => {
            modal.style.display = none;
        }, 1000);
    };
    const openModal = () => {
        pageActions.modal = open;
        modal.style.display = block;
        setTimeout(() => {
            modal.style.opacity = 1;
        }, 200);
    };
    const modalWindowActions = (action, window) => {
        const thisWindow = selector(`.${window}`);
        if (action === open) {
            openModal();
            thisWindow.style.display = block;
        } else if (action === close) {
            closeModal();
            setTimeout(() => (thisWindow.style.display = none), 1200);
        }
    };
    const openAlert = () => {
        pageActions.alert = open;
        alert.style.display = block;
        setTimeout(() => {
            alert.style.opacity = 1;
        }, 200);
    };
    const closeAlert = () => {
        pageActions.alert = close;
        alert.style.opacity = 0;
        setTimeout(() => {
            alert.style.display = none;
        }, 1000);
    };
    const alertWindowActions = (action, window) => {
        const thisWindow = selector(`.${window}`);
        if (action === open) {
            openAlert();
            thisWindow.style.display = block;
        } else if (action === close) {
            closeAlert();
            setTimeout(() => (thisWindow.style.display = none), 1200);
        }
    };
    //*!  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! *//
    const createSwatch = (item) => {
        const thisTemp = swatchTemplate.cloneNode(true);
        const thisBtn = thisTemp.querySelector(".swatch_item");
        const swatchContainer = thisTemp.querySelector(".swatch_container");
        const colorLabel = thisTemp.querySelector(".label_swatch");
        const colorName = thisTemp.querySelector(".label_name");
        thisBtn.setAttribute("data-color", item.hexa_color);
        swatchContainer.style.background = item.hexa_color;
        colorLabel.textContent = item.hexa_color;
        colorName.textContent = item.name;
        swatchSavesFragment.append(thisBtn);
    };
    const swatchesBtnsAction = () => {
        selectorAll(".swatch_item").forEach((itemColor) => {
            itemColor.addEventListener("click", () => {
                modalWindowActions(close, "swatches_modal");
                pageActions.modal = close;
                const thisColor = itemColor.getAttribute("data-color");
                console.log(thisColor);
                colorPaletteInput.value = thisColor;
            });
        });
    };
    const createPixels = (columns, rows, pixelsName, fill) => {
        let pixels = "";
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                /* console.log(createDemoPixel(x, y, "demo_pixel")); */
                pixels += createPixel(x, y, pixelsName, fill);
            }
        }
        return pixels;
    };

    const createDemoCanvas = () => {
        let thisPixels = "";
        const currentColumns = parseInt(columnsPixelInput.textContent);
        const currentRows = parseInt(rowsPixelInput.textContent);

        const createDemo = createSvg("demo_svg", currentColumns, currentRows);
        selector(".demo_canvas").innerHTML = createDemo;
        const demoSvg = selector(".demo_svg");

        thisPixels = createDemoSvgGroup();
        const newPixels = createPixels(currentColumns, currentRows, "demo_pixel", "transparent");
        thisPixels += newPixels + "</g>";
        demoSvg.innerHTML = thisPixels;
    };
    const createMainCanvas = (artName, columns, rows, fill) => {
        pageActions.artColumns = columns;
        pageActions.artRows = rows;
        pageActions.art_name = artName;
        mainCanvasTitle.textContent = artName;
        const currentColumns = pageActions.artColumns;
        const currentRows = pageActions.artRows;
        const createMain = createSvg("main_svg", currentColumns, currentRows);
        mainCanvas.innerHTML = createMain;
        const newPixels = createPixels(currentColumns, currentRows, "main_pixel", fill);

        selector(".main_svg").innerHTML = newPixels;
        selector(`.erase_btn`).classList.remove("active");
        selector(`.draw_btn`).classList.remove("active");
        selector(`.erase_btn`).setAttribute("checked", false);
        selector(`.draw_btn`).setAttribute("checked", false);
    };
    const createArtCanvas = (item) => {
        console.log(item);
        const { columns, rows, art_name, pixels, id } = item[0];
        console.log(columns, rows, art_name, pixels);

        pageActions.artColumns = columns;
        pageActions.artRows = rows;
        pageActions.art_name = art_name;
        mainCanvasTitle.textContent = art_name;

        let thisPixels = "";
        const newSvg = createSvg("main_svg", parseInt(columns), parseInt(rows));
        mainCanvas.innerHTML = newSvg;
        console.log(mainCanvas);
        pixels.forEach((pixel) => {
            thisPixels += `<rect class="main_pixel" width="1" height="1" x="${pixel.x}" y="${pixel.y}" fill="${pixel.fill}" data-color="${pixel.fill}"></rect>`;
        });
        selector(".main_svg").setAttribute("data-id", id);
        selector(".main_svg").innerHTML = thisPixels;
        console.log(selector(".main_svg"));

        selector(`.erase_btn`).classList.remove("active");
        selector(`.draw_btn`).classList.remove("active");
        selector(`.erase_btn`).setAttribute("checked", false);
        selector(`.draw_btn`).setAttribute("checked", false);
    };

    //*!  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! *//
    selectorAll(".btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            updateStorage();
            const btnRef = btn.getAttribute("ref");
            const btnName = btn.getAttribute("data-name");
            const btnModal = btn.getAttribute("data-modal");
            console.log(btnName);
            console.log(btnRef);
            switch (btnRef) {
                case "intro":
                    switch (btnName) {
                        case "skip":
                            modalWindowActions(close, "hello_modal");
                            if (selector(".intro_check").checked === true) {
                                console.log("ahi vas mano");
                                storageContent.intro["checkbox_status"] = btnName;
                                console.log(storageContent.intro["checkbox_status"]);
                                saveStorage();
                            }
                            break;
                        case "start":
                            break;
                    }
                    break;
                case "create_canvas":
                    modalWindowActions(close, btnModal);
                    const name = createArtNameInput.value;
                    let currentName = "";
                    if (name !== "" || name !== null) {
                        currentName = sanitizeInput(name);
                    } else {
                        currentName = "Unknown";
                    }

                    if (colorBgPixelInput.checked) {
                        console.log(colorBgPixelInput.checked);
                        createMainCanvas(currentName, parseInt(columnsPixelInput.textContent), parseInt(rowsPixelInput.textContent), bgPixelColor.value);
                        pageActions.pixel_start_color = bgPixelColor.value;
                        selectorAll(".main_pixel").forEach((pixel) => {
                            pixel.setAttribute("data-color", bgPixelColor.value);
                        });
                    } else {
                        pageActions.pixel_start_color = "transparent";
                        createMainCanvas(currentName, parseInt(columnsPixelInput.textContent), parseInt(rowsPixelInput.textContent), "transparent");
                        selectorAll(".main_pixel").forEach((pixel) => {
                            pixel.setAttribute("data-color", "transparent");
                        });
                    }

                    break;
                case "delete_data":
                    selectorAll(".delete_check").forEach((check) => {
                        const checkStorage = check.getAttribute("data-storage");
                        if (checkStorage === "all" && check.checked) {
                            console.log(checkStorage);
                            storageContent = pageData;
                            return;
                        } else if (check.checked && checkStorage !== "all") {
                            storageContent[checkStorage] = pageData[checkStorage];
                            if (checkStorage === "gallery" && check.checked) {
                                deleteChildElements(galleryContainer);
                                console.log(checkStorage);
                            } else if (checkStorage === "swatches" && check.checked) {
                                colorItemsCounter.textContent = storageContent[checkStorage].length;
                                swatchesEmptylabel.style.display = block;
                                deleteChildElements(swatchSavesFragment);
                                console.log(checkStorage);
                            }
                        }
                    });
                    modalWindowActions(close, "delete_modal");
                    pageActions.modal = close;
                    saveStorage();
                    break;
                case "cancel_refresh":
                    alertWindowActions(close, btnModal);

                    break;
                case "accept_refresh":
                    alertWindowActions(close, btnModal);
                    if (selector(".main_svg")) {
                        const startColor = pageActions.pixel_start_color;
                        selectorAll(".main_pixel").forEach((pixel) => {
                            pixel.setAttribute("fill", startColor);
                            pixel.setAttribute("data-color", startColor);
                        });
                        if (selector(".refresh_check").checked) {
                            storageContent.alerts.refresh_alert = "checked";
                            saveStorage();
                        }
                    } else {
                        console.log("no tienes canvas");
                    }
                    break;
                case "save_art":
                    modalWindowActions(close, "save_modal");

                    pageActions.modal = close;
                    let thisSaved = pageActions.pixels_to_save;
                    thisSaved.columns = pageActions.artColumns;
                    thisSaved.rows = pageActions.artRows;
                    thisSaved.id = createNewUniqueArray(8);
                    thisSaved.date = createDataDate();
                    if (saveArtNameInput.value !== "" && saveArtNameInput.value !== null) {
                        thisSaved.art_name = sanitizeInput(saveArtNameInput.value);
                        pageActions.art_name = sanitizeInput(saveArtNameInput.value);
                        mainCanvasTitle.textContent = sanitizeInput(saveArtNameInput.value);
                        console.log(thisSaved);
                        storageContent.gallery.push(thisSaved);
                        saveStorage();
                    } else {
                        let thisSaved = pageActions.pixels_to_save;
                        thisSaved.art_name = "unknown";
                        thisSaved.art_name = "unknown";
                        pageActions.art_name = "unknown";
                        mainCanvasTitle.textContent = "unknown";
                        console.log(thisSaved);
                        storageContent.gallery.push(thisSaved);
                        saveStorage();
                    }
                    break;
                case "download_art":
                    modalWindowActions(close, "save_modal");
                    pageActions.modal = close;
                    break;
                case "accept_save_swatch":
                    const storageSwatches = storageContent.swatches;
                    const pickerValue = colorPaletteInput.value;

                    const swatchName = selector(".inp_save_swatch_name").value;
                    console.log(pickerValue);

                    storageSwatches.push({
                        name: swatchName,
                        hexa_color: pickerValue,
                    });
                    colorItemsCounter.textContent = storageSwatches.length;
                    console.log(storageContent, storageSwatches);
                    saveStorage();
                    alertWindowActions(close, btnModal);
                    break;
                case "swatch_exist":
                    alertWindowActions(close, btnModal);
                    break;
            }
        });
    });
    selector(".control_all_check").addEventListener("input", () => {
        if (selector(".control_all_check").checked) {
            selector(".delete_gallery_check").checked = true;
            selector(".delete_swatches_check").checked = true;
            selector(".delete_alerts_check").checked = true;
        } else if (!selector(".control_all_check").checked) {
            selector(".delete_gallery_check").checked = false;
            selector(".delete_swatches_check").checked = false;
            selector(".delete_alerts_check").checked = false;
        }
    });
    selectorAll(".nav_action_btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const btnName = btn.getAttribute("data-name");
            const btnRef = btn.getAttribute("ref");
            console.log(btnRef);
            console.log(btnName);

            if (pageActions.btnActive !== "") {
                selector(`.${pageActions.btnActive}`).classList.remove("active");
            }
            btn.classList.add("active");
            if (pageActions.nav === close) {
                pageActions.btnActive = btnName;
                console.log(`Animation from ${pageActions.navsConfig[btnRef]} to ${pageActions.navOpen}`);
                animTranform(selector(`.${btnRef}`), pageActions.navsConfig[btnRef], pageActions.navOpen);
                pageActions.nav = btnRef;
            } else {
                if (pageActions.nav !== btnRef) {
                    pageActions.btnActive = btnName;
                    animTranform(selector(`.${btnRef}`), pageActions.navsConfig[btnRef], pageActions.navOpen);
                    animTranform(selector(`.${pageActions.nav}`), pageActions.navOpen, pageActions.navsConfig[pageActions.nav]);
                    pageActions.nav = btnRef;
                } else if (pageActions.nav === btnRef) {
                    animTranform(selector(`.${btnRef}`), pageActions.navOpen, pageActions.navsConfig[btnRef]);
                    pageActions.nav = close;
                    btn.classList.remove("active");
                    pageActions.btnActive = "";
                }
            }
        });
    });
    selectorAll(".modal_action_btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            console.log(btn);
            const btnRef = btn.getAttribute("ref");
            const btnName = btn.getAttribute("data-name");
            const btnModal = btn.getAttribute("data-modal");

            animTranform(selector(`.${btnRef}`), "translateY(0)", "translateY(-100%)");
            pageActions.nav = close;
            console.log(btnRef, btnName, btnModal);
            selector(".menu_btn").classList.remove("active");
            if (btnName !== "save_btn") {
                modalWindowActions(open, btnModal);
            }
            switch (btnName) {
                case "create_btn":
                    createDemoCanvas();
                    break;
                case "save_btn":
                    if (selector(".main_svg")) {
                        modalWindowActions(open, btnModal);
                        const artColumns = pageActions.artColumns;
                        const artRows = pageActions.artRows;

                        let classesStyle = "";
                        let classesCodeStyle = "";
                        let newPixels = "";
                        let codePixel = "";
                        let codeStyle = "";
                        let codeColors = [];
                        const thisPixels = [];
                        const thisColors = [];
                        saveArtNameInput.value = pageActions.art_name;
                        const svgPixels = selector(".main_svg").children;
                        console.log(svgPixels);

                        for (let loop = 0; loop < svgPixels.length; loop++) {
                            if (svgPixels[loop].getAttribute("fill"))
                                thisPixels.push({
                                    x: svgPixels[loop].getAttribute("x"),
                                    y: svgPixels[loop].getAttribute("y"),
                                    fill: svgPixels[loop].getAttribute("fill"),
                                });
                            if (!thisColors.includes(svgPixels[loop].getAttribute("fill"))) {
                                thisColors.push(svgPixels[loop].getAttribute("fill"));
                            }
                            if (svgPixels[loop].getAttribute("fill") !== "transparent" && !codeColors.includes(svgPixels[loop].getAttribute("fill"))) {
                                codeColors.push(svgPixels[loop].getAttribute("fill"));
                            }
                        }
                        console.log(thisPixels);
                        console.log(thisColors);
                        console.log(codeColors);

                        for (let loop = 0; loop < thisColors.length; loop++) {
                            classesStyle += `.clr-${loop}{fill:${thisColors[loop]}}`;
                            thisPixels.forEach((pixel) => {
                                if (pixel.fill === thisColors[loop]) {
                                    pixel.class = `clr-${loop}`;
                                }
                            });
                        }
                        for (let loop = 0; loop < codeColors.length; loop++) {
                            classesCodeStyle += `.clr-${loop}{fill:${codeColors[loop]}}`;
                            thisPixels.forEach((pixel) => {
                                if (pixel.fill === codeColors[loop]) {
                                    pixel.code_class = `clr-${loop}`;
                                }
                            });
                        }
                        for (let loop = 0; loop < thisPixels.length; loop++) {
                            newPixels += `<rect class="${thisPixels[loop].class}" width="1" height="1" x="${thisPixels[loop].x}" y="${thisPixels[loop].y}"></rect>`;
                        }
                        console.log(classesStyle);
                        console.log(newPixels);
                        const newSvg = `<svg class="saved_svg canvas_svg icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${artColumns} ${artRows}"><style>${classesStyle}</style>${newPixels}</svg>`;
                        console.log(newSvg);
                        selector(".save_canvas ").innerHTML = newSvg;

                        thisPixels.forEach((pixel) => {
                            console.log(pixel);
                            if (pixel.fill !== "transparent") {
                                codePixel += `<rect class="${pixel.code_class}" width="1" height="1" x="${pixel.x}" y="${pixel.y}"></rect>`;
                            }
                        });

                        const codeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${artColumns} ${artRows}"><style>${classesCodeStyle}</style>${codePixel}</svg>`;
                        selector(".svg_code").textContent = codeSvg;
                        const blob = new Blob([codeSvg], { type: "image/svg+xml" });
                        const url = URL.createObjectURL(blob);
                        const downloadBtn = selector(".download_art_btn");
                        downloadBtn.href = url;
                        pageActions.pixels_to_save = { pixels: thisPixels };
                    } else {
                        alertWindowActions(open, "canvas_alert");
                    }
                    break;
                case "gallery_btn":
                    updateStorage();
                    const currentGallery = storageContent.gallery;
                    if (currentGallery.length >= 1) {
                        deleteChildElements(galleryContainer);
                        galleryEmptylabel.style.display = none;
                        currentGallery.forEach((artItem) => {
                            /* console.log(artItem); */
                            let thisPixels = "";
                            artItem.pixels.forEach((pixel) => {
                                thisPixels += `<rect width="1" height="1" x="${pixel.x}" y="${pixel.y}" fill="${pixel.fill}"></rect>`;
                            });
                            galleryContainer.innerHTML += `<button type="button" class="gallery_item" id="${artItem.id}"><div class="icon_container"><svg class="gallery_icon icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${artItem.columns} ${artItem.rows}">${thisPixels}</svg></div><span class="label_item">${artItem.art_name}</span></button>`;

                            setTimeout(() => {
                                const galleryBtn = selectorAll(".gallery_item");
                                galleryBtn.forEach((btn) => {
                                    btn.addEventListener("click", () => {
                                        updateStorage();
                                        const btnId = btn.getAttribute("id");
                                        const thisItem = storageContent.gallery.filter((item) => item.id === btnId);
                                        createArtCanvas(thisItem);
                                        modalWindowActions(close, "gallery_modal");
                                    });
                                });
                            }, 500);
                        });
                    } else {
                        galleryEmptylabel.style.display = block;
                    }
                    break;
                case "swatch_btn":
                    updateStorage();
                    const storageSwatches = storageContent.swatches;
                    console.log(storageSwatches);
                    if (storageSwatches.length >= 1) {
                        deleteChildElements(modalSwatchesContainer);
                        selector(".swatches_modal").querySelector(".swatches_msg").style.display = none;
                        storageSwatches.forEach((color) => {
                            createSwatch(color);
                        });
                        modalSwatchesContainer.append(swatchSavesFragment);
                        setTimeout(() => swatchesBtnsAction(), 200);
                    } else {
                        deleteChildElements(modalSwatchesContainer);
                        selector(".swatches_modal").querySelector(".swatches_msg").style.display = block;
                    }
                    break;
                case "grid_btn":
                    break;
            }
        });
    });
    selectorAll(".check_color ").forEach((check) => {
        check.addEventListener("input", () => {
            const inputRef = check.getAttribute("ref");
            console.log(inputRef);
            if (check.checked) {
                selector(`.${inputRef}`).disabled = false;
                if (check.getAttribute("ref2")) {
                    console.log(check.getAttribute("ref2"));
                    selector(`.${check.getAttribute("ref2")}`).disabled = false;
                }
            } else {
                selector(`.${inputRef}`).disabled = true;
            }
        });
    });
    selectorAll(".pixels_number_btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const btnInput = btn.getAttribute("data-input");
            const btnRef = btn.getAttribute("ref");

            const thisInput = selector(`.${btnInput}`);
            console.log(btnInput, btnRef);
            if (parseInt(thisInput.textContent) === 2) {
                if (btnRef === "add") {
                    thisInput.textContent = parseInt(thisInput.textContent) + 1;
                }
            } else if (parseInt(thisInput.textContent) > 2) {
                if (btnRef === "add") {
                    thisInput.textContent = parseInt(thisInput.textContent) + 1;
                } else if (btnRef === "subtract") {
                    thisInput.textContent = parseInt(thisInput.textContent) - 1;
                }
            }

            createDemoCanvas();
        });
    });
    selectorAll(".grid_number_btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const btnInput = btn.getAttribute("data-input");
            const btnRef = btn.getAttribute("ref");

            const thisInput = selector(`.${btnInput}`);
            console.log(btnInput, btnRef);
            if (parseInt(thisInput.textContent) === 2) {
                if (btnRef === "add") {
                    thisInput.textContent = parseInt(thisInput.textContent) + 1;
                }
            } else if (parseInt(thisInput.textContent) > 2) {
                if (btnRef === "add") {
                    thisInput.textContent = parseInt(thisInput.textContent) + 1;
                } else if (btnRef === "subtract") {
                    thisInput.textContent = parseInt(thisInput.textContent) - 1;
                }
            }
        });
    });
    selectorAll(".close_btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const btnName = btn.getAttribute("data-name");
            const btnModal = btn.getAttribute("data-modal");
            const btnRef = btn.getAttribute("ref");
            console.log(btnRef);
            console.log(btnName);
            console.log(btnModal);
            if (btnRef === "alert") {
                console.log("close alert actions");
                alertWindowActions(close, btnModal);
            } else if (btnRef === "modal") {
                console.log("close modal actions");
                modalWindowActions(close, btnModal);
            }
        });
    });
    selectorAll(".input_number").forEach((input) => {
        input.addEventListener("input", () => {
            console.log(input.textContent);
            createDemoCanvas();
        });
    });
    selectorAll(".palette_action_btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const btnName = btn.getAttribute("data-name");
            const btnModal = btn.getAttribute("data-modal");
            switch (btnName) {
                case "save_swatch":
                case "swatch_btn":
                case "refresh_btn":
                    updateStorage();
            }

            const storageSwatches = storageContent.swatches;
            switch (btnName) {
                case "save_swatch":
                    const pickerValue = colorPaletteInput.value;
                    const swatchName = selector(".inp_save_swatch_name").value;
                    console.log(pickerValue);
                    console.log(storageSwatches.length);
                    if (storageSwatches.length >= 1) {
                        const search = storageSwatches.filter((item) => item.hexa_color === pickerValue);
                        console.log(search);
                        if (search.length === 0) {
                            alertWindowActions(open, btnModal);
                            selector(".save_swatch_alert").querySelector(".swatch_container").style.background = colorPaletteInput.value;
                            selector(".save_swatch_alert").querySelector(".swatch_container").querySelector(".label_swatch").textContent = colorPaletteInput.value;
                        } else if (search.length >= 1) {
                            alertWindowActions(open, "swatch_alert");
                            console.log("tienes repetido este color");
                        }
                    } else {
                        alertWindowActions(open, btnModal);
                        selector(".save_swatch_alert").querySelector(".swatch_container").style.background = colorPaletteInput.value;
                        selector(".save_swatch_alert").querySelector(".swatch_container").querySelector(".label_swatch").textContent = colorPaletteInput.value;
                    }

                    break;
                case "swatch_btn":
                    console.log(storageSwatches);
                    alertWindowActions(open, btnModal);
                    if (storageSwatches.length >= 1) {
                        console.log("con swatches");
                        deleteChildElements(alertSwatchesContainer);
                        selector(".swatches_alert").querySelector(".swatches_msg").style.display = none;
                        storageSwatches.forEach((color) => {
                            createSwatch(color);
                        });
                        alertSwatchesContainer.append(swatchSavesFragment);
                        setTimeout(() => swatchesBtnsAction(), 200);
                    } else {
                        console.log("sin swatches");

                        deleteChildElements(alertSwatchesContainer);
                        selector(".swatches_alert").querySelector(".swatches_msg").style.display = block;
                    }
                    break;
                case "draw_btn":
                    if (selector(`.${btnName}`).querySelector(".radio_input").checked && selector(".main_svg")) {
                        console.log(btnName);
                        selector(`.${btnName}`).classList.add("active");
                        selector(`.erase_btn`).classList.remove("active");
                        selectorAll(".main_pixel").forEach((pixel) => {
                            pixel.addEventListener("mouseenter", () => {
                                pixel.setAttribute("fill", colorPaletteInput.value);
                            });
                            pixel.addEventListener("mouseleave", () => {
                                const pixelColor = pixel.getAttribute("data-color");
                                pixel.setAttribute("fill", pixelColor);
                            });

                            pixel.addEventListener("pointerdown", (e) => {
                                console.log(e);
                                pixel.setAttribute("fill", colorPaletteInput.value);
                                pixel.setAttribute("data-color", colorPaletteInput.value);
                            });
                            pixel.addEventListener("pointerup", (e) => {
                                console.log(e);
                            });
                        });
                    } else if (selector(`.${btnName}`).querySelector(".radio_input").checked && !selector(".main_svg")) {
                        console.log("No tienes are de trabajo dumbass");
                        alertWindowActions(open, "canvas_alert");
                    }

                    break;
                case "erase_btn":
                    if (selector(`.${btnName}`).querySelector(".radio_input").checked && selector(".main_svg")) {
                        console.log(btnName);
                        selector(`.${btnName}`).classList.add("active");
                        selector(`.draw_btn`).classList.remove("active");
                        selectorAll(".main_pixel").forEach((pixel) => {
                            pixel.addEventListener("mouseenter", () => {
                                pixel.setAttribute("fill", "transparent");
                            });
                            pixel.addEventListener("mouseleave", () => {
                                const pixelColor = pixel.getAttribute("data-color");
                                pixel.setAttribute("fill", pixelColor);
                            });

                            pixel.addEventListener("pointerdown", (e) => {
                                pixel.setAttribute("fill", "transparent");
                                pixel.setAttribute("data-color", "transparent");
                            });
                        });
                    } else if (selector(`.${btnName}`).querySelector(".radio_input").checked && !selector(".main_svg")) {
                        console.log("No tienes are de trabajo dumbass");
                    }

                    break;
                case "refresh_btn":
                    console.log(btnName);
                    console.log(btnModal);
                    console.log(storageContent.alerts.refresh_alert);
                    if (storageContent.alerts.refresh_alert === none) {
                        alertWindowActions(open, btnModal);
                    } else {
                        const startColor = pageActions.pixel_start_color;
                        selectorAll(".main_pixel").forEach((pixel) => {
                            pixel.setAttribute("fill", startColor);
                            pixel.setAttribute("data-color", startColor);
                        });
                    }
                    break;
            }
        });
    });

    const setClipboard = (text) => {
        const type = "text/plain";
        const blob = new Blob([text], { type });
        const data = [new ClipboardItem({ [type]: blob })];
        navigator.clipboard.write(data);
    };
    selector(".code_btn").addEventListener("click", () => {
        const code = selector(".svg_code");
        setClipboard(code.textContent);
    });
    //*!  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! *//

    const checkStorage = () => {
        storageContent = JSON.parse(localStorage.getItem(storageName));
        if (!storageContent) {
            storageContent = pageData;
            BODY.className = storageContent.theme;
            saveStorage();
        } else {
            updateStorage();
            BODY.className = storageContent.theme;
            const storageSwatches = storageContent.swatches;

            if (storageSwatches.length >= 1) {
                colorItemsCounter.textContent = storageSwatches.length;
            }
            if (storageContent.intro.checkbox_status === "skip") {
                modalWindowActions(close, "hello_modal");
            }
        }
    };
    checkStorage();
    const closeOpening = () => {
        setTimeout(() => {
            const openening = selector(".opening");
            openening.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000, easing: "linear", fill: "forwards" });
            setTimeout(() => (openening.style.display = none), 1200);
        }, 4000);
    };
    /* closeOpening(); */
    //*!  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! *//

    const themeBtn = selector(".theme_btn");
    const changeTheme = () => {
        updateStorage();

        switch (storageContent.theme) {
            case "light_theme":
                storageContent.theme = "dark_theme";
                break;
            case "dark_theme":
                storageContent.theme = "light_theme";
                break;
        }
        saveStorage();
        BODY.className = storageContent.theme;
    };
    themeBtn.addEventListener("click", () => changeTheme());
});
