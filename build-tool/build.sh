#!/bin/bash

find **/*.md |sed 's/^\(.*\)\/\(.*\)\.md/- [\2](\1\/\2.md)/' > index.md
