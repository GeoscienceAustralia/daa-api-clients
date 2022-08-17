import {shape, setShape, clearShapes, m} from "./map.js";

function check(ths, cls) {
    const cbxs = document.getElementsByClassName(cls);
    let setTo = false;
    if (ths.checked) {
        setTo = true;
    }
    for (var i = 0; i < cbxs.length; i++) {
        cbxs[i].checked = setTo;
    }
}

async function spql(url, query) {
    console.log('querying ' + url)
    let url2 = new URL(url)
    url2.searchParams.append("query", query)
    let options = {
        headers: {
            'Content-Type': 'application/sparql-results+json',
        },
    }

    let response = await fetch(url2, options)

    if (response.ok) {
        return await response.json()
    } else {
        alert("HTTP-Error: " + response.status)
    }
}

function get_endpoint() {
    let v = document.getElementById('endpoint').value
    if (!v) {
        alert('Please enter an API endpoint')
        return null
    } else {
        return v.endsWith('/') ? v = v + 'sparql' : v = v + '/sparql'
    }
}


function make_query_fcs() {
    // let dataset_restrictions = []
    // const cbxs = document.querySelectorAll('.restriction-dataset')
    // for (var i = 0; i < cbxs.length; i++) {
    //     if (cbxs[i].checked) {
    //         dataset_restrictions.push(`<${cbxs[i].id}> rdfs:member/rdfs:member ?f .`)
    //     }
    // }

    let fc_restrictions = []
    const cbxs2 = document.querySelectorAll('.restriction-fc')
    for (var i = 0; i < cbxs2.length; i++) {
        if (cbxs2[i].checked) {
            fc_restrictions.push(`<${cbxs2[i].id}> rdfs:member ?f_uri .`)
        }
    }

    // let ds = '{ ' + dataset_restrictions.join('}\n    UNION\n    {') + ' }'
    if (fc_restrictions.length > 0) {
        return '\n    { ' + fc_restrictions.join('}\n    UNION\n    {') + ' }\n'
    } else {
        return ''
    }
}

function make_query_topo_filter() {
    let geosparql;
    if (document.getElementById('spatial-contains').checked) {
        geosparql = `    FILTER (geof:sfContains("${shape}"^^geo:wktLiteral, ?wkt))`
    } else if (document.getElementById('spatial-within').checked) {
        geosparql = `    FILTER (geof:sfWithin("${shape}"^^geo:wktLiteral, ?wkt))`
    } else if (document.getElementById('spatial-nearby').checked) {
        let radius = document.getElementById('nearby-radius').value
        geosparql = `    FILTER (spatialF:nearby("${shape}"^^geo:wktLiteral, ?wkt, ${radius}, unit:kilometre))`
    } else {
        geosparql = `    FILTER (geof:sfOverlaps("${shape}"^^geo:wktLiteral, ?wkt))`
    }
    return geosparql
}

