import React from 'react';

export default class IndexScroll extends React.Component {

	constructor( props ) {

		super( props );

		this.state = {
			
			items: [],
			currentDisplayRange: [ this.props.start, this.props.start + this.props.display ]

		};

		this._preventScrollEvent = false;
		this._lastScrollTop = ( window.pageYOffset || document.documentElement.scrollTop ) - ( document.documentElement.clientTop || 0 );

		this.onUpdate = this._onUpdate.bind( this );
		this.onScroll = this._onScroll.bind( this );
		this.createItemList = this._createItemList.bind( this );

	}

	componentWillMount() {

		this.onUpdate( this.props );

	}
	
	componentWillReceiveProps( nextProps ) {

		this.onUpdate( nextProps );

	}

	componentDidMount() {
		
		this.onScroll();
		
	}

	_onUpdate( props ) {

		let currentDisplayRange = [];

		currentDisplayRange[0] = props.start;
		currentDisplayRange[1] = props.start + props.display;

		if( props.display > props.length ) {

			currentDisplayRange[1] = props.length;
			currentDisplayRange[0] = currentDisplayRange[1] - props.display; 

		} else if( currentDisplayRange[1] > props.length ) {

			currentDisplayRange[1] = props.length;
			currentDisplayRange[0] = currentDisplayRange[1] - props.display;

		}

		if( currentDisplayRange[0] < 0 ) {

			currentDisplayRange[0] = 0;

		}

		let items = this.createItemList( currentDisplayRange );
		this.setState( { currentDisplayRange: currentDisplayRange, items: items } );

	}

	_scrollTo( x, y, e ) {

		window.scrollTo

	}

	_onScroll() {
		
		window.addEventListener( 'scroll', () => {

			if( this._preventScrollEvent ) {

				this._preventScrollEvent = false;
				return;

			}

			let scrollTop = ( window.pageYOffset || document.documentElement.scrollTop ) - ( document.documentElement.clientTop || 0 );
			let direction = 0;
			let documentHeight = Math.max(

				document.body.scrollHeight, document.documentElement.scrollHeight,
				document.body.offsetHeight, document.documentElement.offsetHeight,
				document.body.clientHeight, document.documentElement.clientHeight

			);

			if( scrollTop > this._lastScrollTop )
				direction = 1;
			else if( scrollTop < this._lastScrollTop )
				direction = -1;

			this._lastScrollTop = scrollTop;

			let currentDisplayRange = this.state.currentDisplayRange;

			let firstElementIndex = currentDisplayRange[0] - this.props.padding;
			if( firstElementIndex < 0 ) firstElementIndex = 0;
			let firstElementBounds = document.getElementById( 'IndexScrollItem-' + firstElementIndex ).getBoundingClientRect();
			let lastElementBounds = document.getElementById( 'IndexScrollItem-' + ( currentDisplayRange[1] - 1 ) ).getBoundingClientRect();

			if( direction == -1 && firstElementBounds.top + this.props.threshold > 0 ) {

				currentDisplayRange[0] -= this.props.display;
				currentDisplayRange[1] -= this.props.display;

				if( currentDisplayRange[0] >= 0 ) {

					let items = this.createItemList( currentDisplayRange );
					
					this.setState( { 
						items: items,
						currentDisplayRange: currentDisplayRange
					}, () => {

						let element = document.getElementById( 'IndexScrollItem-' + currentDisplayRange[0] );
						let bounds = element.getBoundingClientRect();

						this._preventScrollEvent = true;
						window.scrollTo( 0, window.scrollY + bounds.top + this.props.threshold );
						
					} );

				} else {

					currentDisplayRange[0] = 0;
					currentDisplayRange[1] = this.props.display;

					this.setState( { currentDisplayRange: currentDisplayRange } );

				}

			} else if( direction == 1 && lastElementBounds.bottom - window.innerHeight - this.props.threshold < 0 ) {

				let currentDisplayRange = this.state.currentDisplayRange;
	
				currentDisplayRange[0] += this.props.display;
				currentDisplayRange[1] += this.props.display;

				if( currentDisplayRange[1] <= this.props.length ) {

					let items = this.createItemList( currentDisplayRange );
					
					this.setState( { 
						items: items,
						currentDisplayRange: currentDisplayRange 
					}, () => {
							
						let element = document.getElementById( 'IndexScrollItem-' + ( currentDisplayRange[0] - 1 ) );
						let bounds = element.getBoundingClientRect();

						let y = window.scrollY + bounds.top - ( window.innerHeight - bounds.height ) - this.props.threshold;

						this._lastScrollTop = y - 1;
						this._preventScrollEvent = true;
						window.scrollTo( 0, y );
							
					} );

				} else {

					currentDisplayRange[1] = this.props.length;
					currentDisplayRange[0] = currentDisplayRange[1] - this.props.display;

					this.setState( { currentDisplayRange: currentDisplayRange } );

				}

			}

		} );

	}
	
	_createItemList( range ) {
		
		let items = [];
		let rangeFrom = range[0];
		let rangeTo = range[1]; 

		if( rangeFrom > 0 ) {

			rangeFrom -= this.props.padding;
			if( rangeFrom < 0 ) rangeFrom = 0;

		}

		for( let i = rangeFrom; i < rangeTo; i++ ) {
			
			let key = 'IndexScrollItem-' + i;
			items.push( this.props.itemRenderer( i, key ) );
					
		}
		
		return items;
		
	}

	render() {

		let items = this.state.items;

		return (

			<div>
			{ items.map( ( item ) => {

				return item;

			} ) }
			</div>

		);

	}

}

IndexScroll.defaultProps = {

	start: 0,
	display: 5,
	length: 0,
	padding: 5,
	threshold: 100,
	itemRenderer: function() { return null; }

};

IndexScroll.propTypes = {

	start: React.PropTypes.number,
	display: React.PropTypes.number,
	length: React.PropTypes.number,
	padding: React.PropTypes.number,
	threshold: React.PropTypes.number,
	itemRenderer: React.PropTypes.func

};
