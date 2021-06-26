#!/usr/bin/env node

const path = require("path")
const { collector } = require(path.resolve(__dirname, "../dist/quyz.js"))

collector.collect()

