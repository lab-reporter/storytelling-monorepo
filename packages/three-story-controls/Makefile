P := "\\033[32m[+]\\033[0m"

help:
	@echo "$(P) make dev - Start webpack dev server and watch any changes"
	@echo "$(P) make build - Transpile source codes to commonjs syntax"

dev: 
	@echo "$(P) Start webpack dev server"
	NODE_ENV=development yarn webpack serve -c dev/webpack.config.mjs

build-commonjs: 
	@echo "$(P) use babel to transpile typescript into commonjs"
	mkdir -p lib
	NODE_ENV=production yarn babel src --out-dir lib --extensions '.ts,.tsx,.js,.jsx' --copy-files --root-mode upward

build-esmodule:
	@echo "$(P) use rollup to transpile typescript into esmodule"
	mkdir -p lib
	yarn rollup -c rollup.config.mjs

build: clean build-commonjs build-esmodule

clean:
	@echo "$(P) Clean lib/"
	rm -rf lib/

.PHONY: build clean dev build-commonjs build-esmodule
