# Digital Atlas API Clients

This repository contains Jupyter Notebooks and web pages that act as clients of Linked Data APIs established as part of the Digital Atlas of Australia.

The technical targets of these clients are [SpacePrez](https://github.com/surroundaustralia/Prez/) APIs which are 2nd-generation [Location Index (LocI)](http://ga.gov.au/locationindex) APIs. SpacePrez APIs implement [OGC API](https://ogcapi.ogc.org/), [Linked Data API](https://www.w3.org/standards/semanticweb/data) and [SPARQL Protocol](https://www.w3.org/TR/sparql11-protocol/) standards for the delivery of spatial data on the Web. These clients demonstrate use of all three.


## Particular APIs

The particular targets of these client Notebooks are a series of SpacePrez APIS that have been build for [Geoscience Australia](https://www.ga.gov.au)'s [Digital Atlas](https://www.ga.gov.au/scientific-topics/national-location-information/digital-atlas-of-australia) project. The data that these APIs deliver was originally delivered online in forms similar to SpacePrez for the [Location Index (LocI)](http://ga.gov.au/locationindex) project which ran from 2018 - 2020.

The targeted APIs are:

1. [Australian Statistical Geographies Standard (ASGS) 2021]()
2. [Australian Hydrological Geospatial Fabric (Geofabric) v3]()
3. [Geocoded National Address File (G-NAF)]()
4. [FSDF Datasets]() 


## Client Aims

These Notebooks are aimed at two things:

1. replicating the functionality of the LocI _Explorer_ and _IderDown_ clients
    * (see http://loci.cat/#datasets-and-applications)
2. acting as general-purpose, configurable (scriptable) SpacePrez clients 
    * to demonstrate how interactions with SpacePRez APIs can occur
    * to be configured for specific tasks


# Use

## Explorer:
Run the `web/explorer/index.html` through an IDE, such as PyCharm (right click, 'Run').

## Iderdown:
These Notebooks can be run locally, if you have a Jupyter Notebooks setup on your desktop, or they can be run online using:

<!-- * https://mybinder.org/v2/gh/surroundaustralia/daa-api-clients/fcbb9d511a6f441f8cd65c19af4ee3d2de5a8f08?urlpath=lab%2Ftree%2Fnotebooks%2FIderDown.ipynb -->

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/surroundaustralia/daa-api-clients/HEAD?labpath=%2Fnotebooks%2FIderDown.ipynb)

To run locally, you will need a [Python Poetry](https://python-poetry.org/) environment established and then to run the Jupyter server.


# License & Copyright

These were originally built by [SURROUND Australia Pty Ltd](https://surroundaustralia.com) for [Geoscience Australia](https://www.ga.gov.au) in 2022. They are available for use and extension under the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) license, a copy of the deed of which is in the file [LICENSE](LICENSE) in this repository.

&copy; Commonwealth of Australia (Geoscience Australia), 2022


# Contact

This Notebook was developed by:

**Nicholas J. Car**  
_Data Systems Architect_  
[SURROUND Australia Pty Ltd](https://surroundaustralia.com)  
<nicholas.car@surroundaustralia.com>

Please contact him for any technical matters in 2022.

The Notebooks are owned by and will be maintained by:

**National Land Information Division**  
[Geoscience Australia](https://www.ga.gov.au)  

Please contact Tina Yang (<Tina.Yang@ga.gov.au>) within NLI for all enquiries.
