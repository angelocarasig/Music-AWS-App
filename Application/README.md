# Application
This Application has been configured to communicate with AWS. The environments file details the API gateway used and its structure.
In order to run this application locally you can perform the following:

1. Running npm install in this folder
2. Start the application with `ng serve`

As it has been configured to use the API Gateway, there are no local .aws keys required to be able to run it. As long as the tables are accessible and the endpoints are accessible, the application should work as expected locally. 