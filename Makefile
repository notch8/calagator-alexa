calagator: index.js lib node_modules package.json
	zip -r dist/calagator.zip index.js lib node_modules package.json
	aws s3 cp dist/calagator.zip s3://calagator-lambda/
