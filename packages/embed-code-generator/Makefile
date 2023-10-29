P := "\\033[32m[+]\\033[0m"

help:
	@echo "$(P) make build - Transpile jsx, es6 and above to es5 files, and build webpack bundles"

dev: clean
	@echo "$(P) Build dev webpack chunks, bundles and webpack-assets.json"
	NODE_ENV=development yarn webpack --config webpack.config.js
	@echo "$(P) Start webpack dev server"
	NODE_ENV=development yarn webpack serve -c dev/webpack.config.js

build-dist: 
	@echo "$(P) Build webpack chunks, bundles and webpack-assets.json"
	NODE_ENV=production yarn webpack --config webpack.config.js

build-lib:
	@echo "$(P) Transpile es6, jsx and (typescript) to es5"
	NODE_ENV=production yarn babel src --out-dir lib --copy-files --root-mode upward

build: clean build-dist build-lib

clean:
	@echo "$(P) Clean lib/ dist/"
	rm -rf lib/ dist/

.PHONY: build clean dev build-dist build-lib
