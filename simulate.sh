#!/bin/bash

for i in  {1..20}
do
	time ./simulator --duration=$i
done
