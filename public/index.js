let isMenuOpen = false;
let isPontoFormOpen = false;
let mouseEscolhendo = false;

async function initMap() {

    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    let allPontos = [];

    let pontos = document.getElementById("pontos");
    let menuBtn = document.getElementById("menuBtn");
    let menu = document.getElementById("menu");
    let mapHTML = document.getElementById("map");
    let novoPontoBtn = document.getElementById("novoPontoBtn");
    let pontoForm = document.getElementById("pontoForm");
    let sendForm = document.getElementById("sendForm");
    let cancelForm = document.getElementById("cancelForm");
    let nome = document.getElementById("nome");
    let lat = document.getElementById("lat");
    let lng = document.getElementById("lng");
    let formError = document.getElementById("formError");
    let latlngMouseClick = document.getElementById("latlngMouseClick");

    // unifor
    const position = { lat: -3.768775296197842, lng: -38.47808246121602 };

    let map = new Map(mapHTML, {
        zoom: 18,
        center: position, // unifor
        mapId: "DEMO_MAP_ID",
        disableDefaultUI: true
    });

    function updatePontos() {
        pontos.replaceChildren();
        allPontos.forEach((ponto) => {
            let div = document.createElement("div");
            div.classList.add("ponto");
            let button1 = document.createElement("button");
            let spanDel = document.createElement("span");
            spanDel.textContent = "delete";
            spanDel.classList.add("material-icons");
            button1.append(spanDel);

            button1.addEventListener("click", () => {
                ponto.map = null;
                allPontos = allPontos.filter(a => a !== ponto);
                updatePontos();
            })

            let button2 = document.createElement("button")
            button2.classList.add("pontoNome");
            if (ponto.title === "") {
                button2.textContent = "(sem nome)";
                button2.classList.add("pontoSemNome");
            } else {
                button2.textContent = ponto.title;
            }

            button2.addEventListener("click", () => {
                map.panTo(ponto.position);
            });

            div.append(button1, button2);
            pontos.append(div);
        });
    }

    function addPonto(ponto) {
        let marker = new AdvancedMarkerElement({
            map,
            position: { lat: ponto["lat"], lng: ponto["lng"] },
            gmpDraggable: true,
            title: ponto["nome"],
        });

        marker.addListener("click", () => {
            let infowindow = new InfoWindow({
                content: `<h1><b>${marker.title}</b></h1>` +
                    `<p>${JSON.stringify(marker.position)}</p>`,
                ariaLabel: marker.title,
            });
            infowindow.open({
                anchor: marker,
                map,
            });
        });

        allPontos.push(marker);

        updatePontos();
    }


    menuBtn.addEventListener("click", () => {
        if (!isMenuOpen) {
            isMenuOpen = true;
            if (screen.width > 800) {
                menu.style.transform = "translateX(15vw)";
                menuBtn.style.transform = "translateX(15vw)";
                menuBtn.firstChild.textContent = "close";
                menuBtn.title = "Fechar menu";
                mapHTML.style.transform = "translateX(15vw)";
                mapHTML.style.width = "85%";
            } else {
                menu.style.transform = "translateX(100vw)";
                menuBtn.firstChild.textContent = "close";
                menuBtn.title = "Fechar menu";
                mapHTML.style.transform = "translateX(100vw)";
                mapHTML.style.width = "100%";
            }
        } else {
            isMenuOpen = false;
            menu.style.transform = "";
            menuBtn.style.transform = "";
            menuBtn.firstChild.textContent = "menu";
            mapHTML.style.transform = "";
            mapHTML.style.width = "100%";
            menuBtn.title = "Abrir menu";
        }
    }, false);

    novoPontoBtn.addEventListener("click", () => {
        novoPontoBtn.style.display = "none";
        pontoForm.style.display = "block"
    });

    cancelForm.addEventListener("click", () => {
        novoPontoBtn.style.display = "block";
        pontoForm.style.display = "none";
    });

    sendForm.addEventListener("click", () => {
        if (lat.value == "" && lng.value == "") {
            formError.textContent = "Latitude e longitude precisam ser números";
            formError.style.display = "block";
            return;
        } else if (lat.value == "") {
            formError.textcontent = "A latitude precisa ser um número";
            formError.style.display = "block";
            return;
        } else if (lng.value == "") {
            formError.textcontent = "A longitude precisa ser um número";
            formError.style.display = "block";
            return;
        } else {
            formError.textcontent = "";
            formError.style.display = "none";
            addPonto({ nome: nome.value, lat: Number(lat.value), lng: Number(lng.value) });
        }
    });

    latlngMouseClick.addEventListener("click", () => {
        if (!mouseEscolhendo) {
            latlngMouseClick.style.border = "1px solid #4195fc";
            mouseEscolhendo = true;
        }
    });

    map.addListener("click", (mapsMouseEvent) => {
        if (mouseEscolhendo) {
            latlngMouseClick.style.border = "unset";
            lat.value = mapsMouseEvent.latLng.lat();
            console.log(lat.value);
            lng.value = mapsMouseEvent.latLng.lng();
            console.log(lng.value);
        }
        mouseEscolhendo = false;
    });
}

initMap();
