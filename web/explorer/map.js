export let m;
export let shape;
export let clearShapes;

function initMap() {
    m = new google.maps.Map(
        document.getElementById("map"),
        {
            center: { lat: -28.8908, lng: 132.3757 }, // centered over Australia by default
            streetViewControl: false,
            zoom: 4,
        }
    );

    const shapeOptions = {
        strokeColor: "green",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "green",
        fillOpacity: 0.35
    };
    const markerOptions = {};

    let drawingManager = new google.maps.drawing.DrawingManager({
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.RECTANGLE,
                // google.maps.drawing.OverlayType.POLYGON,
            ],
        },
        markerOptions: markerOptions,
        rectangleOptions: shapeOptions,
        // polygonOptions: shapeOptions,
    });
    drawingManager.setMap(m);

    clearShapes = () => {
        if (this.point) {
            this.point.setMap(null);
        }
        this.point = null;

        if (this.rectangle) {
            this.rectangle.setMap(null);
        }
        this.rectangle = null;

        // if (this.polygon) {
        //     this.polygon.setMap(null);
        // }
        // this.polygon = null;
    }

    let clearBtnMenu = document.createElement("div");
    clearBtnMenu.style.margin = "5px";
    clearBtnMenu.style.zIndex = "10";

    let clearBtnContainer = document.createElement("div");
    clearBtnContainer.style.lineHeight = "0";
    clearBtnMenu.appendChild(clearBtnContainer);

    let clearBtn = document.createElement("button");
    clearBtn.title = "Clear Map Shapes";
    clearBtn.id = "clear-polygon-btn";
    clearBtn.innerHTML = 'X';
    clearBtn.addEventListener("click", clearShapes);
    clearBtnContainer.appendChild(clearBtn);

    m.controls[google.maps.ControlPosition.TOP_CENTER].push(clearBtnMenu);

    let pointToWKT = (coord) => {
        return `POINT (${coord[0]} ${coord[1]})`;
    }
    let onPointDraw = (pnt) => {
        clearShapes()
        this.point = pnt
        let coord = [pnt.getPosition().lng(), pnt.getPosition().lat()]
        let wkt = pointToWKT(coord)
        shape = wkt
        console.log(wkt)
    }

    let rectangleToWKT = (coords) => {
        let wkt = "POLYGON ((";

        coords.forEach(coord => {
            wkt += `${coord[0]} ${coord[1]}, `;
        });

        wkt = wkt.slice(0, -2); // removes last ", "

        wkt += "))";

        return wkt;
    }
    let onRectangleDraw = (rect) => {
        clearShapes()
        this.rectangle = rect
        let ne = rect.getBounds().getNorthEast()
        let sw = rect.getBounds().getSouthWest()
        let coords = [
            [ne.lng(), ne.lat()],
            [ne.lng(), sw.lat()],
            [sw.lng(), sw.lat()],
            [sw.lng(), ne.lat()],
            [ne.lng(), ne.lat()]
        ];
        let wkt = rectangleToWKT(coords)
        shape = wkt
        console.log(wkt)
    }

    drawingManager.addListener("markercomplete", onPointDraw);
    drawingManager.addListener("rectanglecomplete", onRectangleDraw);
    // drawingManager.addListener("polygoncomplete", onPolygonDraw);
}

window.initMap = initMap;


