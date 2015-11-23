# ancient-dna
http://xn--o4c.xyz/  
http://ฺ.xyz/  

# Installation

## Debian linux (Ubuntu)
```
wget -qO- https://deb.nodesource.com/setup_4.x | sudo bash -  
sudo apt-get install --yes nodejs  
npm install  
```

## OSX 

installation using homebrew.
```
brew install node 
```

# Testing

Navigate to web directory and run node.

```
cd web 
npm start
```

# Information

##web
- **models**: contains the information of the structure of database tables for the web side
- **public**: any files that are public facing
  - **angularApp.js**: the main script run on the client side, uses Google's Angular library and handles translation from the directives in ejs files to html and routing.
  - **.ejs**: these files are essentially the different pages. They are not pure HTML as they contain directives (denoted by {{ }}), these directives are translated by Angular into HTML at run time.
- **routes**: server-side code to be run when certain pages are navigated to.
- **views**: web-pages that will be served by the node server
- **app.js**: used to start running the node server
- **package.json**: describes the node application including all required node packages