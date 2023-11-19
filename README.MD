# Bet Buddy
Bet Buddy is an app to help you manage your sports betting!

# Running Locally
Git clone the repo. Then run:
npm install
npm start

For the Web UI, go to local port 5001;

# Deploying the App
From the root folder do:
npm run build
cloud app deploy Web-UI/app.yaml Authentication/app.yaml 
*Note that you can chose to only deploy the services you want to, doesn't need to be all of them*

# Troubleshooting
If npm install fails, delete the package-lock.json file from the directory the error happened in:
rm package-lock.json

Then clear the cache of that directory with:
npm cache clean --force

Then install the dependencies again:
npm install