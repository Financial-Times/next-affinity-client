include n.Makefile

unit-test:
	mocha --recursive --reporter spec test

test: verify unit-test
