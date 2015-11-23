# HTML Chat

## Purpose
The purpose of this program was to create an educational tool that could be used in lessons. The idea would be to let pupils try and communicate via the website. This will give them exposure to using the console, typing simple javascript and practicing using HTML tags - hopefully in a context that they will find engaging. 

## Status and Warning
The code in the repository works as far as I have tested it but it is still in development and their are probably rough edges that I'm not aware of. Also this program is meant for use on internal (school) networks only.

__As this program allows arbitary HTML/JavaScript to be inserted on a page it is not secure and should not be used where it can be accessed via the public Internet.__

## Acknowledgement
This repository was based on one of the example I found on the socket.io website - it was really useful and if you are starting out with socket.io I recommend looking at them.

## Suggested Learning Objectives
In terms of a progression of activities the following may work for you. There is obviously a good deal of scope for playing around at each level and there is plenty of opporunities for extension activities for even the most able of students.

* Use of Console - pupils look under the hood and see a little bit of what it going on.
* Use of JavaScript - see the syntax for calling functions and practice using it.
* Use of Simple HTML - All messages need to be in HTML so they will need to use p, h1, etc tags or they will be unable to send any information.
* Use of Attributes - As tags are properly displayed on others screens they will be able to send images and links to each other if they learn how to use the attributes of the respective tags.
* Use of Scripts - For the more advances there is nothing stopping them from sending scripts to each others. Obviously there is a security issue but with a standard class that isn't much of a worry.
* Web Security and Code Injection - the way the server is currently set up they can run arbitary code in each others browsers. This is possibly a good way of explaining code injection type attacks and demonstrating how they work.

## Requirements
You need a server with Node and Npm installed - that's it! If you feel like doing some work on the code you could consider installing nodemon to make you life a bit easier.

## Installing and Running
Again really not much to it. Clone or download the repository and change into the root folder. Use npm to install the dependencies and then start the server as shown below. The server will run on port 3000 unless the PORT enviornment variable is set to something else.

```
npm install

npm start
```

If you are planning on editing the code, and you have nodemon installed, then you can use `npm run devstart` to save you time.

## Using the Site
This site will be available at http://*hostname*:3000/ and should work with most modern browsers. A help section should appear on pupils screen when they open the site.
