# Contentful PlantUML generator

Quickly get an overview of a Contentful space.

## Usage

```
contentful-plantuml-generator ${SPACE_ID} ${CONTENT_MANAGEMENT_TOKEN} \
  | plantuml -pipe -tsvg \
  > my-diagram.svg
```

## Info

This tool generates a class diagram based on a Contentful space. It fetches the Contentful "Content Model" of a specified space and then converts this to PlantUML syntax. You can then generate a diagram using the PlantUML CLI.

It's pretty MVP. So there might be cases where the script fails.

## Requirements

* [Node.js (> 8.9)](https://nodejs.org/)
* [PlantUML](http://plantuml.com)

## Installation

```
npm i -g contentful-plantuml-generator
```
