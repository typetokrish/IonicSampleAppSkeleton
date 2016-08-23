# Ionic / Angular Sample App Skeleton
===================================================================================================================

Sharing the Ionic/Angular part of hybrid mobile app . This might help to understand how the Authentication, Service, Controller , Side Menu layouts etc works on  an ionic app . This was used in a public facing app as trial version (Experimental) .

=================================================================================================================== 
## What includes
All Html files , Controller Logic, Web service logic is added . Need to replace the web service urls with real one .
App checks for a valid token in local storage to detect an authenticated user. If not valid, will present a login screen. The side menu changes based on the Login / Logged out status of the user .  Every other request to the web service need an Auth Bearer in request header which should be a JWT token created and supplied by the Login web service .

Check the "screens" folder to see how the app Home screen and side mene displayed .