export async function search() {
    // document.getElementById('resultsList').style.display = 'none';
    if (!shape) {
        alert("You have not marked a point or a square on the map!")
    } else {
        let endpoint = 'https://linked.fsdf.org.au/sparql'
        let sparql_limit = document.getElementById('max-results').value
        document.getElementById('resultsList').style.display = 'block'
        document.getElementById('resultsList').innerHTML = '<h2>Searching for features...</h2>'
        let q =
            `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX spatialF: <http://jena.apache.org/function/spatial#>
PREFIX unit: <http://www.opengis.net/def/uom/OGC/1.0/>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT ?f_uri ?geojson ?label ?fc_label
WHERE {
    ?f_uri a geo:Feature ;
        rdfs:label ?label ;
       geo:hasGeometry/geo:asWKT ?wkt ;
       geo:hasGeometry/geo:asGeoJSON ?geojson ;
       OPTIONAL {?f_uri dcterms:isPartOf ?fc .
                ?fc rdfs:label\|dcterms:title ?potential_fc_label .}
        BIND(COALESCE(?potential_fc_label, "") AS ?fc_label)
        

${make_query_fcs()}
${make_query_topo_filter()}
}
LIMIT ${sparql_limit}
`

        if (document.getElementById('queryOnly').checked) {
            document.getElementById('resultsList').innerHTML = q.replaceAll('<', '&lt;')
            document.getElementById('resultsList').style.display = 'block'
        } else {
            let r = await spql(endpoint, q)

            // console.log(r)
            let f_count = r['results']['bindings'].length
            if (f_count > 0) {
                let htmlstring = '<table><tr><th></th><th>Label</th><th>Feature Collection</th><th>URI</th></tr>'
                for (var i = 0; i < r['results']['bindings'].length; i++) {
                    let geojson = r['results']['bindings'][i]['geojson']['value']
                    let f_uri = r['results']['bindings'][i]['f_uri']['value']
                    let fc_label = r['results']['bindings'][i]['fc_label']['value']
                    let f_label = r['results']['bindings'][i]['label']['value']
                    let feature_geojson = {
                        "type": "Feature",
                        "geometry": JSON.parse(geojson),
                        "properties": {
                            "uri": f_uri,
                            "label": f_label
                        }
                    }
                    let counter = i + 1
                    m.data.addGeoJson(feature_geojson);
                    htmlstring += '<tr><td>' + counter + '</td><td>' + f_label + '</td><td>' + fc_label + '</td><td><a href="' + f_uri + '" target="_blank">' + f_uri + '</a></td></tr>'
                }
                htmlstring += '</table>'
                document.getElementById('resultsList').innerHTML = htmlstring
                feature_infowindow()
                var bounds = new google.maps.LatLngBounds();
                m.data.forEach(function (feature) {
                    feature.getGeometry().forEachLatLng(function (latlng) {
                        bounds.extend(latlng);
                    });
                });
                m.fitBounds(bounds);
            } else {
                document.getElementById('resultsList').innerHTML = '<em>No results found!</em>'
            }
            document.getElementById('resultsList').style.display = 'block'
        }
    }
}

export async function select_object() {
    let object_uri = document.getElementById('location-feature').value

    let endpoint = 'https://linked.fsdf.org.au/sparql'

    let q =
        `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?wkt ?geojson ?label
WHERE {
    \<${object_uri}\> a geo:Feature ;
       geo:hasGeometry/geo:asWKT ?wkt ;
       geo:hasGeometry/geo:asGeoJSON ?geojson .
       OPTIONAL {\<${object_uri}\> rdfs:label ?given_label }
       BIND(COALESCE(?given_label, "${object_uri}") AS ?label)
}`
    let r = await spql(endpoint, q)
    if (r['results']['bindings'].length > 0) {
        document.getElementById('resultsList').innerHTML = '<h2>Map updated!</h2>'
        for (var i = 0; i < r['results']['bindings'].length; i++) {
            let geojson = r['results']['bindings'][i]['geojson']['value']
            let f_label = r['results']['bindings'][i]['label']['value']
            let feature_wkt = r['results']['bindings'][i]['wkt']['value']
            let feature_geojson = {
                "type": "Feature",
                "geometry": JSON.parse(geojson),
                "properties": {
                    "uri": object_uri,
                    "label": f_label
                }
            }
            m.data.addGeoJson(feature_geojson);
            var bounds = new google.maps.LatLngBounds();
            m.data.forEach(function (feature) {
                feature.getGeometry().forEachLatLng(function (latlng) {
                    bounds.extend(latlng);
                });
            });
            setShape(feature_wkt)
            m.fitBounds(bounds);
        }
    } else {
        document.getElementById('resultsList').innerHTML = '<em>No results found!</em>'
    }
}

function feature_infowindow() {
    var infowindow = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(0, -40)
    });
    m.data.addListener('mouseover', function (evt) {
        infowindow.setContent(
            `<a href="${evt.feature.getProperty('uri')}" target="_blank">${evt.feature.getProperty('label')}</a><br>
        <small>URI: ${evt.feature.getProperty('uri')}</small>`
        );
        infowindow.setPosition(evt.latLng);
        infowindow.open(m);
    })
}


function reset() {
    clearShapes()
    const cbxs = document.querySelectorAll('.restriction-dataset, .restriction-fc');
    for (var i = 0; i < cbxs.length; i++) {
        cbxs[i].checked = false;
    }

    m.data.forEach(function (feature) {
        m.data.remove(feature);
    });

    document.getElementById('queryOnly').checked = false

    document.getElementById('resultsList').style.display = 'none'

    document.getElementById('spatial-nearby').checked = true

    document.getElementById('queryOnly').checked = false
}

window.check = check
window.search = search
window.reset = reset
window.select_object = select_object