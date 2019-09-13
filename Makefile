include .env

run:
	@echo "\n*** Preparing to run localy ***\n"
	# $(MAKE) clean
	# $(MAKE) install
	# $(MAKE) test
	$(MAKE) buildLocal
	@echo "Build OK, starting with SAM-local"
	sam local start-api

deployDev:
	@echo "\n*** Preparing to run on Dev ***\n"
	$(MAKE) clean
	$(MAKE) install
	# $(MAKE) test
	$(MAKE) buildDev
	# $(MAKE) uploadToDev
	@echo "*** Deploy to dev done ***\n"

deployStage:
	@echo "\n*** Preparing to run on Stage ***\n"
	$(MAKE) clean
	$(MAKE) install
	# $(MAKE) test
	$(MAKE) buildStage
	$(MAKE) uploadToStage
	@echo "*** Deploy to Stage done ***\n"

deployProd:
	@echo "\n*** Preparing to run on Prod ***\n"
	$(MAKE) clean
	$(MAKE) install
	# $(MAKE) test
	$(MAKE) buildProd
	$(MAKE) uploadToProd
	@echo "*** Deploy to Prod done ***\n"	

buildLocal:
	@echo "Ready to build"
	[ -d aws ] || mkdir -p aws
	CGO_ENABLED=0 GOOS=linux go build -ldflags '-X "main.DBHost=$(DB_HOST_LOCAL)" -X "main.DBUser=$(DB_USER_LOCAL)" -X "main.DBPassword=$(DB_PASSWORD_LOCAL)" -X "main.DBName=$(DB_NAME_LOCAL)" -X "main.DBDriver=$(DB_DRIVER)"' -o AWS/main
	zip -j AWS/main.zip AWS/main
	@echo "Build OK!"

buildDev:
	@echo "Ready to build"
	[ -d aws ] || mkdir -p aws
	CGO_ENABLED=0 GOOS=linux go build -ldflags '-X "main.DBHost=$(DB_HOST_DEV)" -X "main.DBUser=$(DB_USER_DEV)" -X "main.DBPassword=$(DB_PASSWORD_DEV)" -X "main.DBName=$(DB_NAME_DEV)" -X "main.DBDriver=$(DB_DRIVER)"' -o AWS/main
	zip -j AWS/main.zip AWS/main
	@echo "Build OK!"

buildStage:
	@echo "Ready to build"
	[ -d aws ] || mkdir -p aws
	CGO_ENABLED=0 GOOS=linux go build -ldflags '-X "main.DBHost=$(DB_HOST_STAGE)" -X "main.DBUser=$(DB_USER_STAGE)" -X "main.DBPassword=$(DB_PASSWORD_STAGE)" -X "main.DBName=$(DB_NAME_STAGE)" -X "main.DBDriver=$(DB_DRIVER)"' -o AWS/main
	zip -j AWS/main.zip AWS/main
	@echo "Build OK!"

buildProd:
	@echo "Ready to build"
	[ -d aws ] || mkdir -p aws
	CGO_ENABLED=0 GOOS=linux go build -ldflags '-X "main.DBHost=$(DB_HOST_PROD)" -X "main.DBUser=$(DB_USER_PROD)" -X "main.DBPassword=$(DB_PASSWORD_PROD)" -X "main.DBName=$(DB_NAME_PROD)" -X "main.DBDriver=$(DB_DRIVER)"' -o AWS/main
	zip -j AWS/main.zip AWS/main
	@echo "Build OK!"

uploadToDev:
	@echo "Uploading to Dev\n"
	@echo "TODO"

uploadToStage:
	@echo "Uploading to Stage\n"
	@echo "TODO"

uploadToProd:
	@echo "Uploading to Prod\n"
	@echo "TODO"

clean:
	@echo "Cleaning"
	rm -rf aws/
	rm -rf vendor/

install:
	@echo "Installing deps ..."
	dep ensure