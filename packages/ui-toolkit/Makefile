P := "\\033[32m[+]\\033[0m"

help:
	@echo "$(P) make dev - Start webpack dev server and watch any changes"
	@echo "$(P) make build - Transpile source codes to commonjs syntax"

dev: 
	@echo "$(P) Start webpack dev server"
	NODE_ENV=development yarn webpack serve -c dev/webpack.config.mjs

build-lib:
	@echo "$(P) Transpile source codes to commonjs syntax"
	mkdir -p lib
	NODE_ENV=production yarn babel src --out-dir lib --extensions '.ts,.tsx,.js,.jsx' --copy-files --root-mode upward

build: clean build-lib

clean:
	@echo "$(P) Clean lib/"
	rm -rf lib/

.PHONY: build clean dev build-lib
