#!/bin/bash

for i in  {1..60}
do
	time ./simulator --duration=$i
done
