include n.Makefile

unit-test:
	mocha --compilers js:babel-core/register --recursive --reporter spec test

test: verify unit-test
