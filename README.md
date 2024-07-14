npm init // to initialize node project \
npm install cypress --save-dev // to install cypress in this project \
npx cypress open // to open cypress \
npx cypress run // to run cypress headless \
npx cypress run --browser chrome // to run cypress headless on chrome \
npx cypress run --spec "path_to_file" // to run only spec file with path \
npm install --save-dev start-server-and-test // install start server and test package \
npx cypress open --env username=cytest@test.com,password=123456 // to override env variable  \
DB_USERNAME="abc@abc.com" PASSWORD="123456" npm run cy:open_process // execute with process environment \
