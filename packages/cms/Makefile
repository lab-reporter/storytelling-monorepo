P := "\\033[32m[+]\\033[0m"

help:
	@echo "$(P) make build-deps - build core, draft-editor and draft-renderer"
	@echo "$(p) make postinstall - run after dependencies installation"

postinstall: build-deps
	@yarn patch-package;
	@yarn keystone postinstall --fix;

build-deps:
	@if [ "$(SKIP_BUILD_DEPS)" = "true" ]; then \
		echo "Build skipped."; \
	else \
		echo "$(P) build core, draft-editor and draft-renderer"; \
		cd ../core; make build; \
		cd ../draft-editor; make build; \
		cd ../draft-renderer; make build; \
	fi

.PHONY: build-deps
