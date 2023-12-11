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
        config: open,
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
        search_param: "gallery",
    };

    //*^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ *//
    const $d = document;

    const selector = (tag) => $d.querySelector(`${tag}`);
    const selectorAll = (tag) => $d.querySelectorAll(`${tag}`);
    //*^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ *//
    const swatchSavesFragment = $d.createDocumentFragment();
    const swatchTemplate = selector(".swatch_template").content;
    const artItemsSavesFragment = $d.createDocumentFragment();
    const artTemplate = selector(".art_template").content;

    const BODY = selector("body");
    const config = selector(".config");
    const alert = selector(".alert");
    const popup = selector(".popup");
    const popupSwatchesContainer = selector(".popup_swatches_container");
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

    const searchItemsContainer = selector(".searched_items_container");
    //¿ UTILS

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
    const properCase = (string) => {
        return `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`;
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
    const closeConfig = () => {
        pageActions.config = close;
        config.style.opacity = 0;
        setTimeout(() => {
            config.style.display = none;
        }, 1000);
    };
    const openConfig = () => {
        pageActions.config = open;
        config.style.display = block;
        setTimeout(() => {
            config.style.opacity = 1;
        }, 200);
    };
    const configWindowActions = (action, window) => {
        const thisWindow = selector(`.${window}`);
        if (action === open) {
            openConfig();
            thisWindow.style.display = block;
        } else if (action === close) {
            closeConfig();
            setTimeout(() => (thisWindow.style.display = none), 1200);
        }
    };

    const closeAlert = () => {
        pageActions.alert = close;
        alert.style.opacity = 0;
        setTimeout(() => {
            alert.style.display = none;
        }, 1000);
    };
    const openAlert = () => {
        alert.style.display = block;
        setTimeout(() => {
            alert.style.opacity = 1;
        }, 200);
    };
    const alertWindowActions = (action, window, msg = "", itemToDelete = []) => {
        const thisWindow = selector(`.${window}`);
        const thisMsg = thisWindow.querySelector("P");
        if (action === open) {
            console.log(window);
            switch (window) {
                case "delete_alert":
                    msg = "¿Estas a punto de eliminar el siguiente item, quieres proceder?";
                    console.log(itemToDelete);
                    selector(".delete_alert").querySelector("ol").innerHTML = `<li>${itemToDelete.name}</li>`;
                    break;
            }
            thisMsg.textContent = msg;
            thisWindow.style.display = block;
            openAlert();
        } else if (action === close) {
            closeAlert();
            setTimeout(() => (thisWindow.style.display = none), 600);
        }
    };
    const changePopup = (popupFrom, popupTo, msg = "") => {
        const from = selector(`.${popupFrom}`);
        const to = selector(`.${popupTo}`);

        from.style.display = none;
        if (popupTo === "edit_popup") {
            selector(`.${popupTo}`).querySelector(".original_item_name").textContent = msg;
        }
        setTimeout(() => {
            to.style.display = block;
        }, 100);
    };
    const openPopUp = () => {
        popup.style.display = block;
        setTimeout(() => {
            popup.style.opacity = 1;
        }, 100);
    };
    const closePopUp = () => {
        popup.style.opacity = 0;
        setTimeout(() => {
            popup.style.display = none;
        }, 500);
    };
    const popupWindowActions = (action, window, msg = "") => {
        console.log(action);
        console.log(window);

        const thisWindow = selector(`.${window}`);
        console.log(thisWindow);
        if (action === open) {
            openPopUp();
            thisWindow.style.display = block;
            if (window === "edit_popup") {
                selector(`.${window}`).querySelector(".original_item_name").textContent = msg;
            }
        } else if (action === close) {
            closePopUp();
            setTimeout(() => {
                if (window === "edit_popup") {
                    selector(`.${window}`).querySelector(".input_text").value = "";
                }
                thisWindow.style.display = none;
            }, 600);
        }
    };

    //*!  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! *//
    const createSwatch = (item, container) => {
        const thisName = item.name.replace(" ", "_");
        console.log(thisName);
        const thisTemp = swatchTemplate.cloneNode(true);
        const thisItem = thisTemp.querySelector(".swatch_item");
        const thisCheck = thisTemp.querySelector(".swatch_item_check");
        const thisGoToBtn = thisTemp.querySelector(".goTo_item_btn");
        const thisEditBtn = thisTemp.querySelector(".edit_item_btn");
        const thisDeleteBtn = thisTemp.querySelector(".delete_item_btn");
        const swatchContainer = thisTemp.querySelector(".swatch_container");
        const colorLabel = thisTemp.querySelector(".label_swatch");
        const colorName = thisTemp.querySelector(".label_name");
        thisGoToBtn.setAttribute("data-color", item.hexa_color);
        thisGoToBtn.setAttribute("id", `goTo_${thisName}`);
        thisEditBtn.setAttribute("data-color", item.hexa_color);
        thisEditBtn.setAttribute("id", `edit_${thisName}`);
        thisEditBtn.setAttribute("data-id", item.id);
        thisDeleteBtn.setAttribute("data-color", item.hexa_color);
        thisDeleteBtn.setAttribute("id", `delete_${thisName}`);
        thisDeleteBtn.setAttribute("data-id", item.id);
        thisCheck.setAttribute("data-id", item.id);
        swatchContainer.style.background = item.hexa_color;
        colorLabel.textContent = item.hexa_color;
        colorName.textContent = item.name;
        container.append(thisItem);
    };
    const createArtItem = (item, container) => {
        const thisTemp = artTemplate.cloneNode(true);
        const thisItem = thisTemp.querySelector(".art_item");
        const thisCheck = thisTemp.querySelector(".art_item_check");
        const thisSvg = thisTemp.querySelector(".gallery_icon");
        const thisGoToBtn = thisTemp.querySelector(".goTo_item_btn");
        const thisEditBtn = thisTemp.querySelector(".edit_item_btn");
        const thisDeleteBtn = thisTemp.querySelector(".delete_item_btn");
        let thisPixels = "";
        item.pixels.forEach((pixel) => {
            thisPixels += `<rect width="1" height="1" x="${pixel.x}" y="${pixel.y}" fill="${pixel.fill}"></rect>`;
        });
        let thisViewBox = `0 0 ${item.columns} ${item.rows}`;
        thisSvg.setAttribute("viewBox", thisViewBox);
        thisSvg.innerHTML = thisPixels;
        const colorName = thisTemp.querySelector(".label_name");
        thisGoToBtn.setAttribute("data-id", item.id);
        thisGoToBtn.setAttribute("id", `goTo_${item.id}`);
        thisEditBtn.setAttribute("data-id", item.id);
        thisEditBtn.setAttribute("id", `edit_${item.id}`);
        thisDeleteBtn.setAttribute("data-id", item.id);
        thisDeleteBtn.setAttribute("id", `delete_${item.id}`);
        thisCheck.setAttribute("data-id", item.id);
        thisItem.setAttribute("id", item.id);
        colorName.textContent = item.name;
        container.append(thisItem);
    };

    const itemBtnsAction = (type) => {
        let thisItem;
        selectorAll(".item_action_btn").forEach((btn) => {
            let thisId = btn.getAttribute("id");
            selector(`#${thisId}`).addEventListener("click", () => {
                const thisBtn = selector(`#${thisId}`);
                const btnAction = thisBtn.getAttribute("data-action");
                const btnId = thisBtn.getAttribute("data-id");
                if (type === "swatches") {
                    thisItem = storageContent.swatches.filter((item) => item.id === btnId);
                } else if (type === "gallery") {
                    thisItem = storageContent.gallery.filter((item) => item.id === btnId);
                }
                if (btnAction === "goTo") {
                    switch (type) {
                        case "swatches":
                            popupWindowActions(close, "search_popup");
                            const thisColor = thisBtn.getAttribute("data-color");
                            console.log(thisColor);
                            colorPaletteInput.value = thisColor;
                            break;
                        case "gallery":
                            const btnId = thisBtn.getAttribute("data-id");
                            thisItem = storageContent.gallery.filter((item) => item.id === btnId);
                            createArtCanvas(thisItem);
                            configWindowActions(close, "gallery_config");
                            break;
                    }
                } else if (btnAction === "edit") {
                    switch (type) {
                        case "swatches":
                            console.log(thisItem[0].name);
                            changePopup("swatches_popup", "edit_popup", thisItem[0].name);
                            break;
                        case "gallery":
                            configWindowActions(close, "gallery_config");
                            console.log(thisItem[0].name);
                            setTimeout(() => {
                                popupWindowActions(open, "edit_popup", thisItem[0].name);
                            }, 600);
                            break;
                    }
                    pageActions.edit_item = thisItem[0];
                } else if (btnAction === "delete") {
                    switch (type) {
                        case "swatches":
                            popupWindowActions(close, "search_popup");
                            break;
                        case "gallery":
                            configWindowActions(close, "gallery_config");
                            break;
                    }
                    setTimeout(() => {
                        alertWindowActions(open, "delete_alert", "", thisItem[0]);
                    }, 600);
                    pageActions.edit_item = thisItem[0];
                }
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
            const btnRef = btn.getAttribute("ref");
            const btnName = btn.getAttribute("data-name");
            const btnModal = btn.getAttribute("data-modal");
            console.log(btnName);
            console.log(btnRef);
            console.log(btnModal);
            switch (btnRef) {
                case "intro":
                    switch (btnName) {
                        case "skip":
                            configWindowActions(close, btnModal);
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
                    configWindowActions(close, btnModal);
                    const name = sanitizeInput(createArtNameInput.value);
                    let currentName = "";
                    if (name === "" || name === null) {
                        currentName = "Unknown";
                    } else if (name !== "" || name !== null) {
                        currentName = name;
                    }
                    console.log(currentName);
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
                    configWindowActions(close, btnModal);
                    pageActions.config = close;
                    saveStorage();
                    break;

                case "basic_alert_accept":
                case "delete_alert_cancel":
                    alertWindowActions(close, btnModal);
                    break;
                case "delete_alert_accept":
                    const thisId = pageActions.edit_item.id;
                    console.log(thisId);
                    const isInSwatches = storageContent.swatches.filter((item) => item.id === thisId);
                    const isInGallery = storageContent.gallery.filter((item) => item.id === thisId);
                    console.log(isInSwatches);
                    console.log(isInGallery);
                    let thisContainer = "";
                    if (isInGallery.length === 1) {
                        console.log("is in gallery");
                        thisContainer = "gallery";
                    } else if (isInSwatches.length === 1) {
                        console.log("is in swatches");
                        thisContainer = "swatches";
                    }
                    const newArray = storageContent[thisContainer].filter((item) => item.id !== thisId);
                    console.log(newArray);
                    storageContent[thisContainer] = newArray;
                    saveStorage();
                    if (thisContainer === "swatches") {
                        selector(".items_counter").textContent = storageContent[thisContainer].length;
                    }

                    alertWindowActions(close, btnModal);
                    break;

                case "accept_refresh":
                case "cancel_refresh":
                case "cancel_save_swatch":
                    popupWindowActions(close, btnModal);
                case "accept_refresh":
                    if (selector(".main_svg")) {
                        const startColor = pageActions.pixel_start_color;
                        selectorAll(".main_pixel").forEach((pixel) => {
                            pixel.setAttribute("fill", startColor);
                            pixel.setAttribute("data-color", startColor);
                        });
                        if (selector(".refresh_check").checked) {
                            console.log("check of refresh on");
                            storageContent.alerts.refresh_alert = "checked";
                            saveStorage();
                        }
                    } else {
                        console.log("no tienes canvas");
                    }
                    break;
                case "save_art":
                    configWindowActions(close, btnModal);

                    pageActions.config = close;
                    let thisSaved = pageActions.pixels_to_save;
                    thisSaved.columns = pageActions.artColumns;
                    thisSaved.rows = pageActions.artRows;
                    thisSaved.id = createNewUniqueArray(8);
                    thisSaved.date = createDataDate();
                    const galleryItems = storageContent.gallery;
                    const searchUnknown = galleryItems.filter((item) => (item.name.toLowerCase().includes("unknown") ? item : false));
                    console.log(searchUnknown);
                    if (saveArtNameInput.value === "" || saveArtNameInput.value.toLowerCase().includes("unknown")) {
                        let thisName = "";
                        if (saveArtNameInput.value === "") {
                            thisName = "unknown";
                        } else {
                            thisName = saveArtNameInput.value;
                        }
                        const sameName = searchUnknown.length;
                        if (sameName >= 1) {
                            let thisSaved = pageActions.pixels_to_save;
                            thisSaved.name = `${thisName.slice(0, 7)}_${sameName}`;
                            thisSaved.name = `${thisName.slice(0, 7)}_${sameName}`;
                            pageActions.name = `${thisName.slice(0, 7)}_${sameName}`;
                            mainCanvasTitle.textContent = `${thisName.slice(0, 7)}_${sameName}`;
                            console.log(thisSaved);
                            storageContent.gallery.push(thisSaved);
                        } else if (sameName === 0) {
                            let thisSaved = pageActions.pixels_to_save;
                            thisSaved.name = "Unknown";
                            thisSaved.name = "Unknown";
                            pageActions.name = "Unknown";
                            mainCanvasTitle.textContent = "Unknown";
                            console.log(thisSaved);
                            storageContent.gallery.push(thisSaved);
                        }
                        saveStorage();
                    } else if (saveArtNameInput.value !== "" && saveArtNameInput.value !== null) {
                        let thisName = (thisSaved.name = sanitizeInput(saveArtNameInput.value).toLowerCase());
                        console.log(thisName);
                        const searchName = galleryItems.filter((item) => (item.name.toLowerCase() === thisName || item.name === thisName ? item : false));
                        console.log(searchName);
                        if (searchName.length >= 1) {
                            alertWindowActions(open, "basic_alert", "Ya tienes un item guardado con ese nombre, por favor escogue un nombre diferente");
                        } else {
                            pageActions.name = sanitizeInput(saveArtNameInput.value);
                            mainCanvasTitle.textContent = sanitizeInput(saveArtNameInput.value);
                            console.log(thisSaved);
                            storageContent.gallery.push(thisSaved);
                        }
                        saveStorage();
                    }
                    break;
                case "download_art":
                    configWindowActions(close, "save_modal");
                    pageActions.config = close;
                    break;

                case "accept_save_swatch":
                    const storageSwatches = storageContent.swatches;
                    const pickerValue = colorPaletteInput.value;
                    //! AGREGAR CHECK DE TEXTO VACIO Y APERTURA DE ALERT POR NO NOMBRE
                    const swatchName = selector(".inp_save_swatch_name").value;
                    console.log(pickerValue);

                    if (swatchName === "") {
                        alertWindowActions(open, "basic_alert", "No puedes salvar tu muestra sin un nombre, por favor coloca uno antes de intentar salvarla");
                    } else {
                        const searchName = storageSwatches.find((item) => {
                            if (item.name === swatchName) return item;
                        });
                        console.log(searchName);
                        if (searchName) {
                            alertWindowActions(open, "basic_alert", "Ese nombre de muestra ya existe, por favor ingresa uno diferente");
                        } else {
                            storageSwatches.push({
                                name: swatchName,
                                hexa_color: pickerValue,
                                id: createNewUniqueArray(8),
                            });
                            colorItemsCounter.textContent = storageSwatches.length;
                            console.log(storageContent, storageSwatches);
                            saveStorage();
                            popupWindowActions(close, btnModal);
                        }
                    }

                    break;

                case "search_popup_accept":
                case "edit_popup_accept":
                    popupWindowActions(close, btnModal);
                    break;

                case "canvas_create":
                    alertWindowActions(close, "basic_alert");
                    setTimeout(() => {
                        configWindowActions(open, "create_config");
                        createDemoCanvas();
                    }, 50);

                    break;
                case "alert_delete_accept":
                    alertWindowActions(close, btnModal);

                    break;
                case "alert_delete_cancel":
                    alertWindowActions(close, btnModal);

                    break;

                case "edit_item_name_accept":
                    const newName = sanitizeInput(selector(".inp_change_name").value);
                    if (newName !== "") {
                        const thisId = pageActions.edit_item.id;
                        const thisName = pageActions.edit_item.name;
                        console.log(thisId);
                        const isInSwatches = storageContent.swatches.filter((item) => item.id === thisId);
                        const isInGallery = storageContent.gallery.filter((item) => item.id === thisId);
                        console.log(isInSwatches);
                        console.log(isInGallery);
                        let thisContainer = "";
                        if (isInGallery.length === 1) {
                            console.log("is in gallery");
                            thisContainer = "gallery";
                        } else if (isInSwatches.length === 1) {
                            console.log("is in swatches");
                            thisContainer = "swatches";
                        }
                        storageContent[thisContainer].forEach((item) => {
                            if (thisName === newName) {
                                alertWindowActions(open, "basic_alert", "Estas colocando el mismo nombre, si quieres mantenerlo cancela la acción o cierra la ventana");
                            } else {
                                if (item.id !== thisId) {
                                    if (item.name === newName) {
                                        alertWindowActions(open, "basic_alert", "Ese nombre ya existe, por favor elige un nuevo nombre");
                                    }
                                } else if (item.id === thisId) {
                                    if (item.name !== newName) {
                                        item.name = newName;
                                        saveStorage();
                                        popupWindowActions(close, "edit_popup");
                                    }
                                }
                            }
                        });
                    } else if (newName === "") {
                        alertWindowActions(open, "basic_alert", "Necesitas Colocar un nombre para poder hacer el cambio, si no cancele la operación");
                    }

                    break;
                case "edit_item_name_cancel":
                    popupWindowActions(close, "edit_popup");

                    break;
            }
        });
    });
    selectorAll(".search_btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            selector(".inp_search_name").value = "";
            const searchRef = btn.getAttribute("ref");
            const btnAction = btn.getAttribute("data-action");
            const btnFrom = btn.getAttribute("data-from");
            const btnTo = btn.getAttribute("data-to");

            console.log(btnFrom);
            console.log(btnTo);
            console.log(searchRef);
            console.log(btnAction);

            deleteChildElements(searchItemsContainer);
            if (searchRef === "swatches") {
                changePopup(btnFrom, btnTo);
                pageActions.search_param = searchRef;
                selector(".search_ref").textContent = "Muestras";
                const currentSwatches = storageContent.swatches;
                if (currentSwatches.length >= 1) {
                    currentSwatches.forEach((color) => {
                        createSwatch(color, searchItemsContainer);
                    });
                }
            } else if (searchRef === "gallery") {
                configWindowActions(close, "gallery_config");
                popupWindowActions(open, "search_popup");
                pageActions.search_param = searchRef;
                selector(".search_ref").textContent = "Galeria";
                const currentGallery = storageContent.gallery;
                if (currentGallery.length >= 1) {
                    currentGallery.forEach((artItem) => {
                        createArtItem(artItem, searchItemsContainer);
                    });
                }
            }
            setTimeout(() => itemBtnsAction(searchRef), 200);
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
    selectorAll(".config_action_btn").forEach((btn) => {
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
                configWindowActions(open, btnModal);
            }
            switch (btnName) {
                case "create_btn":
                    createDemoCanvas();
                    break;
                case "save_btn":
                    if (selector(".main_svg")) {
                        configWindowActions(open, btnModal);
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
                        //! console.log(classesStyle);
                        //! console.log(newPixels);
                        const newSvg = `<svg class="saved_svg canvas_svg icon_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${artColumns} ${artRows}"><style>${classesStyle}</style>${newPixels}</svg>`;
                        //! console.log(newSvg);
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
                        alertWindowActions(open, "basic_alert", "Para poder acceder a esta funcionalidad primero tienes que crear un canvas");
                    }
                    break;
                case "gallery_btn":
                    const currentGallery = storageContent.gallery;

                    deleteChildElements(galleryContainer);
                    if (currentGallery.length >= 1) {
                        galleryEmptylabel.style.display = none;
                        currentGallery.forEach((artItem) => {
                            createArtItem(artItem, galleryContainer);
                        });
                        setTimeout(() => {
                            itemBtnsAction("gallery");
                            selectorAll(".art_item").forEach((item) => {
                                let thisId = item.getAttribute("id");
                                setTimeout(() => {
                                    item.addEventListener("change", () => {
                                        console.log(item);
                                        if (item.check) {
                                            console.log(thisId);
                                        }
                                    });
                                }, 200);
                            });
                        }, 200);
                    } else {
                        galleryEmptylabel.style.display = block;
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
            if (btnRef === "popup") {
                console.log("close popup actions");
                popupWindowActions(close, btnModal);
            } else if (btnRef === "config") {
                console.log("close config actions");
                configWindowActions(close, btnModal);
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
                            const searchName = storageSwatches.filter((item) => item.name == "New Swatch");
                            console.log(searchName);
                            selector(".inp_save_swatch_name").value = "";
                            popupWindowActions(open, btnModal);
                            selector(".save_swatch_popup").querySelector(".swatch_container").style.background = colorPaletteInput.value;
                            selector(".save_swatch_popup").querySelector(".swatch_container").querySelector(".label_swatch").textContent = colorPaletteInput.value;
                        } else if (search.length >= 1) {
                            alertWindowActions(open, "basic_alert", `Tienes Repetida esta muestra,la puedes encontrar con el nombre de "${search[0].name}".`);
                            console.log("tienes repetido este color");
                        }
                    } else {
                        selector(".inp_save_swatch_name").value = "";
                        popupWindowActions(open, btnModal);
                        selector(".save_swatch_popup").querySelector(".swatch_container").style.background = colorPaletteInput.value;
                        selector(".save_swatch_popup").querySelector(".swatch_container").querySelector(".label_swatch").textContent = colorPaletteInput.value;
                    }

                    break;
                case "swatch_btn":
                    console.log(storageSwatches);
                    popupWindowActions(open, btnModal);

                    deleteChildElements(popupSwatchesContainer);
                    if (storageSwatches.length >= 1) {
                        console.log("con swatches");
                        selector(".swatches_popup").querySelector(".swatches_msg").style.display = none;
                        storageSwatches.forEach((color) => {
                            createSwatch(color, popupSwatchesContainer);
                        });
                        setTimeout(() => itemBtnsAction("swatches"), 200);
                    } else {
                        console.log("sin swatches");
                        selector(".swatches_popup").querySelector(".swatches_msg").style.display = block;
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
                        alertWindowActions(open, "basic_alert", "Para poder acceder a esta funcionalidad primero tienes que crear un canvas");
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
                        alertWindowActions(open, "basic_alert", "Para poder acceder a esta funcionalidad primero tienes que crear un canvas");
                        console.log("No tienes are de trabajo dumbass");
                    }

                    break;
                case "refresh_btn":
                    console.log(btnName);
                    console.log(btnModal);
                    console.log(storageContent.alerts.refresh_alert);
                    if (storageContent.alerts.refresh_alert === none) {
                        popupWindowActions(open, btnModal);
                    } else if (storageContent.alerts.refresh_alert === "checked") {
                        let startColor = pageActions.pixel_start_color;
                        console.log(startColor);
                        if (startColor === "") {
                            startColor = "transparent";
                        }
                        console.log(startColor);
                        selectorAll(".main_pixel").forEach((pixel) => {
                            pixel.setAttribute("fill", startColor);
                            pixel.setAttribute("data-color", startColor);
                        });
                    }
                    break;
            }
        });
    });
    const checkSearch = (e) => {
        const currentSearch = pageActions.search_param;
        const mySearch = e.target.value;
        console.log(mySearch);
        const swatchesList = storageContent.swatches;
        const pixartList = storageContent.gallery;

        const newSearch = [];
        let whatType = "";
        let properSearchName;
        if (mySearch.toString().length >= 1) {
            properSearchName = mySearch.toLowerCase();
            deleteChildElements(searchItemsContainer);
            switch (currentSearch) {
                case "swatches":
                    whatType = "swatches";
                    //! console.log(swatchesList);
                    swatchesList.forEach((swatch) => {
                        const swatchName = swatch.name;
                        const swatchColor = swatch.hexa_color;
                        const nameSplit = swatchName.split(" ");
                        //! console.log(properSearchName);
                        if (properSearchName === "") {
                            console.log("Es un string vacio");
                        } else {
                            nameSplit.forEach((palabra) => {
                                const includes = palabra.toLowerCase().includes(properSearchName);
                                if (includes) {
                                    if (!newSearch.includes(swatch)) {
                                        newSearch.push(swatch);
                                    }
                                    //! console.log(artName, artDate);
                                }
                            });
                        }
                    });

                    newSearch.forEach((color) => {
                        createSwatch(color, searchItemsContainer);
                    });
                    break;
                case "gallery":
                    whatType = "gallery";
                    pixartList.forEach((artItem) => {
                        const artName = artitem.name;
                        const artDate = artItem.date;
                        const nameSplit = artName.split(" ");
                        if (properSearchName === "") {
                            console.log("Es un string vacio");
                        } else {
                            nameSplit.forEach((palabra) => {
                                const includes = palabra.toLowerCase().includes(properSearchName);
                                if (includes) {
                                    if (!newSearch.includes(artItem)) {
                                        newSearch.push(artItem);
                                    }
                                    //! console.log(artName, artDate);
                                }
                            });
                        }
                    });

                    newSearch.forEach((artItem) => {
                        console.log(artItem);
                        createArtItem(artItem, searchItemsContainer);
                    });
                    break;
            }
            console.log(`Estas buscando ${whatType}`);
            console.log(newSearch);
        } else if (mySearch.toString().length === 0) {
            properSearchName = mySearch.toString();
            deleteChildElements(searchItemsContainer);
            if (currentSearch === "swatches") {
                const currentSwatches = storageContent.swatches;
                if (currentSwatches.length >= 1) {
                    currentSwatches.forEach((color) => {
                        createSwatch(color, searchItemsContainer);
                    });
                }
            } else if (currentSearch === "gallery") {
                const currentGallery = storageContent.gallery;
                if (currentGallery.length >= 1) {
                    currentGallery.forEach((artItem) => {
                        createArtItem(artItem, searchItemsContainer);
                    });
                }
            }
        }

        setTimeout(() => {
            itemBtnsAction(whatType);
        }, 200);
    };
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
            storageContent = JSON.parse(localStorage.getItem(storageName));
            console.log("Actualizando con storageData");
            console.log(storageContent);
            BODY.className = storageContent.theme;
            const storageSwatches = storageContent.swatches;

            if (storageSwatches.length >= 1) {
                colorItemsCounter.textContent = storageSwatches.length;
            }
            if (storageContent.intro.checkbox_status === "skip") {
                configWindowActions(close, "hello_config");
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
    selector(".inp_search_name").addEventListener("input", (e) => {
        setTimeout(() => checkSearch(e), 500);
    });
    /* closeOpening(); */
    //*!  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! *//

    const themeBtn = selector(".theme_btn");
    const changeTheme = () => {
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
