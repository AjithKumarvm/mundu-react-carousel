# Nestawat React Component Library

## Getting started

Add this to module->rules in webpack

``` 
{
        test: /.scss$|.css$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader",
            options: {
                    sourceMap: true
            } // translates CSS into CommonJS
        }, {
            loader: "sass-loader",
            options: {
              sourceMap: true
            } // compiles Sass to CSS
        }]
}
```

Install dependencies:

> `npm install --save css-loader node-sass sass-loader style-loader`

You can use it by:

> `import {FloatingInput} from 'nestaway-component-library';` <br />
> `<FloatingInput labelName="Enter your name" onChange={onNameChange} />`


## What about CSS?

### Separate CSS file

Keep in mind that it is a bad idea to import the css directly into your component file. This requires the webpack style-loader to work, so any user of your package that does not use this loader will be screwed.
