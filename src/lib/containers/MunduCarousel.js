import React from 'react'

const styles = {
    carouselWrapper: {
        width: 500,
        height: 360,
        display: 'inline-block',
        position:'relative',
        border:'1px solid #CCC',
        marginLeft: 200,
        touchAction: 'none'
    },
    slideWrapper: {
        position:'absolute',
        top:0,
        left:0
    }
}
const getCurrentStyle = index => {
    const positions = {
        0: {transform: 'translateX(-100%)'},
        1: {transform: 'translateX(0%)'},
        2: {transform: 'translateX(100%)'}
    }
    return positions[index]
}

const getPosition = (element) => {
    let xPosition = 0;
    let yPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }

    return { x: xPosition, y: yPosition };
}

class MunduCarousel extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            data:293,
            left: 0,
            center:1,
            right:2,
            currentSlidePerc:0
        }
    }
    componentDidMount(){
        window.addEventListener("touchstart", ()=>null, {passive: false} );
        this.setState({
            slides: this.props.children.length
        })
    }
    getTouchParams(event){
        const carouselWrapper = this.refs.carouselWrapper 
        const carouselWidth = carouselWrapper.offsetWidth
        const touchX = event.changedTouches[0].pageX
        const offsetX = event.changedTouches[0].target.offsetLeft || event.changedTouches[0].target.x
        const relativeOffset = touchX - offsetX
        const percToMove = (relativeOffset)/carouselWidth * 100
        return {percToMove}
    }
    onTouchStart(event){ 
        event.preventDefault()
        event.stopPropagation()
        const {percToMove} = this.getTouchParams(event)
        this.setState({
            currentSlidePerc: percToMove
        })
    }
    onTouchEnd(event){ 
        event.preventDefault()
        event.stopPropagation()
        const {percToMove} = this.getTouchParams(event)
        this.setState({
            currentSlidePerc: percToMove
        })
    }
    onTouchMove(event){
        event.preventDefault()
        event.stopPropagation()
        const {percToMove} = this.getTouchParams(event)
        const currentSlidePerc = this.state.currentSlidePerc
        const {left, center, right} = this.state
        const center_slide = this.refs[`slide_${center}`]
        center_slide.style.transform = `translateX(${percToMove - currentSlidePerc}%)`
        const left_slider = this.refs[`slide_${left}`]
        left_slider.style.transform = `translateX(${percToMove - currentSlidePerc-100}%)`
        const right_slider = this.refs[`slide_${right}`]
        right_slider.style.transform = `translateX(${percToMove - currentSlidePerc+100}%)`
        
    }
    render(){
        const {left, right} = this.state
        return <div style={styles.carouselWrapper} ref='carouselWrapper' 
            onTouchStart = {this.onTouchStart.bind(this)} 
            onTouchMove={this.onTouchMove.bind(this)}
            onTouchEnd={this.onTouchEnd.bind(this)}>
            {this.props.children.slice(left,right+1).map((child, index)=>{
                return <div style={{...styles.slideWrapper, ...getCurrentStyle(index)}} key={index} ref={`slide_${index}`}>
                    {child}
                </div>
            })}
        </div>
    }
}

export default MunduCarousel