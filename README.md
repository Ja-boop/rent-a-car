# rent-a-car
Web site for the management of a car rental agency.

Demo in videos: [YouTube](https://www.youtube.com/playlist?list=PLROIQdlFrORqtQ8P_Y9BN93bJYiNfXH1m)

Javascript, HTML, CSS, Node.js, SQLite, Sequelize, Nunjucks, Bulma and Passport

Unit testing with Jest

# How to install and run this project

Install with **"npm install"**

Once installed, you need to copy the .env.txt file, and paste it with .env only. 

Then you need to complete the value in DB_PATH=VALUE, this path needs to end with a .db file

Also in CARIMAGE_UPLOAD_DIR=VALUE, I recommend creating the folder in public

The project runs with:

Script | Description
------------ | -------------
npm run dev | runs the project in dev mode
npm run schema:sync | sync the database with all the models
npm run test | runs jest tests and obtains the code coverage
npm run test:dev | runs jest tests in watch mode(continuously)

You need to create a user to access some rent functions

# Diagrams:

L1:

![L1](L1.png)

L2:

![L2](L2.png)

L3:

![L3](L3.png)
