# Mundu React Carousel
### Very light weight carousel for React Web. No dependencies

## install
```bash
$ npm install mundu-react-carousel --save
```

## Props

``` 
{
        width: '100%', // width can be integer/pixel/percentage
        maxWidth: 500, // maxWidth should be set for desktop and width for mobile
        height: 360, // height is mandatory. All child maintaing this height is ideal
        arrows: true, // show arrows
        arrowSize: 15, // size of the arrow
        arrowColor: 'white', // hashcodes/rgba
        extendedStyles: null, // expects js styles (object) for wrapper
        className: null, // css class for wrapper
        dots: true, // show dots(bool)
        dotStyle: null, // js styles for dots
        dotsClass: null, // className for dots wrapper
        dotClass: null // className for each dot
}
```

## Usage

```
<MunduCarousel maxWidth={500} height={350}>
    <children1 />
    <children2 />
    <children3 />
</MunduCarousel>
```

## Author
Ajith Kumar VM (ajithkumarvm@gmail.com)